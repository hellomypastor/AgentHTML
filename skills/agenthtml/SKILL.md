---
name: agenthtml
description: Use whenever the natural deliverable is a substantial HTML artifact — a self-contained .html file the user will read, share, or come back to. Triggers include reports, plans, PR reviews, status dashboards, comparisons, decision docs, explainers, post-mortems, weekly updates, implementation plans, triage boards, mini tools/editors. The skill is built on a strong default: Markdown is for drafts and intermediate notes; HTML is for finished human-facing deliverables. So when the user asks for a "report", "summary", "plan", "review", "comparison", "writeup", "memo", "doc", or "writeup" that is at least ~3 sections long, default to HTML and apply this skill — even if the user did not say "HTML" or "interactive". The skill governs (1) how the HTML looks, so it doesn't read as generic AI output (gradient cards, indigo palettes, emoji headers), and (2) whether the artifact should be agent-aware — buttons or inputs that call agents back to drill in, tweak, or revise the artifact in place. Do NOT trigger for: short HTML snippets, single components, code-only outputs, ~under 50 lines of intended HTML, "hello world" or scaffolding tasks, explicit markdown-format requests, or conversational HTML answers.
---

# AgentHTML

A skill that helps AI agents produce HTML artifacts that are (1) visually distinctive — not
the generic gradient-card-with-emoji "AI slop" — and (2) optionally **agent-aware**:
artifact buttons and inputs that call agents back, so the page becomes a small living tool
instead of a static document.

## The premise

> Markdown is for drafts.
> HTML is for deliverables.
> And HTML can do something Markdown can't: call agents back.

Most AI output today stops at Markdown — fine for intermediate notes, lossy for finished
work the user will read, share, or come back to. This skill assumes the decision to use
HTML has been made (because the deliverable is substantial enough that Markdown loses) and
governs *how* the HTML looks and *whether* it can be acted on.

If the user is genuinely asking "should I use HTML or markdown for this?", help them
decide first; that's a separate question. Once HTML is the format, this skill takes over.

## Core idea

Most LLM-generated HTML loses on two axes at once:

1. **It looks AI-generated.** Indigo gradients on white, four shades of purple,
   emoji-decorated headers, glassmorphism cards, generic sans-serif body. Recognizable
   in 0.5s. Hurts trust before the content is read.
2. **It's dead.** A 500-line plan with no way to drill in, no way to challenge a
   finding, no way to tweak a parameter and see the result. The reader either consumes
   it linearly or goes back to the chat to ask follow-ups.

This skill addresses both. Every artifact this skill produces should be:

