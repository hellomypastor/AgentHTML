# Category: Implementation Plan

Use this reference when the artifact is a technical implementation plan —
a phased breakdown of work with milestones, dependencies, risks, and
adjustable timelines.

## Structure

An implementation plan has five zones:

1. **Header** — plan title, goal statement (one sentence: what ships and why),
   owner/team, target date, current confidence level (high / medium / low).
2. **Timeline overview** — a horizontal or vertical visual showing phases
   and their relative durations. Not a Gantt chart — just labeled blocks
   on a track with phase names and week ranges. CSS-drawn, not ASCII.
3. **Phases** — the core content. Each phase has:
   - Phase number and label (e.g. "Phase 1 — Foundation")
   - Duration estimate (e.g. "~2 weeks")
   - One-paragraph scope description
   - Deliverables list (what's done when this phase ships)
   - Dependencies (what must be true before this phase starts)
   - Risks (1–2 sentences per risk, with mitigation)
   - Agent action buttons (see below)
   - Response slot
4. **Decision points** — explicit moments where the team must choose
   between paths. Each decision has: the question, the options, the
   deadline, and what happens if no decision is made.
5. **Open questions** — unresolved items that could change the plan.
   Each question has a "Research this" agent action.

## Agent actions per phase

Each phase gets 2–3 buttons:

| Button label | `data-agent-action` prompt pattern |
|---|---|
| **Break down tasks** | `Break phase [N]: [label] into concrete engineering tasks. Scope: [description]. Estimate each task in days. Flag any that need spike/research first.` |
| **Identify risks** | `What could go wrong in phase [N]: [label]? List risks beyond what's already noted. For each, rate likelihood (low/medium/high) and suggest a mitigation.` |
| **Suggest alternatives** | `Propose an alternative approach to phase [N]: [label] that trades [current tradeoff] for [opposite tradeoff]. Compare effort, risk, and outcome.` |
| **Compress timeline** | `Phase [N] is estimated at [duration]. What would it take to cut that in half? What gets sacrificed? Is it worth it?` |

Always include **Break down tasks**. Add **Identify risks** for phases
longer than 1 week. Add **Compress timeline** when the plan is tight.

### Plan-level actions

Place these near the timeline overview or at the bottom:

| Button label | `data-agent-action` prompt pattern |
|---|---|
| **Critical path** | `Analyze the dependency chain across all phases. What is the critical path? Which phase, if delayed, delays everything?` |
| **Parallel opportunities** | `Which phases or tasks within phases can run in parallel? Suggest a restructured timeline that maximizes parallelism.` |
| **Cut scope** | `The plan needs to ship [X weeks] earlier. What can be cut or deferred without breaking the core goal? Be specific about what's lost.` |

## Context strategy

State block with phases and metadata:

```json
{
  "goal": "Ship rate limiting for the public API",
  "target_date": "2025-03-28",
  "confidence": "medium",
  "phases": {
    "p1": {
      "label": "Foundation",
      "duration": "2 weeks",
      "scope": "...",
      "deliverables": ["...", "..."],
      "dependencies": [],
      "risks": [{ "risk": "...", "mitigation": "..." }]
    },
    "p2": { ... }
  },
  "decisions": [
    { "question": "Redis vs in-memory?", "deadline": "2025-02-14", "options": ["...", "..."] }
  ]
}
```

## Visual patterns

- Timeline overview: horizontal track built with CSS flexbox. Each phase
  is a block whose width is proportional to its duration. Phase labels
  inside or above. Use the preset's accent for the current/next phase,
  muted color for future phases, success color for completed phases.
- Phase blocks: stack vertically below the timeline. Each phase has a
  phase number in the preset's accent color, large and prominent.
- Dependency arrows: if phases have dependencies, show them as thin
  lines connecting the timeline blocks. CSS-drawn (borders + transforms),
  not SVG, not ASCII.
- Risk items: left border in amber/red depending on severity, inline
  with the phase content.
- Decision points: visually distinct — use the preset's accent background
  at 10% opacity with a solid left border. The question is bold, options
  are listed below.

## Layout

Single-column with the timeline overview spanning full width at the top.
Phases stack below. Decision points can appear inline between phases
(at the point where the decision must be made) or grouped in their own
section at the bottom.

Avoid multi-column layouts for phases — plans are read top-to-bottom
in sequence. Side-by-side phases imply parallelism that may not exist.

## Anti-patterns specific to implementation plans

- ❌ Gantt charts rendered as HTML tables — they're unreadable on mobile
  and impossible to make interactive. Use the simplified timeline track.
- ❌ Percentage-complete bars per phase — plans aren't linear. Use
  discrete states (not started / in progress / done / blocked).
- ❌ Listing every task upfront — the plan should show phases and
  deliverables. Individual tasks are what the "Break down tasks" agent
  action generates on demand.
- ❌ Hiding dependencies in prose — make dependencies explicit and
  structured so the "Critical path" agent action can reason about them.
- ❌ Omitting decision points — every plan has moments where the path
  forks. Making them explicit is the difference between a plan and a
  wishlist.
