import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { z } from "zod";

export const runtime = "nodejs";

const localizedSchema = z.object({ ar: z.string(), en: z.string() });
const resultSchema = z.object({
  title: localizedSchema,
  summary: localizedSchema,
  findings: z.array(localizedSchema).min(2).max(4),
  actions: z.array(localizedSchema).min(2).max(4),
  confidence: z.number().min(0).max(100),
});

const requestSchema = z.object({
  page: z.string().min(1).max(80),
  dataset: z.record(z.string(), z.unknown()),
});

const outputSchema = {
  type: "object",
  additionalProperties: false,
  required: ["title", "summary", "findings", "actions", "confidence"],
  properties: {
    title: localizedJson(),
    summary: localizedJson(),
    findings: { type: "array", minItems: 2, maxItems: 4, items: localizedJson() },
    actions: { type: "array", minItems: 2, maxItems: 4, items: localizedJson() },
    confidence: { type: "number", minimum: 0, maximum: 100 },
  },
} as const;

const CACHE_TTL_MS = 5 * 60 * 1000;
const cache = new Map<string, { expiresAt: number; result: z.infer<typeof resultSchema> }>();

function localizedJson() {
  return {
    type: "object",
    additionalProperties: false,
    required: ["ar", "en"],
    properties: { ar: { type: "string" }, en: { type: "string" } },
  };
}

export async function POST(request: Request) {
  if (!process.env["OPENAI_API_KEY"]) {
    return NextResponse.json({ error: "Qasimyah ML Model is not configured." }, { status: 503 });
  }

  try {
    const body = await request.text();
    if (body.length > 500_000) {
      return NextResponse.json({ error: "Page context is too large." }, { status: 413 });
    }

    const input = requestSchema.parse(JSON.parse(body));
    const cacheKey = createHash("sha256").update(body).digest("hex");
    const cached = cache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) return NextResponse.json(cached.result);
    if (cached) cache.delete(cacheKey);

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: Record<string, unknown>) =>
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

        try {
          send({ type: "progress", progress: 15, stage: "context_validated" });
          const response = await fetch("https://api.openai.com/v1/responses", {
            method: "POST",
            headers: {
              Authorization: `Bearer ${process.env["OPENAI_API_KEY"]}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              model: process.env["OPENAI_MODEL"] ?? "gpt-4.1-mini",
              store: false,
              stream: true,
              max_output_tokens: 1200,
              instructions:
                "You are Qasimyah ML Model, a bilingual government communication intelligence system. Analyze only the supplied dataset for the requested application page. Produce concise, decision-ready findings and actions relevant to that page. Clearly distinguish measured information from model recommendations. Never invent records, observed outcomes, or personal information. Return Modern Standard Arabic and English.",
              input: `Active page: ${input.page}\nCurrent validated dataset:\n${JSON.stringify(input.dataset)}`,
              text: {
                format: {
                  type: "json_schema",
                  name: "sharja_page_analysis",
                  strict: true,
                  schema: outputSchema,
                },
              },
            }),
          });

          if (!response.ok) {
            const error = (await response.json()) as { error?: { message?: string } };
            throw new Error(error.error?.message ?? "Qasimyah ML Model request failed.");
          }
          if (!response.body) throw new Error("Qasimyah ML Model returned no response stream.");
          send({ type: "progress", progress: 35, stage: "model_connected" });

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let outputText = "";
          let lastProgress = 35;

          while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            buffer += decoder.decode(value, { stream: true });
            const blocks = buffer.split(/\r?\n\r?\n/);
            buffer = blocks.pop() ?? "";
            for (const block of blocks) {
              const dataLine = block.split(/\r?\n/).find((line) => line.startsWith("data:"));
              if (!dataLine) continue;
              const raw = dataLine.slice(5).trim();
              if (!raw || raw === "[DONE]") continue;
              const event = JSON.parse(raw) as {
                type?: string;
                delta?: string;
                text?: string;
                error?: { message?: string };
              };
              if (event.type === "response.output_text.delta" && event.delta) {
                outputText += event.delta;
                const nextProgress = Math.min(90, 35 + Math.floor(outputText.length / 18));
                if (nextProgress > lastProgress) {
                  lastProgress = nextProgress;
                  send({ type: "progress", progress: nextProgress, stage: "model_streaming" });
                }
              }
              if (event.type === "response.output_text.done" && event.text) {
                outputText = event.text;
              }
              if (event.type === "response.failed") {
                throw new Error(event.error?.message ?? "Qasimyah ML Model streaming failed.");
              }
            }
          }

          if (!outputText) throw new Error("Qasimyah ML Model returned no output.");
          send({ type: "progress", progress: 94, stage: "validating_output" });
          const result = resultSchema.parse(JSON.parse(outputText));
          cache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, result });
          send({ type: "result", progress: 100, result });
        } catch (error) {
          send({
            type: "error",
            error: error instanceof Error ? error.message : "Unexpected model error.",
          });
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "application/x-ndjson; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
      },
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid page analysis data." }, { status: 400 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected model error." },
      { status: 500 },
    );
  }
}
