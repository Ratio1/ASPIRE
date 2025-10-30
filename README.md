# ASPIRE – Ratio1 Case Inference Studio

Prototype Next.js workspace that turns the Romanian autism cohort research into an interactive UI for
Ratio1ʼs decentralized inference pipeline.

## What you will find

- **Landing and dAuth onboarding** – marketing splash plus mocked authentication to simulate Ratio1 dAuth.
- **Operator workspace** – cohort metrics, active inference jobs, and quick access to cases.
- **Case submission wizard** – multi-section form mirroring the prenatal, developmental, neurological, and behavioural fields described in the research PDF.
- **Inference review** – probability distribution, narrative explanations, and recommended actions.
- **Predictive lab** – dedicated workspace for running cohort-informed probability scenarios on uploaded or ad-hoc profiles.
- **Research insights hub** – product decisions traced back to the “Analysis of Autism Case Database and Research Context” document.
- **Edge node telemetry** – navigation badge and modal reuse the Ratio1 Drive status methodology for CStore/R1FS health.

## Getting started

```bash
npm install
npm run dev
```

Then open http://localhost:3000 to explore the prototype. By default the app boots in mock mode; configure the environment variables below to bind to live Ratio1 services.

### Configuration

- `NEXT_PUBLIC_RATIO1_DEMO_USERNAME` / `NEXT_PUBLIC_RATIO1_DEMO_PASSWORD` – override the default `demo/demo` login for the mock experience.
- `RATIO1_USE_MOCKS` (or `NEXT_PUBLIC_RATIO1_USE_MOCKS`) – set to `false` when deploying alongside a Ratio1 Edge Node to force live endpoints.
- `EE_CHAINSTORE_API_URL` / `EE_R1FS_API_URL` – CStore and R1FS endpoints exposed by the edge node container. Presence of both automatically disables mock mode.
- `EE_CHAINSTORE_PEERS` – optional JSON array of peer URLs passed to the Ratio1 SDK.
- `RATIO1_CASES_HKEY` / `RATIO1_JOBS_HKEY` – hash keys used when persisting case records and inference jobs into CStore (defaults align with the ASD prototype namespace).

Run `npm run seed:cohort` to regenerate the JSON seeds (`data/cohort-seed.json`, `data/cohort-cstore.json`) from the Excel workbook when the source dataset is updated.

When the endpoints are configured the server routes reuse the Ratio1 Drive methodology—constructing a singleton `@ratio1/edge-node-client`, hydrating the node via the env-driven URLs, and persisting submissions into CStore while surfacing R1FS/CStore health snapshots.

## Tech stack

- Next.js App Router (TypeScript, React 18)
- Local state + context for mock authentication and toast notifications
- Ratio1 Edge Node SDK integration with automatic fallback to mock data

## Folder structure

- `app/` – Next.js routes (landing, login, workspace, cases, research)
- `components/` – shared UI widgets (forms, charts, stats, feedback)
- `lib/` – domain types, sample data, and formatting helpers
- `public/` – static assets (placeholder for future images, icons)

## Research alignment

The UI content, field choices, and metrics are grounded directly in the two source documents:

1. **Analysis of Autism Case Database and Research Context** – informs cohort insights, prevalence statistics, and roadmap recommendations.
2. **Ratio1 Case Inference Application – Technical Specification** – drives the Ratio1-specific flows (dAuth login, Edge Node job pipeline, CStore audit trail).

Use this app as the frontend companion to future Ratio1 service integrations or as a design reference when extending the ASD inference program.

## Cohort dataset

- `data/cohort-seed.json` – compact metrics extracted from `baza de date pacienți 1.xlsx`, used to drive on-screen analytics.
- `data/cohort-cstore.json` – normalized `CaseRecord` objects ready for import into CStore or for mock-mode hydration.
- `npm run seed:cohort` rebuilds both files from the Excel source; the ingestion logic lives in `scripts/build-cohort.js`.

## Mock mode vs. Ratio1 Edge Node deployment

- **Mock mode (default when endpoints are absent):** Case submissions are held in-memory via `lib/mock-store.ts`, inference jobs are synthesised, and status cards display illustrative data. The UI enforces the `demo/demo` operator credentials.
- **Edge Node mode:** Server routes (`app/api/cases`) and data loaders swap to live CStore/R1FS operations. Submissions are stored via `cstore.hset` and jobs recorded under the configured hash keys, mirroring the patterns in [`ratio1-drive`](https://github.com/Ratio1/ratio1-drive). Workspace health cards display the direct `getStatus` responses from the Ratio1 services.

## Predictive lab

- Route: `/predict`
- Sources cases from CStore or the mock cache and lets operators run cohort-informed probability scenarios without altering the primary record.
- Inputs mirror the high-signal risk factors called out in the cohort PDF (language stage, EEG/MRI findings, prenatal factors, delays, behavioural load).
- Outputs include softmax-normalised probabilities for three archetypes (“Profound sensory”, “High-functioning”, “Syndromic”) plus tailored recommendations.
- Case detail pages expose a shortcut (`Open predictive lab →`) that pre-populates the form for that record, while manual mode supports what-if exploration before dispatching an actual Ratio1 inference job.

This dual-path approach allows designers to iterate on the UI locally while guaranteeing the containerised build will bind to the correct endpoints when running inside a Ratio1 Edge Node.
