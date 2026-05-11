# Category: Status Report

Use this reference when the artifact is a status update, weekly report, sprint
summary, or any time-bounded progress document with items at varying states
of completion.

## Structure

A status report has four zones:

1. **Header** — report title, period covered (dates), author/team, one-line
   executive summary ("3 of 5 milestones on track, auth rewrite blocked").
2. **Key metrics** — 3–5 numbers displayed prominently. Pick metrics that
   answer "is this period better or worse than expected?" Format:
   - Metric label (small caps)
   - Current value (large)
   - Delta or trend indicator (up/down arrow + percentage, or "on track" /
     "at risk" / "blocked")
3. **Items** — the core content. Each item (milestone, task, initiative) has:
   - Status indicator (color dot or short label: done / on track / at risk /
     blocked / not started)
   - Item title
   - One-sentence current state
   - Optional detail paragraph (collapsed by default)
   - Agent action buttons (see below)
   - Response slot
4. **Outlook** — forward-looking paragraph: what's expected next period,
   what could go wrong, what needs a decision.

## Agent actions per item

Each item gets 1–2 buttons:

| Button label | `data-agent-action` prompt pattern |
|---|---|
| **Drill down** | `Give a detailed breakdown of: [item title]. Current state: [summary]. Include sub-tasks, blockers, and who owns what.` |
| **Suggest action** | `[item title] is [status]. Suggest 2-3 concrete next steps to move it forward or unblock it. Be specific about who should do what.` |
| **Challenge status** | `The team reports [item title] as [status]. What evidence would confirm or contradict this? What questions should a manager ask?` |

Always include **Drill down**. Add **Suggest action** for at-risk and
blocked items. Add **Challenge status** for items marked "on track" that
the reader might want to verify.

## Context strategy

State block keyed by item:

```json
{
  "period": { "start": "2025-01-06", "end": "2025-01-10" },
  "metrics": {
    "velocity": { "value": 34, "delta": "+12%" },
    "blockers": { "value": 2, "delta": "-1" }
  },
  "items": {
    "auth-rewrite": { "status": "blocked", "summary": "...", "owner": "..." },
    "api-v3": { "status": "on-track", "summary": "..." }
  }
}
```

## Visual patterns

- Status indicators: small filled circles (8–10px) with fixed colors:
  - Done: green `#27ae60`
  - On track: blue `#2980b9`
  - At risk: amber `#d4a017`
  - Blocked: red `#c0392b`
  - Not started: gray `#95a5a6`
- Key metrics: displayed in a horizontal row (flex, 3–5 columns). Each
  metric in its own column: label above, value large below, delta small
  and color-coded (green positive, red negative).
- Items: stack vertically, separated by hairlines. No cards. Status dot
  sits left of the title, inline.
- Outlook section: visually distinct — uses the preset's secondary
  background tint or a subtle left border to separate it from items.

## Layout

Single-column below the metrics row. Metrics row is the visual anchor —
it should be the first thing a scanner sees after the title.

Group items by status (blocked first, then at-risk, then on-track, then
done) or by workstream — but not both. Pick one grouping and commit.

## Anti-patterns specific to status reports

- ❌ Traffic-light tables (green/yellow/red grid) — these look like
  corporate templates from 2008. Use inline status dots instead.
- ❌ Percentage bars for every item — percentages are false precision
  for most knowledge work. Use discrete states (done / on track / etc.)
  unless the item genuinely has measurable sub-tasks.
- ❌ Burying the blockers — blocked items should be visually first or
  at minimum have a dedicated callout at the top.
- ❌ Wall of text without scannable structure — every item must have
  a one-sentence summary visible without expanding.
