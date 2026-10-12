# Quote Assistant
<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Delegated through the user's request to add improvements, build and deploy. React, TypeScript and Vite; Vercel hosting. No backend account or real quotation source has been provided.

## Users
Estimators update quotations, Account Managers follow requests, Senior Estimator manages delivery and workload. Immediate audience: the user's boss reviewing the MVP.

Current team: Senior Kevin Amaya; Estimators Danilo Heredia, Moisés Barón and Daniela Torres; Account Managers Nayib Farah, Carlos Obregón, Anthony Coronell, Andrés Gianneo, Andrés Franco, Carlos Sierra and Eduardo Jiménez.

## Product Purpose
Make ownership, deadlines and workload visible in one workspace. Preserve the epic's ten fields, seven filters and six indicators.

## Capabilities and Constraints
Authorized expansion: CRUD, automatic internal alerts, explainable deadline-risk estimates, priorities, hour-based capacity, suggested/applied reassignment, calendar, history, JSON import/backup, CSV export, printable executive summary and copyable client-message drafts. No messages are sent externally.
Separate Trabajo (initially empty) and Ejemplos (clearly labeled synthetic quotations). Changes persist in localStorage and synchronize between tabs of the same space/browser, not across devices. Profiles are selectable local workflows without verified identity or authentication. These boundaries must remain visible and documented.

## Operating Context
Spanish daily operations on desktop and responsive mobile. Configurable business timezone, initially UTC; calendar-day remaining counters and alerts. New assignment lead times use Monday–Friday business days, excluding the assignment day and without a holiday calendar. Completed/delivered quotations do not become overdue. Original commitments survive date changes. Postponed overdue work is counted in both categories. Risk is heuristic, not statistical prediction.

## Evidence on Hand
The uploaded epic's extracted requirements and original plans are preserved in `docs/superpowers/`, with historical labels. Current contracts and boundaries are documented here and in `CLAUDE.md`. No supplied brand assets, customer data or measured performance claims.

## Product Principles
Computed delivery state; traceable commitments; actionable alerts; honestly labeled demonstration; working controls.

## Presentation refinement
Existing MVP refined for the user's next-day boss presentation: nonmutating six-step guide, actionable metrics, persistent hash navigation/back, protected unsaved drafts, pending/validation states, original damaged-file recovery and confirmed replacement, truthful alert save results, offline readiness/status and full cached views after an initial online load. Static Vercel Hobby hosting remains; no paid integrations, backend, real identity or sent communications introduced.

## Quotation types and business deadlines — 2026-10-03

Seven types: Cotización de adicional, Retail menor/mayor, Proyecto menor/mayor, Recotización proyecto/retail. Every type can include takeoff (+1 business day). Senior demo role manages nullable 1–365-day lead times; unconfigured types require a manual weekday base date. Saved quotes retain their own method/base date/days snapshot, original commitment and change history. Recalculation uses the current rule only on explicit action. Reassignment preserves dates and requires classification; automatic redistribution excludes unclassified legacy records. Existing backups retain their dates, including weekends. Cards/Table share filters, sorting and pagination; preference persists separately from workspace data. JSON/CSV and offline storage retain all metadata.

## Provided work times and QA — 2026-10-05

The supplied HH:MM:SS table is confirmed as estimated effort, independent of delivery dates. Defaults: additional 21 minutes; major project 4h with takeoff/6h without; minor 3h30/4h30; project requote 2h; retail requote 1h; major retail 3h; minor retail 2h. Senior may edit nine HH:MM standards. New assignments receive these estimates; manual overrides and all saved hours/dates remain until explicit action. Applying a standard to an existing quote preserves pending time. History tracks effort changes. Configuration drafts persist during navigation and retain tab-conflict protection. Blank required numbers are invalid, sub-hour progress uses the true estimate, and nominal risk capacity excludes weekends. Stored roles remain demonstrations.

## Real team workflows — 2026-10-06

Kevin creates, assigns, reassigns and deletes quotations and manages shared workspace settings. Estimators update only status, effort and comments on their own assignments. Each Account Manager consults their own quotations and prepares messages. The active profile supplies actual history attribution, own export scope and personal alert acknowledgements. Profiles persist per tab; selecting one does not authenticate identity. New visitors start with empty Trabajo; existing records remain in their prior space until explicit backup/import. Untouched legacy examples adopt the real roster; edited legacy assignments preserve owners, audit history, dates and hours and appear for Kevin to review. Three active Estimators drive current capacity and redistribution; referenced previous people are retained for data compatibility. Initial nominal capacity is 40h each and Kevin can configure it. No paid service or cross-device backend has been introduced; device requirements were requested and remain unconfirmed.
