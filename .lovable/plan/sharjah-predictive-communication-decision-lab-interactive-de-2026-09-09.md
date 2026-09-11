# Sharjah Predictive Communication Decision Lab — Interactive Demo

An end-to-end clickable prototype (not a static mockup) for the Sharjah Government Communication Digital Twin, in Arabic-first RTL with English technical labels, built on the project's existing React + TypeScript + Tailwind stack with Recharts and Lucide icons.

Every number shown is synthetic. Badges and labels ("SYNTHETIC DATA", "Demo Analytical Estimate", "Prototype Simulation") appear on every metric, chart, and result, plus a persistent footer disclaimer. No claims about real Sharjah residents or real social media data.

## Visual identity

The uploaded Al Qasimia University seal is used as provided, unaltered, in the landing header, login card, and sidebar. Its warm gold/amber on ivory becomes the theme: gold primary, deep neutral text, ivory surfaces, thin ornamental rules echoing the seal's border. IBM Plex Sans Arabic throughout. Institutional and scientific — no gradients, neon, or decorative 3D.

## Screens and flow

1. **Landing** — hero "اختبر الرسالة قبل أن تطلقها.", positioning line, the 7-step flow strip (Audience Data → Behavioural Model → Message Simulation → Prediction → Human Decision → Real Campaign → Learning), Why Digital Twin / AI Role / Human Role sections, "Prototype Demonstration — Synthetic Data" note, CTAs Explore the Digital Twin + View Demo.
2. **Login** — demo only, no real auth. Prefilled demo@sgc-dt.ai / demo123 plus an "Enter Demo" button, "Demo Environment" label.
3. **Dashboard shell** — collapsible sidebar (Overview, Campaign Setup, Audience Intelligence, Digital Twin, Message Lab, Scenario Simulator, AI Optimization, Prediction, Human Decision, Learning, Knowledge Base, Data Governance, Settings), top bar with project "Ask Before You Share", "Simulation Mode", SYNTHETIC DATA badge.
4. **Overview** — six KPI cards (3 / 4 / 12 / 9 / 6 / Prototype) and four charts: audience topic trends, message performance, scenario comparison, predicted verification intent.
5. **Campaign Setup** — the specified form, channels multi-select, 30-day duration, "Use Synthetic Data" on by default, then a ~1.5s staged processing sequence and auto-navigation to Audience Intelligence.
6. **Audience Intelligence** — audience signals, topic trend area chart, audience concerns, "Prototype Data Sources" list with the pilot-replacement note.
7. **Behavioural Segmentation** — four clickable synthetic segments (Fast Sharer, Verifier, Socially Influenced, Information Seeker) with detail panel: profile, motivation, barriers, communication preference, expected response, risk factors.
8. **Audience Digital Twin** — aggregated-model explanation, non-human system visualization of the attribute pipeline, selected-segment attribute bars, "Simulate Message" action.
9. **Message Lab** — four Arabic variants A–D with six scored dimensions, selection, AI recommendation for Message C with rationale bullets.
10. **Scenario Simulator** — three scenarios, animated simulate step, comparison table + charts, recommended scenario with reasoning.
11. **AI Optimization** — original vs optimized message, rationale, Re-Simulate, 76 → 87 with "Simulation Result — Not Real-World Performance".
12. **Prediction** — four KPI cards, prediction chart, confidence "Prototype Simulation", full disclaimer, "What would improve the prediction?".
13. **Human Decision** — AI recommendation, Approve / Modify / Reject, rationale textarea, recorded audit trail entry, "AI assists — Human decides."
14. **Learning** — predicted 84% vs actual 79%, 5-point error, calibration loop diagram, chart of previous prediction / actual / calibrated.
15. **Knowledge Base** — accumulated run record with lessons learned, "Demonstration Knowledge".
16. **Data Governance** — data classification (SYNTHETIC for this prototype), privacy principles, responsible-AI principles.
17. **Settings** — language, demo-data toggle, reset demo state.

State carries forward: campaign → segment → message → scenario → simulation → prediction → decision → learning, held in one demo store so each screen consumes the previous screen's choices.

## Technical notes

- Routes under `src/routes/`: landing at `/`, `/login`, and a dashboard layout route with the twelve child screens; each content route gets its own head metadata.
- `src/data/` typed mock modules: campaigns, audienceSegments, audienceSignals, messages, scenarios, simulationResults, predictions, decisions, socialListening.
- `src/lib/simulation/`: deterministic `simulateMessage(segment, message, scenario)`, `compareScenarios`, `generateRecommendation`, `optimizeMessage`, `generatePrediction` — pure functions, same input always gives same output, no randomness.
- `src/lib/ai/communicationIntelligence.ts`: single service abstraction (analyzeAudience, analyzeMessage, generateScenarios, compareScenarios, generateRecommendation, optimizeMessage, generatePrediction, generateLearning) backed by the deterministic engine, shaped so a real model can replace it later. No API keys in the browser; no external AI dependency, so the demo never breaks.
- Demo workflow state in a React context provider with sessionStorage persistence; browser storage read only after hydration to keep server and client render consistent.
- Logo added as a CDN asset pointer and imported; the file itself is not modified.
- Theme tokens (gold primary, ivory surface, ink text, ornament rule) defined in `src/styles.css`; IBM Plex Sans Arabic loaded via a font link in the root route, `dir="rtl"` on the document.
- Design tokens only — no hardcoded color utilities. Sidebar collapses on tablet/mobile, charts stay readable, no horizontal overflow.

## Out of scope

No real authentication, no live social media scraping, no database or backend, no trained ML model, no external LLM call.
