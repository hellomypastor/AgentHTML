# Category: Comparison

Use this reference when the artifact compares two or more options side-by-side —
technology choices, design approaches, vendor evaluations, A/B test results,
architecture alternatives, migration paths.

## Structure

A comparison artifact has four zones:

1. **Header** — comparison title, the question being answered ("Which cache
   layer should we adopt?"), number of options, evaluation criteria listed
   upfront.
2. **Options overview** — one column per option (2–4 options max in a side-by-
   side layout; more than 4 should use a stacked layout with a summary table).
   Each option gets:
   - Option label (prominent, one word or short phrase)
   - One-sentence summary
   - Key differentiator (what makes this option different from the others,
     highlighted)
3. **Criteria breakdown** — the core content. Each evaluation criterion is a
   row spanning all options:
   - Criterion label (left, fixed width)
   - Per-option assessment (one cell per option, brief — 1–2 sentences max)
   - Winner indicator (subtle, per-criterion — which option is strongest
     on this axis)
4. **Synthesis** — the recommendation. Not a repeat of the table — this is
   the "so what": which option to pick given which priorities, with a clear
   first-choice recommendation and the conditions under which a different
   option would be better.

## Agent actions

Comparisons benefit from two kinds of agent actions:

### Per-criterion actions

| Button label | `data-agent-action` prompt pattern |
|---|---|
| **Go deeper** | `Expand on [criterion] for [option]. Include concrete numbers, benchmarks, or evidence. Current assessment: [cell text].` |
| **Challenge** | `The comparison rates [option] as [assessment] on [criterion]. Argue the opposite — what's being overlooked or overstated?` |

### Synthesis actions

| Button label | `data-agent-action` prompt pattern |
|---|---|
| **Synthesize** | `Given all criteria and assessments, which option wins? Weigh [list of criteria] and give a clear recommendation with reasoning. State the conditions under which you'd change the answer.` |
| **What if...** | `Re-evaluate the comparison assuming [parameter change]. Which option benefits most? Does the recommendation change?` |
| **Trade-off map** | `For each option, list what you gain and what you give up compared to the recommendation. Format as a compact list.` |

Place **Go deeper** and **Challenge** on individual criterion rows. Place
**Synthesize**, **What if...**, and **Trade-off map** in or near the
synthesis section.

## Context strategy

State block with options and criteria:

```json
{
  "question": "Which cache layer should we adopt?",
  "options": {
    "redis": { "label": "Redis", "summary": "..." },
    "memcached": { "label": "Memcached", "summary": "..." },
    "cloudflare-kv": { "label": "Cloudflare KV", "summary": "..." }
  },
  "criteria": {
    "latency": {
      "redis": "Sub-ms local, 2-5ms networked",
      "memcached": "Sub-ms, no persistence overhead",
      "cloudflare-kv": "~50ms globally consistent"
    },
    "ops-burden": { ... }
  },
  "weights": { "latency": "high", "ops-burden": "medium", "cost": "high" }
}
```

Include `weights` in state so the **Synthesize** and **What if...** buttons
can reference current priorities.

## Visual patterns

- Side-by-side layout: CSS grid with equal-width columns for options. On
  narrow screens, stack vertically with option labels as section headers.
- Criterion rows: alternate background tint (every other row slightly
  darker) for scannability. No horizontal rules between rows — the tint
  alternation is enough.
- Winner indicator: a small filled dot (preset accent color) next to the
  strongest option in each criterion row. Do not highlight the entire cell.
- Option headers: use the preset's display font, generous size. Each option
  column gets a subtle top border in the accent color.
- Synthesis section: full-width below the grid, visually separated by
  extra whitespace (not a card or box).

## Layout

Grid-based. Options are columns, criteria are rows. The first column
(criterion labels) is fixed-width; option columns are fluid and equal.

For 2 options: two columns + criterion label column = 3 columns.
For 3–4 options: same pattern, narrower cells.
For 5+ options: switch to a summary table (rows = options, columns =
criteria) with the detailed breakdown below as stacked sections.

## Anti-patterns specific to comparisons

- ❌ Pros/cons lists per option — these don't enable comparison. The reader
  has to mentally cross-reference. Use criterion rows that show all options
  on the same axis.
- ❌ Check/cross tables (✓/✗) — these flatten nuance into binary. Most
  criteria aren't binary; write 1–2 sentence assessments.
- ❌ Equal visual weight for all criteria — if some criteria matter more,
  say so visually (bold label, or include the weight in the label).
- ❌ "It depends" as the recommendation — always commit to a first choice
  and state the conditions for switching. The reader can disagree; they
  can't act on "it depends."
- ❌ Color-coding option columns (option A = blue, option B = green) —
  this adds visual noise without aiding comparison. Use the same preset
  colors throughout; differentiate by position, not color.
