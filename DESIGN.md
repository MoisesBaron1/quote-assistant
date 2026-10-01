---
name: Quote Assistant
description: Precise daylight quotation operations workspace
colors:
  accent: "#3044d7"
  accent-soft: "#eef1ff"
  accent-hover: "#2536b8"
  paper: "#f7f8fa"
  surface: "#ffffff"
  navigation: "#171b2b"
  ink: "#202534"
  muted: "#626a7a"
  border: "#e8ebf0"
  success: "#237850"
  warning: "#956015"
  danger: "#b83b3b"
  avatar-ink: "#465166"
typography:
  headline:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "30px"
    fontWeight: 600
    lineHeight: 1.25
    letterSpacing: "-0.025em"
  title:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "18px"
    fontWeight: 600
  body:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "14px"
    fontWeight: 400
  metric:
    fontFamily: "DM Sans, sans-serif"
    fontSize: "33px"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.025em"
rounded:
  control: "7px"
  panel: "11px"
  dialog: "13px"
spacing:
  small: "8px"
  medium: "16px"
  section: "24px"
  page: "36px"
components:
  button-primary:
    backgroundColor: "{colors.accent}"
    textColor: "{colors.surface}"
    rounded: "{rounded.control}"
    padding: "10px 13px"
    height: "39px"
  button-primary-hover:
    backgroundColor: "{colors.accent-hover}"
  panel:
    backgroundColor: "{colors.surface}"
    rounded: "{rounded.panel}"
---

# Design System: Quote Assistant

## Overview

**Creative North Star: "Precise daylight operations workspace"**

Mode: Operate. The implemented interface is the final visual authority for this new surface. Preserve its warm paper, charcoal navigation, cobalt actions and restrained operational density when extending the authorized MVP. PRODUCT.md owns the product scope and demonstration boundaries.

The dashboard prioritizes commitments, ownership and hours. The six indicators form a ruled strip; capacity lanes and the quotation ledger follow in a clear reading order. Spanish copy and self-hosted DM Sans keep the experience consistent across operational screens.

**Key Characteristics:**

- Flat paper surfaces with fine dividers.
- Cobalt actions and restrained semantic status colors.
- Tabular numbers, readable ownership and visible commitments.
- Responsive navigation and deliberately scrollable data regions.

## Colors

The frontmatter records the reusable CSS palette. Cobalt identifies primary actions, selected filters and links. Pale cobalt supports selection; success, warning and danger identify delivery states and risks together with written labels.

Paper frames white content surfaces. Charcoal anchors navigation. Ink carries primary information; muted ink carries operational supporting labels, table headings, drawer metadata, history dates and report footnotes. These small labels use the shared muted token after contrast review rather than the earlier lighter grays.

**The Legible Metadata Rule.** Preserve contrast on the actual background, including small supporting text. Person colors tint avatar backgrounds only; initials use the fixed avatar-ink token, including when imported person colors are very light.

## Typography

DM Sans is self-hosted through @fontsource, with sans-serif fallback. Page headings use the headline role; section headings use the title role. Quotation identifiers and project names use 12px on desktop and 11px on mobile. Other operational labels span 9–12px; metric values use the metric role. Numbers in indicators and tables are tabular. Headings use slightly tightened tracking; ordinary labels retain normal tracking.

## Layout

Desktop uses fixed navigation (224px), a flexible main shell, a 74px top bar and a content container capped at 1600px. Main padding is 30px vertically and 36px horizontally. Navigation narrows to 200px at 1250px; headings/actions stack and capacity becomes two columns at 1050px. Wide desktop padding increases at 1800px.

At the mobile navigation boundary (900px), the shell becomes full width with an explicit menu opener, a 232px off-canvas navigation panel and a backdrop. Closed navigation is inert; Escape closes the open menu and restores focus to the opener. The compact top bar retains search and notifications. At 900px, capacity returns to four columns in the full-width shell. At 720px, content uses 17px side gutters, stacked heading/actions, two capacity columns and a single settings column.

Keep six indicators in a horizontally scrollable region rather than squeezing their labels. The quotation table also scrolls horizontally (980px desktop minimum, 930px mobile minimum); mobile repeats the commitment below the project so the first visible columns remain useful. Calendar and report tables keep their own scrolling regions. The detail drawer caps at 575px and fills narrow screens. At short desktop heights, the sidebar tip recedes to preserve navigation space.

## Elevation & Depth

