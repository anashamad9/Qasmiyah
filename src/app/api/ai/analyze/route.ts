import { NextResponse } from "next/server";
import { createHash } from "node:crypto";
import { z } from "zod";

export const runtime = "nodejs";

const levelSchema = z.enum(["LOW", "MEDIUM", "HIGH"]);
const localizedSchema = z.object({ ar: z.string(), en: z.string() });

const analysisSchema = z.object({
  summary: localizedSchema,
  concerns: z.array(localizedSchema).length(3),
  emergingTopics: z.array(localizedSchema).length(3),
  signals: z
    .array(
      z.object({
        key: z.string(),
        labelAr: z.string(),
        labelEn: z.string(),
        volume: z.number().min(0).max(100),
        sentiment: z.number().min(-1).max(1),
      }),
    )
    .length(4),
  trends: z
    .array(
      z.object({
        week: z.string(),
        weekEn: z.string(),
        misinformation: z.number().min(0).max(100),
        fakeNews: z.number().min(0).max(100),
        sourceVerification: z.number().min(0).max(100),
        officialSources: z.number().min(0).max(100),
        trust: z.number().min(0).max(100),
      }),
    )
    .min(3)
    .max(6),
  segments: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        nameAr: z.string(),
        sharingTendency: levelSchema,
        verificationTendency: levelSchema,
        sourceSensitivity: levelSchema,
        officialTrust: levelSchema,
        messageFatigue: levelSchema,
        profileAr: z.string(),
        profileEn: z.string(),
        motivationAr: z.string(),
        motivationEn: z.string(),
        barriersAr: z.array(z.string()).min(1).max(4),
        barriersEn: z.array(z.string()).min(1).max(4),
        communicationPreferenceAr: z.string(),
        communicationPreferenceEn: z.string(),
        expectedResponseAr: z.string(),
        expectedResponseEn: z.string(),
        riskFactorsAr: z.array(z.string()).min(1).max(4),
        riskFactorsEn: z.array(z.string()).min(1).max(4),
        share: z.number().min(0).max(100),
      }),
    )
    .length(3),
  messages: z
    .array(
      z.object({
        id: z.string(),
        label: z.string(),
        text: z.string(),
        textEn: z.string(),
        clarity: z.number().min(0).max(100),
        audienceFit: z.number().min(0).max(100),
        trust: z.number().min(0).max(100),
        expectedInteraction: z.number().min(0).max(100),
        risk: z.number().min(0).max(100),
        verificationIntent: z.number().min(0).max(100),
      }),
    )
    .length(3),
  scenarios: z
    .array(
      z.object({
        id: z.string(),
        name: z.string(),
        nameAr: z.string(),
        channel: z.string(),
        contextAr: z.string(),
        contextEn: z.string(),
        expectedResponseAr: z.string(),
        expectedResponseEn: z.string(),
        amplification: z.number().min(0.3).max(1.5),
        formality: z.number().min(0).max(1),
        riskModifier: z.number().min(-20).max(20),
      }),
    )
    .length(3),
  recommendation: localizedSchema,
  confidence: z.number().min(0).max(100),
});

const requestSchema = z.object({
  sourceName: z.string().min(1).max(200),
  records: z.array(z.record(z.string(), z.unknown())).min(3).max(1000),
});

const CACHE_TTL_MS = 5 * 60 * 1000;
const analysisCache = new Map<string, { expiresAt: number; result: Record<string, unknown> }>();

