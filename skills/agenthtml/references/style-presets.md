# Style Presets

Read this file when you've reached Step 2 — no project design system was found, and
you need to commit to a visual language for the artifact.

## Contents

- How to choose a preset
- Universal anti-slop rules (apply to all presets)
- **Preset A — Editorial Dark**: serif display + mono body, single-color accent
- **Preset B — Brutalist Print**: cream paper + heavy slab serif + red accent
- **Preset C — Terminal**: monochrome mono + phosphor green/amber on near-black
- **Preset D — Soft Document**: warm off-white + grotesk + understated palette
- **Preset E — Industrial**: graph-paper grid + condensed sans + technical drawing feel
- Mixing presets (don't)
- Customizing within a preset

## How to choose

Pick based on the **artifact's content**, not the user's stated preference (they
don't have one yet). Match preset to tone:

| Artifact tone                          | Preset            |
|----------------------------------------|-------------------|
| Code review, plan, technical analysis  | A (Editorial Dark) or C (Terminal) |
| Status report, post-mortem, weekly     | B (Brutalist Print) or D (Soft Document) |
| Comparison, decision document          | A (Editorial Dark) |
| Explainer, research note               | B (Brutalist Print) |
| Dashboard, live data, ops              | C (Terminal) or E (Industrial) |
| Spec, RFC, architecture doc            | E (Industrial) |
| Hand-off doc to non-engineers          | D (Soft Document) |

If the artifact has a heavy emotional component (incident post-mortem, sensitive
HR communication), avoid C and E — they read as cold.

Pick **one** and commit. Switching presets mid-document is worse than picking the
"wrong" one consistently.

## Universal anti-slop rules

These apply to every preset and override anything else. If your output violates
these, the preset's distinctiveness is wasted.

1. **Never** put white (`#FFFFFF`) backgrounds with indigo/purple gradient cards.
   This is the single most common AI-output signature.
2. **Never** use rounded corners larger than 4px on cards or panels. Default to
   square corners (0px). Soft rounding (2-4px) is permissible only on small UI
   chrome (buttons, pills).
3. **Never** use system-ui, Inter, Roboto, or Arial as the *only* typeface. At
   minimum, pair them with one distinctive face. Better: avoid them entirely.
4. **Never** use emoji as section markers (🚀 Quick Start, ✨ Features). Use real
   typographic markers — small caps labels, numbered sections, geometric symbols
   (◆ ◇ ▸ §).
5. **Never** use four shades of the same hue for hierarchy (`#6366f1`, `#818cf8`,
   `#a5b4fc`, `#c7d2fe`). One hue + neutrals + one true accent is enough.
6. **Never** add drop shadows to convey "elevation" on every card. If shadows are
   used at all, they should be either very tight (1-2px) or dramatic (large, low
   opacity). The mid-range "Material card" shadow is the slop signal.
7. **Never** use glassmorphism (frosted blur, semi-transparent panels). It's been
   AI-default for two years.
8. **Never** make every page element fade-up on scroll. Animation is for specific
   moments (state changes, agent responses), not ambient atmosphere.

If you find yourself reaching for these patterns, stop. The preset gives you a
working alternative.

---

## Preset A — Editorial Dark

The default for technical artifacts. Looks like a thoughtfully typeset article in
a design magazine, not a SaaS dashboard.

**Use for**: code reviews, plans, comparisons, decision docs, technical analyses.

**Mood**: precise, considered, takes itself seriously.

**Hard differentiation from AI default**: dark `#0e0e0c` background (not pure
black, not blue-tinted dark), serif display + mono body (inverse of typical
dark-mode patterns), single warm gold accent.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  :root {
    --bg: #0e0e0c;
    --bg-2: #15140f;
    --ink: #e8e6e0;
    --ink-dim: #8b887e;
    --ink-fade: #4a4842;
    --rule: #2a2924;
    --accent: #fbbf24;
    --accent-dim: #b88c1c;
    --crit: #ef4444;
    --warn: #f59e0b;
    --info: #60a5fa;
    --add: #4ade80;
    --del: #f87171;
    --serif: 'Instrument Serif', 'Times New Roman', serif;
    --mono: 'JetBrains Mono', ui-monospace, Menlo, monospace;
  }
  body {
    background: var(--bg); color: var(--ink);
    font-family: var(--mono); font-size: 14px; line-height: 1.55;
    margin: 0;
  }
  h1, h2, h3 { font-family: var(--serif); font-weight: 400; letter-spacing: -0.01em; }
  h1 { font-size: 56px; line-height: 1.05; }
  h2 { font-size: 32px; font-style: italic; color: var(--ink); }
  h3 { font-size: 22px; }
  .eyebrow {
    font-family: var(--mono); font-size: 11px;
    letter-spacing: 0.18em; text-transform: uppercase;
    color: var(--accent);
  }
  hr { border: none; border-top: 1px solid var(--rule); margin: 32px 0; }
  code { background: rgba(232,230,224,0.08); padding: 1px 6px; border-radius: 2px; }
</style>
```

**Defining details**: italic serif headings against mono body, gold tracked-out
small caps as section labels, hairline rules instead of dividers.

---

## Preset B — Brutalist Print

Looks like a printed academic monograph or a brutalist zine. Heavy slab type,
generous margins, almost no UI chrome.

**Use for**: post-mortems, research notes, explainers, weekly status reports.

**Mood**: deliberate, slow, made-by-hand.

**Hard differentiation from AI default**: cream paper background (not white),
asymmetric layout (text column not centered), red accent only, no card
metaphor at all — flat type on paper.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Newsreader:ital,opsz,wght@0,6..72,400;0,6..72,500;0,6..72,700;1,6..72,400&family=IBM+Plex+Mono:wght@400;500&display=swap" rel="stylesheet">

<style>
  :root {
    --paper: #f4ede1;
    --paper-2: #ebe2d2;
    --ink: #1a1410;
    --ink-dim: #5b5247;
    --ink-fade: #9a9182;
    --rule: #b8ad9a;
    --accent: #c8341d;
    --accent-dim: #8a2414;
    --highlight: #f0d97a;
    --serif: 'Newsreader', Georgia, serif;
    --mono: 'IBM Plex Mono', ui-monospace, monospace;
  }
  body {
    background: var(--paper); color: var(--ink);
    font-family: var(--serif); font-size: 17px; line-height: 1.6;
    margin: 0; padding: 0;
  }
  .wrap {
    max-width: 680px; margin-left: 80px; padding: 64px 0;
  }
  h1 {
    font-family: var(--serif); font-weight: 700;
    font-size: 64px; line-height: 1.0; letter-spacing: -0.02em;
    margin: 0 0 24px;
  }
  h2 {
    font-family: var(--serif); font-weight: 700;
    font-size: 28px; margin-top: 56px;
    border-bottom: 2px solid var(--ink); padding-bottom: 6px;
    display: inline-block;
  }
  h3 { font-weight: 700; font-size: 19px; }
  .marginalia {
    position: absolute; left: -180px; width: 140px;
    font-family: var(--mono); font-size: 11px;
    color: var(--ink-dim); text-align: right;
    margin-top: 4px;
  }
  code { font-family: var(--mono); font-size: 14px; background: var(--paper-2); padding: 0 4px; }
  blockquote { border-left: 4px solid var(--accent); padding-left: 20px; font-style: italic; }
  mark { background: var(--highlight); padding: 1px 3px; }
</style>
```

**Defining details**: 80px left margin with marginalia (line numbers, dates,
references) hanging in the gutter, accent-colored em-dashes between meta items,
no rounded corners anywhere.

---

## Preset C — Terminal

Monospace everywhere. Reads like a terminal session that happens to render
typography. No serif anywhere, no card chrome, dense.

**Use for**: dashboards, live ops data, code-heavy explainers, anything that
should feel "operational".

**Mood**: dense, fast, machine-adjacent.

**Hard differentiation from AI default**: pure mono throughout, very dense
lineheight (1.4), phosphor-green or amber accent on near-black, ASCII separators
where appropriate.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Berkeley+Mono&family=JetBrains+Mono:wght@400;500;700&display=swap" rel="stylesheet">

<style>
  :root {
    --bg: #0a0d0a;
    --bg-2: #131613;
    --ink: #d4d8d0;
    --ink-dim: #7a8378;
    --ink-fade: #424942;
    --rule: #1f241f;
    --accent: #5ce478;
    --accent-dim: #2d8c44;
    --crit: #ff5f5f;
    --warn: #f0c674;
    --info: #82c8ff;
    --mono: 'Berkeley Mono', 'JetBrains Mono', ui-monospace, Menlo, monospace;
  }
  body {
    background: var(--bg); color: var(--ink);
    font-family: var(--mono); font-size: 13px; line-height: 1.45;
    margin: 0; padding: 0;
  }
  h1, h2, h3 { font-family: var(--mono); font-weight: 700; }
  h1 { font-size: 22px; text-transform: uppercase; letter-spacing: 0.05em; }
  h1::before { content: '$ '; color: var(--accent); }
  h2 {
    font-size: 14px; text-transform: uppercase; letter-spacing: 0.15em;
    color: var(--accent); margin-top: 40px;
  }
  h2::after { content: ''; display: block; border-top: 1px dashed var(--rule); margin-top: 8px; }
  h3 { font-size: 13px; color: var(--ink); }
  .label { color: var(--ink-dim); }
  .ok { color: var(--accent); }
  .err { color: var(--crit); }
  .warn { color: var(--warn); }
  table { border-collapse: collapse; width: 100%; }
  td, th { border-bottom: 1px solid var(--rule); padding: 6px 12px; text-align: left; }
  th { color: var(--ink-dim); text-transform: uppercase; font-size: 11px; letter-spacing: 0.1em; }
</style>
```

**Defining details**: `$ ` prefix on H1, dashed-rule headers, status colors used
liberally for tags/numbers, ASCII tables with hairline dividers.

---

## Preset D — Soft Document

The "shareable with non-engineers" preset. Warm, readable, a little reminiscent
of well-set documentation sites but without the SaaS-template feel.

**Use for**: status updates for stakeholders, project hand-offs, client-facing
reports, anything a PM or designer would forward.

**Mood**: calm, professional, low-anxiety.

**Hard differentiation from AI default**: warm off-white (not pure white),
restrained palette of muted neutrals + one deep accent, generous body typography,
no cards.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter+Tight:wght@400;500;600&display=swap" rel="stylesheet">

<style>
  :root {
    --paper: #faf7f2;
    --paper-2: #f0ece3;
    --ink: #2a2620;
    --ink-dim: #6a655c;
    --ink-fade: #a8a39a;
    --rule: #d8d2c4;
    --accent: #2c5e4f;
    --accent-light: #d8e8e1;
    --warn: #b85c00;
    --serif: 'Fraunces', Georgia, serif;
    --sans: 'Inter Tight', ui-sans-serif, sans-serif;
  }
  body {
    background: var(--paper); color: var(--ink);
    font-family: var(--sans); font-size: 16px; line-height: 1.65;
    margin: 0;
  }
  .wrap { max-width: 760px; margin: 0 auto; padding: 64px 32px; }
  h1 { font-family: var(--serif); font-weight: 600; font-size: 44px; line-height: 1.1; letter-spacing: -0.02em; }
  h2 { font-family: var(--serif); font-weight: 600; font-size: 26px; margin-top: 48px; }
  h3 { font-family: var(--sans); font-weight: 600; font-size: 17px; text-transform: none; }
  .lede { font-family: var(--serif); font-size: 22px; line-height: 1.45; color: var(--ink-dim); }
  .pill {
    display: inline-block; padding: 2px 10px; border-radius: 999px;
    background: var(--accent-light); color: var(--accent);
    font-size: 12px; font-weight: 500;
  }
  blockquote {
    border-left: 3px solid var(--accent); padding-left: 20px;
    color: var(--ink-dim); font-family: var(--serif); font-style: italic; font-size: 18px;
  }
</style>
```

**Defining details**: serif-for-display + sans-for-body (this order is rarer than
the inverse), forest-green accent (uncommon in AI defaults which lean
indigo/purple), pills as the only "rounded" UI element.

---

## Preset E — Industrial

Looks like an engineering drawing or a CAD specification sheet. Graph-paper
grid background, condensed type, technical numbering scheme.

**Use for**: spec docs, RFCs, architecture documents, system diagrams, anything
that benefits from feeling formal-technical.

**Mood**: precise, tabular, "as-built".

**Hard differentiation from AI default**: subtle grid background, condensed
sans, all-caps section codes (§01, §02), heavy use of monospace for measurements
and identifiers, blueprint cyan accent.

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;700&family=Archivo+Narrow:wght@500;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">

<style>
  :root {
    --paper: #f6f7f8;
    --grid: #e2e6ea;
    --ink: #15191e;
    --ink-dim: #5a6068;
    --ink-fade: #9aa0a8;
    --rule: #c4cad0;
    --accent: #0066b8;
    --accent-light: #d8e8f5;
    --warn: #b85c00;
    --crit: #b8001f;
    --sans: 'Archivo', sans-serif;
    --condensed: 'Archivo Narrow', sans-serif;
    --mono: 'JetBrains Mono', monospace;
  }
  body {
    background-color: var(--paper);
    background-image:
      linear-gradient(var(--grid) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid) 1px, transparent 1px);
    background-size: 24px 24px;
    color: var(--ink);
    font-family: var(--sans); font-size: 14px; line-height: 1.55;
    margin: 0;
  }
  .wrap { max-width: 1100px; margin: 0 auto; padding: 48px 32px; background: var(--paper); }
  h1 { font-family: var(--condensed); font-weight: 700; font-size: 38px; text-transform: uppercase; letter-spacing: 0.02em; }
  h2 { font-family: var(--condensed); font-weight: 700; font-size: 18px; text-transform: uppercase; letter-spacing: 0.08em; }
  h2::before { content: '§ '; color: var(--accent); font-family: var(--mono); }
  h3 { font-family: var(--sans); font-weight: 700; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; }
  .ref { font-family: var(--mono); font-size: 12px; color: var(--accent); }
  .measure { font-family: var(--mono); color: var(--ink-dim); }
  table { border: 2px solid var(--ink); border-collapse: collapse; }
  th, td { border: 1px solid var(--rule); padding: 8px 12px; }
  th { background: var(--ink); color: var(--paper); font-family: var(--condensed); text-transform: uppercase; font-size: 12px; letter-spacing: 0.08em; }
</style>
```

**Defining details**: visible 24px grid, condensed all-caps headers, `§` section
markers, bordered tables with inverted (black/white) headers, blueprint blue
accent.

---

## Mixing presets

Don't. Pick one. The presets are designed as complete visual systems — colors,
typography, and chrome are tuned to each other. Borrowing the typography of one
into another's color palette produces something that looks accidentally
combined, which is the AI signal.

If none of the five fits the task perfectly, pick the **closest** and adjust
within it (see below). Don't blend.

## Customizing within a preset

It's fine to:

- Swap the accent color for one matching the user's brand (`--accent`)
- Adjust the wrap width (`max-width` on `.wrap`) for content density needs
- Add severity colors not in the preset's defaults (`--warn`, `--info` etc.)

It's not fine to:

- Mix two display fonts (the preset specifies one display + one body — keep that
  ratio)
- Add gradients, shadows, or rounded cards that the preset doesn't already use
- Combine background characteristics (e.g. graph-paper grid from E onto the dark
  palette of A)

When in doubt: less customization is better than more. The presets win on
identity, not on flexibility.