Panels are flat: white fill and fine borders convey structure. Elevation is reserved for temporary layers: dialogs use `0 12px 60px #151b3a33`, toasts use `0 6px 25px #141e3a24`, and modal/menu backdrops use translucent charcoal. Selection and hover use tonal changes, without decorative gradients.

State transitions last 160ms; the off-canvas navigation transition lasts 180ms. Reduced-motion preference removes transitions and animations. Print styling removes application chrome and controls and formats the executive report for A4.

## Shapes

Controls have gently curved corners using the control radius. Panels use the panel radius; modal dialogs use the dialog radius. The detail drawer is square to the viewport edge. Person avatars are circles. Small badges use 4px corners, chips 6px. Thin borders separate lanes, rows and groups without heavy boxing.

## Components

Buttons use compact sentence-case labels and inline icons. Primary actions are cobalt with white text; secondary actions use white fill and a neutral stroke. Destructive actions use red. Disabled controls visibly recede. Keyboard focus uses a 3px pale cobalt outline with 3px offset; search exposes a focus-within outline.

Inputs, selects and textareas use white fill, a fine stroke, the control radius and a 38px minimum height. Errors use red borders with written field feedback. Native dialogs provide overlay and focus behavior; drawer tabs indicate their active state with cobalt text and an underline.

Navigation uses icons and Spanish labels; the active item has a blue-charcoal fill, brighter text and `aria-current`. A skip link reaches the main content. The mobile opener exposes its expanded state and controlled navigation ID.

Capacity lanes show identity, remaining hours, weekly reference capacity, percentage and a textual capacity state. Previewing redistribution shows the proposed moves before applying them, then updates capacity and history. Delivery badges retain written states alongside dots; overdue and postponed may coexist. Calendar entry clears prior quotation filters so the date view has a predictable scope.

The persistent demo banner identifies synthetic data. Storage failures display a backup action and save status is explicit. Conflict messages keep stale edits or destructive confirmations from silently overwriting newer browser data. Roles are visibly marked as demonstrations; risk notes explain a heuristic estimate. Client messages are copyable drafts. Preserve these visible boundaries: persistence is local to the browser, tab synchronization is not a multiuser backend, and no external messages are sent.

Review evidence: desktop and mobile captures are in `.impeccable/review/desktop-final.png` and `mobile-final.png`. The saved `a11y-fixed.json` overview scan reports zero automated violations. Targeted WCAG checks passed overview, drawer/history, settings and report, including light imported avatar backgrounds. The latest full build, 18 domain tests and 13 browser tests passed. The subsequent tablet navigation boundary correction passed a fresh build and dedicated keyboard regression at 390px and 820px. Public deployment smoke verification passed editing/persistence, redistribution preview, CSV, report, tablet navigation and mobile calendar with no runtime errors. Screenshots and automated checks complement, rather than replace, keyboard review.

## Do's and Don'ts

- **Do** preserve the paper, charcoal and cobalt hierarchy.
- **Do** use muted ink for supporting operational text and fixed dark initials on tinted avatars.
- **Do** keep numeric data tabular and label operational states in words.
- **Do** maintain inert closed mobile navigation, visible focus and reduced-motion support.
- **Do** retain the synthetic-data, local persistence and heuristic-risk boundaries in visible copy.
- **Don't** imply real authentication, shared server persistence, statistical prediction or sent client messages.
- **Don't** compress wide tables into unreadable mobile columns.
- **Don't** add ornamental shadows or decorative imagery to operational panels.

## Presentation refinements — 2026-09-30

Preserve the daylight visual authority. The upper-bar presentation icon opens a compact pale-cobalt six-step guide above the existing content; it uses the same controls, type and panel rhythm. Metric lanes are actionable buttons with descriptive labels. Views have loading/recovery states; forms announce validation, focus the first error, protect dirty drafts and show pending saves. Mobile form controls use 16px type to avoid focus zoom and a single-column layout. The existing drawer keeps a narrow backdrop edge on small screens and scrolls within the viewport.

Offline status appears only when applicable; readiness is shown in the footer after the production static cache becomes available. Fonts remain DM Sans, WOFF2 only. Secondary alerts/activity labels use muted ink. Native dialogs handle cancel with the current state so protected edits survive Escape.

Verification: 18 domain tests and 26 browser scenarios pass, including offline reload/edit/all secondary modules, JSON roundtrip/cancel, clipboard, print/PDF, network-failure recovery and WCAG checks across all modules and the guide. One batched desktop/mobile visual review completed; mobile native-dialog full-page capture was replaced with a valid viewport capture. The pinned identity is preserved.