const jsonSchema = {
  type: "object",
  additionalProperties: false,
  required: [
    "summary",
    "concerns",
    "emergingTopics",
    "signals",
    "trends",
    "segments",
    "messages",
    "scenarios",
    "recommendation",
    "confidence",
  ],
  properties: {
    summary: localizedJson(),
    concerns: { type: "array", minItems: 3, maxItems: 3, items: localizedJson() },
    emergingTopics: { type: "array", minItems: 3, maxItems: 3, items: localizedJson() },
    signals: {
      type: "array",
      minItems: 4,
      maxItems: 4,
      items: strictObject(["key", "labelAr", "labelEn", "volume", "sentiment"], {
        key: { type: "string" },
        labelAr: { type: "string" },
        labelEn: { type: "string" },
        volume: numberRange(0, 100),
        sentiment: numberRange(-1, 1),
      }),
    },
    trends: {
      type: "array",
      minItems: 3,
      maxItems: 6,
      items: strictObject(
        [
          "week",
          "weekEn",
          "misinformation",
          "fakeNews",
          "sourceVerification",
          "officialSources",
          "trust",
        ],
        {
          week: { type: "string" },
          weekEn: { type: "string" },
          misinformation: numberRange(0, 100),
          fakeNews: numberRange(0, 100),
          sourceVerification: numberRange(0, 100),
          officialSources: numberRange(0, 100),
          trust: numberRange(0, 100),
        },
      ),
    },
    segments: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: strictObject(
        [
          "id",
          "name",
          "nameAr",
          "sharingTendency",
          "verificationTendency",
          "sourceSensitivity",
          "officialTrust",
          "messageFatigue",
          "profileAr",
          "profileEn",
          "motivationAr",
          "motivationEn",
          "barriersAr",
          "barriersEn",
          "communicationPreferenceAr",
          "communicationPreferenceEn",
          "expectedResponseAr",
          "expectedResponseEn",
          "riskFactorsAr",
          "riskFactorsEn",
          "share",
        ],
        {
          id: { type: "string" },
          name: { type: "string" },
          nameAr: { type: "string" },
          sharingTendency: levelJson(),
          verificationTendency: levelJson(),
          sourceSensitivity: levelJson(),
          officialTrust: levelJson(),
          messageFatigue: levelJson(),
          profileAr: { type: "string" },
          profileEn: { type: "string" },
          motivationAr: { type: "string" },
          motivationEn: { type: "string" },
          barriersAr: stringArray(),
          barriersEn: stringArray(),
          communicationPreferenceAr: { type: "string" },
          communicationPreferenceEn: { type: "string" },
          expectedResponseAr: { type: "string" },
          expectedResponseEn: { type: "string" },
          riskFactorsAr: stringArray(),
          riskFactorsEn: stringArray(),
          share: numberRange(0, 100),
        },
      ),
    },
    messages: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: strictObject(
        [
          "id",
          "label",
          "text",
          "textEn",
          "clarity",
          "audienceFit",
          "trust",
          "expectedInteraction",
          "risk",
          "verificationIntent",
        ],
        {
          id: { type: "string" },
          label: { type: "string" },
          text: { type: "string" },
          textEn: { type: "string" },
          clarity: numberRange(0, 100),
          audienceFit: numberRange(0, 100),
          trust: numberRange(0, 100),
          expectedInteraction: numberRange(0, 100),
          risk: numberRange(0, 100),
          verificationIntent: numberRange(0, 100),
        },
      ),
    },
    scenarios: {
      type: "array",
      minItems: 3,
      maxItems: 3,
      items: strictObject(
        [
          "id",
          "name",
          "nameAr",
          "channel",
          "contextAr",
          "contextEn",
          "expectedResponseAr",
          "expectedResponseEn",
          "amplification",
          "formality",
          "riskModifier",
        ],
        {
          id: { type: "string" },
          name: { type: "string" },
          nameAr: { type: "string" },
          channel: { type: "string" },
          contextAr: { type: "string" },
          contextEn: { type: "string" },
          expectedResponseAr: { type: "string" },
          expectedResponseEn: { type: "string" },
          amplification: numberRange(0.3, 1.5),
          formality: numberRange(0, 1),
          riskModifier: numberRange(-20, 20),
        },
      ),
    },
    recommendation: localizedJson(),
    confidence: numberRange(0, 100),
  },
} as const;

function strictObject(required: string[], properties: Record<string, unknown>) {
  return { type: "object", additionalProperties: false, required, properties };
}

function localizedJson() {
  return strictObject(["ar", "en"], { ar: { type: "string" }, en: { type: "string" } });
}

function numberRange(minimum: number, maximum: number) {
  return { type: "number", minimum, maximum };
}

function levelJson() {
  return { type: "string", enum: ["LOW", "MEDIUM", "HIGH"] };
}

function stringArray() {
  return { type: "array", minItems: 1, maxItems: 4, items: { type: "string" } };
}

function representativeSample(records: Record<string, unknown>[], maximum = 120) {
  if (records.length <= maximum) return records;
  return Array.from({ length: maximum }, (_, index) => {
    const sourceIndex = Math.floor((index * (records.length - 1)) / (maximum - 1));
    return records[sourceIndex]!;
  });
}

function profileRecords(records: Record<string, unknown>[]) {
  const fields = [...new Set(records.flatMap((record) => Object.keys(record)))].slice(0, 100);
  return fields.map((field) => {
    const values = records
      .map((record) => record[field])
      .filter((value) => value != null && value !== "");
    const numeric = values.filter(
      (value): value is number => typeof value === "number" && Number.isFinite(value),
    );
    const examples = [
      ...new Set(values.filter((value) => typeof value === "string").map(String)),
    ].slice(0, 3);
    return {
      field,
      populated: values.length,
      types: [...new Set(values.map((value) => typeof value))],
      numeric:
        numeric.length > 0
          ? {
              minimum: Math.min(...numeric),
              maximum: Math.max(...numeric),
              average:
                Math.round(
                  (numeric.reduce((sum, value) => sum + value, 0) / numeric.length) * 100,
                ) / 100,
            }
          : null,
      examples,
    };
  });
}

