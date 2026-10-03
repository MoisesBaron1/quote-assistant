# Quote Assistant
<!-- impeccable:product-schema 1 -->

## Platform
web

## Stack
Delegated through the user's request to add improvements, build and deploy. React, TypeScript and Vite; Vercel hosting. No backend account or real quotation source has been provided.

## Users
Estimators update quotations, Account Managers follow requests, Senior Estimator manages delivery and workload. Immediate audience: the user's boss reviewing the MVP.

## Product Purpose
Make ownership, deadlines and workload visible in one workspace. Preserve the epic's ten fields, seven filters and six indicators.

## Capabilities and Constraints
Authorized expansion: CRUD, automatic internal alerts, explainable deadline-risk estimates, priorities, hour-based capacity, suggested/applied reassignment, calendar, history, JSON import/backup, CSV export, printable executive summary and copyable client-message drafts. No messages are sent externally.
Clearly labeled synthetic data. Changes persist in localStorage and synchronize between tabs of that browser, not across users/devices. Role views are demonstrations, not authentication. These boundaries must remain visible and documented.

## Operating Context
Spanish daily operations on desktop and responsive mobile. Configurable business timezone, initially UTC; calendar-day remaining counters and alerts. New assignment lead times use Monday–Friday business days, excluding the assignment day and without a holiday calendar. Completed/delivered quotations do not become overdue. Original commitments survive date changes. Postponed overdue work is counted in both categories. Risk is heuristic, not statistical prediction.

## Evidence on Hand
Uploaded epic and extracted requirements in /workspace/docs/superpowers. No supplied brand assets, customer data or measured performance claims.

## Product Principles
Computed delivery state; traceable commitments; actionable alerts; honestly labeled demonstration; working controls.

## Presentation refinement
Existing MVP refined for the user's next-day boss presentation: nonmutating six-step guide, actionable metrics, persistent hash navigation/back, protected unsaved drafts, pending/validation states, original damaged-file recovery and confirmed replacement, truthful alert save results, offline readiness/status and full cached views after an initial online load. Static Vercel Hobby hosting remains; no paid integrations, backend, real identity or sent communications introduced.

## Quotation types and business deadlines — 2026-10-03

Five types: Cotización de adicional, Retail menor/mayor, Proyecto menor/mayor. Every type can include takeoff (+1 business day). Senior demo role manages nullable 1–365-day lead times; unconfigured types require a manual weekday base date. Saved quotes retain their own method/base date/days snapshot, original commitment and change history. Recalculation uses the current rule only on explicit action. Reassignment preserves dates and requires classification; automatic redistribution excludes unclassified legacy records. Existing backups retain their dates, including weekends. Cards/Table share filters, sorting and pagination; preference persists separately from workspace data. JSON/CSV and offline storage retain all metadata.