- **Visually anchored** to a chosen style preset (or the user's existing design system)
  — never the AI-default look.
- **Agent-aware where useful** — buttons, inputs, or annotated regions that, when
  clicked, send a structured prompt back to the agent and patch the artifact in place.

## Decision flow

When you're about to produce an HTML artifact, walk these steps in order:

### Step 1 — Check for an existing project style (one pass, then move on)

Before generating CSS from scratch, do a **single scan** for project style sources, in
this order. Stop at the first hit; if none are found within one pass, go to Step 2 —
do not keep searching, do not ask the user.

1. `tailwind.config.{js,ts,mjs}` — extract `theme.extend.colors`, `fontFamily`,
   `spacing` if present
2. `theme.ts`, `theme.js`, `tokens.ts` — exported design token objects
3. `tokens.json`, `design-tokens.json`
4. `globals.css`, `app.css`, `theme.css`, `:root` block in any top-level CSS — pull
   `--*` custom properties
5. `design-system.html` or `.agenthtml/design-system.html`

If you find any of these, derive the artifact's color palette, typography, and
spacing from that source. Do not invent new tokens that conflict. The artifact should
look like it belongs to the project.

If the scan turns up nothing, proceed to Step 2 and pick a preset. Do not loop back
to look harder.

### Step 2 — Pick a style preset

Read `references/style-presets.md` and choose **one** preset based on the artifact's
purpose and tone. Do not blend presets. Do not ask the user — pick one and commit; the
user can swap presets in seconds if the choice is wrong.

The presets are designed to be visually distinct from each other and from typical
AI-generated HTML. Each one has a complete set of design tokens.

### Step 3 — Decide if the artifact should be agent-aware

Agent-aware means the artifact has buttons or inputs that send a structured prompt
back to the agent and patch the artifact in place. This is the second layer of value
this skill adds — but it's optional, not mandatory.

Add agent-aware controls if **either** of these holds:

- **The artifact has discrete items a reader will likely want to act on individually**
  — findings, options, milestones, rows, line items, recommendations. Each gets a
  small set of context-specific actions (e.g. "explain this", "show alternatives",
  "draft fix", "challenge this").
- **The artifact has parameters whose value is debatable** — a date, a threshold, a
  weighting, a sort order, a filter. Make those parameters live, with a button that
  asks the agent to recompute downstream content.

If neither holds, ship the artifact static. Static is the right answer for: one-time
figures, finished post-mortems where the facts are settled, reference cards, slide
decks intended to be presented linearly. Agent-aware controls on a static-by-nature
artifact look like decoration and erode trust.

Read `references/agent-protocol.md` if you decide to make the artifact agent-aware.
The runtime is small (~2KB) and inlines into the file directly.

### Step 4 — Pick category-specific patterns

If a relevant category reference exists, read it. Check `references/` for a
file matching your artifact:

- `references/category-pr-review.md` — annotated diffs with explain/fix/dispute
- `references/category-status-report.md` — status updates with drill-down
- `references/category-comparison.md` — side-by-side options with synthesis

Planned but not yet documented:
- `references/category-implementation-plan.md` — plans with adjustable timelines

If no category file exists for your artifact, fall back to the general patterns:

- Use the chosen style preset's defaults for typography and spacing
- For each "discrete item" in the artifact, attach 2-3 context-specific agent
  actions (see Step 3)
- Group related items visually (left-side severity bar, label color, or a
  hairline rule between groups), not with cards-on-cards
- Put the most important information first; details collapse below or load on
  demand via agent actions

### Step 5 — Generate the HTML

Single self-contained `.html` file unless the user asks otherwise. Inline all CSS and
JS. Use the agent-protocol runtime as a single inlined script (see `references/agent-protocol.md`
for the minimal version — it's small enough to inline, ~2KB).

## Universal rules — always

These apply to every HTML artifact produced under this skill, regardless of preset.

### Visual

- **Never** use generic AI-default aesthetics: indigo→purple gradients, white card on
  off-white background, four shades of one color used for hierarchy, emoji as section
  headers, glassmorphism, drop-shadow soft cards, "✨" or "🚀" decorations.
- **Always** commit to one of: dark background OR off-white/cream background OR
  high-contrast color background. Pure white (#FFFFFF) is rarely the right choice.
- **Always** pair a display font (serif, slab, mono, or distinctive sans) with a body
  font that is different. Default Inter / system-ui everywhere = AI slop signal.
- **Always** use one accent color, not a palette. Severity bars and category tags
  can use a small fixed set (red / amber / blue / green) but the artifact's visual
  identity is one color.
- Generous typographic detail: tracked-out small caps for section labels, italic
  serif for emphasis, monospace for code/data. These details kill the AI signal
  faster than any other change.

### Structural

- One self-contained file. Fonts via Google Fonts `<link>` is OK; everything else inline.
- No build step required. No `<script type="module">` with imports unless the script
  truly needs to be a module. Plain `<script>` blocks at end of body.
- Artifact must render correctly when opened directly from the filesystem
  (`file://`). No fetch to relative paths, no requirement for a server.
- Mobile-responsive by default, but desktop-first in design priority. The artifact's
  natural reading surface is a 1200px-wide laptop screen; phone is the secondary
  case.

### Behavioral

- If the artifact is agent-aware, every action button must be **specific**. "Explain
  this" not "Help". "Suggest a fix for this finding" not "Ask the agent". The button
  text is the prompt the user is sending.
- Buttons that change state must show a loading indicator while the agent responds.
  Never a frozen UI.
- Agent responses get rendered in a dedicated slot near the source button, not
  appended to the page bottom. Spatial proximity is the whole point.
- Every agent-aware artifact must remain **useful when the agent isn't reachable**.
  If the runtime fails to load or the agent call errors, the artifact should still
  read as a complete document. Buttons can fail; the content cannot.

### Anti-patterns — never do these

- ❌ Generate a "design system" object inside the page just to override it three
  times with inline styles
- ❌ Use Tailwind via CDN and then write custom CSS that fights it
- ❌ Add `data-agent-action` to a button without writing the matching handler in the
  inlined runtime
- ❌ Wrap everything in centered max-width cards on a gradient background
- ❌ Use emoji to substitute for icons; either use real SVG icons or skip icons
- ❌ Use ASCII box-drawing characters (─ │ ┌ ┐ └ ┘ ├ ┤ ▼ etc.) for diagrams or
  flowcharts. This is HTML, not a terminal — use CSS-drawn boxes with borders,
  flexbox/grid layouts, and styled connectors for any visual structure. ASCII art
  in an HTML artifact defeats the entire premise of using HTML over Markdown.
- ❌ Output the HTML inside a markdown code fence; produce the file directly

## What this skill does NOT do

- Decide *whether* HTML is the right format for the task. The skill assumes HTML is
  the format; if the user is asking that question, answer it separately first.
- Replace the user's existing design system. If a design system exists in the project,
  this skill defers to it (Step 1).
- Implement deployment, hosting, sharing, or auth flows. The artifact is one
  self-contained `.html` file. The `agenthtml` CLI offers `init`, `preview`,
  `validate` and nothing more — anything beyond that lives downstream.

## Quick reference table

| If the artifact is...               | Read first                                  | Agent-aware? |
|-------------------------------------|---------------------------------------------|--------------|
| A PR review                         | `style-presets.md` + `agent-protocol.md`    | Yes, default |
| A status / weekly report            | `style-presets.md` + `agent-protocol.md`    | Yes, useful  |
| An implementation plan              | `style-presets.md` + `agent-protocol.md`    | Yes, useful  |
| A side-by-side comparison           | `style-presets.md` + `agent-protocol.md`    | Optional     |
| A custom editor / triage tool       | `style-presets.md` + `agent-protocol.md`    | Yes, core    |
| A one-time figure or diagram        | `style-presets.md` only                     | No           |
| A reference card / cheat sheet      | `style-presets.md` only                     | No           |
| A slide deck                        | `style-presets.md` only (treat as static)   | No           |

Plus: read `references/category-*.md` if a file matching your artifact exists.

When the table doesn't cover the case, default to: pick a style preset, decide
agent-awareness from Step 3, write it.