export async function GET() {
  return NextResponse.json({
    configured: Boolean(process.env["OPENAI_API_KEY"]),
    model: "Qasimyah ML Model",
  });
}

export async function POST(request: Request) {
  if (!process.env["OPENAI_API_KEY"]) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY is not configured on the server." },
      { status: 503 },
    );
  }

  try {
    const bodyText = await request.text();
    if (bodyText.length > 2_000_000) {
      return NextResponse.json({ error: "Upload is larger than 2 MB." }, { status: 413 });
    }

    const input = requestSchema.parse(JSON.parse(bodyText));
    const cacheKey = createHash("sha256").update(bodyText).digest("hex");
    const cached = analysisCache.get(cacheKey);
    if (cached && cached.expiresAt > Date.now()) {
      return NextResponse.json(cached.result);
    }
    if (cached) analysisCache.delete(cacheKey);

    const encoder = new TextEncoder();
    const stream = new ReadableStream<Uint8Array>({
      async start(controller) {
        const send = (event: Record<string, unknown>) =>
          controller.enqueue(encoder.encode(`${JSON.stringify(event)}\n`));

        try {
          send({ type: "progress", progress: 10, stage: "validated" });
          const sampledRecords = representativeSample(input.records, 60);
          const dataProfile = profileRecords(input.records);
          send({ type: "progress", progress: 25, stage: "profiled" });

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
              max_output_tokens: 10000,
              instructions:
                "You are a bilingual Arabic-English government communication analyst. The input may use any structured schema, field names, language, record type, or combination of qualitative and quantitative values. First infer each field's meaning from names and values, then analyze only the supplied records. Treat free text as qualitative evidence and numeric fields as measurements only when their meaning supports that interpretation. Ignore identifiers and technically irrelevant columns. Do not invent observed facts or claim that a recommended message was measured. Convert raw counts to comparable 0-100 indices where needed, identify uncertainty, and lower confidence when data is sparse, ambiguous, duplicated, or missing relevant outcomes. Messages and scenarios are evidence-based recommendations, not measured outcomes. Return concise Modern Standard Arabic and English. Generate exactly 3 audience segments, 3 messages, and 3 scenarios. Make IDs lowercase URL-safe strings. Segment shares must approximately total 100.",
              input: `Source: ${input.sourceName}\nTotal record count: ${input.records.length}\nField profile calculated from all records:\n${JSON.stringify(dataProfile)}\nRepresentative records (${sampledRecords.length}):\n${JSON.stringify(sampledRecords)}`,
              text: {
                format: {
                  type: "json_schema",
                  name: "communication_intelligence_analysis",
                  strict: true,
                  schema: jsonSchema,
                },
              },
            }),
          });

          if (!response.ok) {
            const error = (await response.json()) as { error?: { message?: string } };
            throw new Error(error.error?.message ?? "OpenAI analysis failed.");
          }
          if (!response.body) throw new Error("OpenAI returned no response stream.");
          send({ type: "progress", progress: 38, stage: "model_connected" });

          const reader = response.body.getReader();
          const decoder = new TextDecoder();
          let buffer = "";
          let outputText = "";
          let lastProgress = 38;

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
                const nextProgress = Math.min(90, 38 + Math.floor(outputText.length / 120));
                if (nextProgress > lastProgress) {
                  lastProgress = nextProgress;
                  send({ type: "progress", progress: nextProgress, stage: "model_streaming" });
                }
              }
              if (event.type === "response.output_text.done" && event.text) {
                outputText = event.text;
              }
              if (event.type === "response.failed") {
                throw new Error(event.error?.message ?? "OpenAI streaming response failed.");
              }
            }
          }

          if (!outputText) throw new Error("OpenAI returned no structured output.");
          send({ type: "progress", progress: 94, stage: "validating_output" });
          const analysis = analysisSchema.parse(JSON.parse(outputText));
          const result = {
            ...analysis,
            sourceName: input.sourceName,
            recordCount: input.records.length,
            generatedAt: new Date().toISOString(),
          };
          analysisCache.set(cacheKey, { expiresAt: Date.now() + CACHE_TTL_MS, result });
          send({ type: "result", progress: 100, result });
        } catch (error) {
          send({
            type: "error",
            error: error instanceof Error ? error.message : "Unexpected analysis error.",
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
      return NextResponse.json(
        { error: "The uploaded data or AI output has an invalid shape." },
        { status: 400 },
      );
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unexpected analysis error." },
      { status: 500 },
    );
  }
}
