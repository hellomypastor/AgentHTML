# AgentHTML

> AI agents should not stop at Markdown.

**AgentHTML** is a Skill-first toolkit that helps AI agents produce
self-contained HTML artifacts — reports, plans, reviews, dashboards,
and small tools — that look like a person made them, and can call
agents back from inside the page.

```
Markdown is for drafts.
HTML is for deliverables.
And HTML can do something Markdown can't: call agents back.
```

> **v0.1 note**: a 20-second demo GIF is coming. Until then, try the
> live example: [`examples/custom-editor/artifact.html`](examples/custom-editor/artifact.html) —
> open it in any browser. The buttons aren't decoration; they call back
> to the agent. This is what AgentHTML teaches your agent to make.

## Why this exists

AI agents output a lot of Markdown. Markdown is fine for drafts and
intermediate notes — it's the right tool when content is in flux.

But when the content is **finished** — a PR review you'll share, a plan
you'll act on, a report you'll send — Markdown loses. Long Markdown
documents are visually flat, hard to scan, impossible to interact with,
and obviously machine-generated. The reader does a second pass of work
to make it look presentable.

HTML wins for finished deliverables. It can have hierarchy, density,
tables, timelines, side-by-side comparisons, collapsible sections.
And — uniquely — it can be **agent-aware**: buttons in the artifact
can call back to an agent, drill into a finding, recompute a parameter,
challenge a recommendation. The artifact stops being a document and
starts being a small tool.

[Thariq Shihipar's *Unreasonable Effectiveness of HTML*][thariq] made
the case for HTML over Markdown. AgentHTML is the toolkit that takes
the next two steps:

1. **Anti-slop visual defaults.** Five style presets that don't look
   like the indigo-gradient-with-emoji AI default.
2. **Agent-aware HTML.** A 2KB protocol — five HTML attributes — that
   lets the artifact talk back to your agent.

[thariq]: https://thariqs.github.io/html-effectiveness/

## What you get

```
agenthtml/
├── skills/agenthtml/          # The skill your agent loads
│   ├── SKILL.md
│   └── references/
│       ├── style-presets.md       # 5 visual presets, full design tokens
│       └── agent-protocol.md      # Data attributes, inline runtime, adapters
├── examples/                  # Single-file demos, open in any browser
│   ├── custom-editor/             # The commit rewriter above ↑
│   ├── pr-review/                 # Code review with explain/fix/dispute
│   ├── research-report/           # Structured report with drill-down
│   └── comparison/                # Side-by-side with synthesis
└── cli/                       # `agenthtml init | preview | validate`
```

## Install

```bash
npm install -g agenthtml
```

Then in any project:

```bash
agenthtml init
```

This drops the skill into `.agenthtml/` and registers it with Claude
Code (or whichever agent you're using).

## Use it

In your agent of choice:

> "Use AgentHTML to write a PR review of this branch as an interactive
> HTML artifact."

> "Make me an AgentHTML status report for this week."

> "Build an AgentHTML mini tool: takes a Postgres query, suggests three
> index strategies, lets me pick one."

The agent reads the skill, picks a visual preset that fits the content,
decides whether to make the artifact agent-aware, and writes one
self-contained `.html` file.

Open it in any browser. No build, no server, no auth. The page works
from `file://`.

## Preview, validate, and serve

```bash
agenthtml preview artifact.html      # opens it in your browser
agenthtml validate artifact.html     # checks AgentHTML conventions
agenthtml serve artifact.html        # local server + API proxy + live reload
```

Validate catches the usual problems: external script dependencies,
missing summary, broken `data-agent-*` bindings, AI-slop visual
signatures (indigo gradients, emoji section headers, glassmorphism).

`serve` starts a local server on port 7331 that:
- Injects the local-server adapter (no manual `<script>` tag needed)
- Proxies `/agent` requests to the Anthropic API (`ANTHROPIC_API_KEY`)
- Watches the file and live-reloads on save

## How agent-aware works

This is the part Thariq didn't do, and it's why AgentHTML exists.

Five HTML attributes, one ~2KB runtime, no build step:

```html
<!-- artifact state, kept in sync with bindings -->
<script type="application/json" id="agenthtml-state">
  { "tone": "conventional", "input": "..." }
</script>

<!-- A binding -->
<select data-agent-bind="tone">
  <option value="terse">Terse</option>
  <option value="conventional">Conventional</option>
</select>

<!-- A button that calls the agent back -->
<button
  data-agent-action="Rewrite the commit in state.input using tone state.tone"
  data-agent-context="input,tone"
  data-agent-target="#output"
  data-agent-render="html">
  Rewrite
</button>

<div id="output"></div>
```

The runtime intercepts the click, sends a structured prompt envelope
to the agent (mock, direct API, or local server — your choice), and
patches the result into `#output`. Full spec and runtime source in
[`skills/agenthtml/references/agent-protocol.md`](skills/agenthtml/references/agent-protocol.md).

## Adapters

Same artifact, three ways to wire it to an agent:

| Adapter | When to use | Setup |
|---|---|---|
| **Mock** | Demos, `examples/`, GitHub Pages | None — runtime falls back automatically |
| **Direct API** | Shareable artifacts with BYO key | `<script>window.agentHtmlAdapter = ...</script>` |
| **Local server** | Working inside Claude Code | `agenthtml serve artifact.html` |

The artifact doesn't encode which adapter is in use. The same `.html`
file can ship as a static mock-mode demo and become live by adding
one script tag.

## Visual presets

Five visual languages. The skill picks one based on the artifact's
content; you can override. Full tokens in [`style-presets.md`](skills/agenthtml/references/style-presets.md).

| Preset | Vibe | Best for |
|---|---|---|
| **Editorial Dark** | Serif display + mono body, single warm-gold accent | Code review, plans, technical analysis |
| **Brutalist Print** | Cream paper, heavy slab serif, red accent | Post-mortems, research notes, explainers |
| **Terminal** | Mono everywhere, phosphor accent, dense | Dashboards, ops, code-heavy explainers |
| **Soft Document** | Warm off-white, serif headings + sans body | Stakeholder updates, hand-offs |
| **Industrial** | Graph-paper grid, condensed all-caps, blueprint cyan | Specs, RFCs, architecture docs |

None of them look like the indigo-gradient-with-emoji AI default.
That's the whole point.

## How this is different from related work

**[Thariq Shihipar's *Unreasonable Effectiveness of HTML*][thariq]** —
the prior art. Twenty static HTML demos arguing HTML > Markdown for
LLM output. AgentHTML takes the next two steps Thariq didn't:
non-AI-slop visuals by default, and agent-aware artifacts.

**Skills that decide *whether* to use HTML.** AgentHTML doesn't make
that call — it assumes the call is made and governs *how* the HTML
looks and behaves. The two can compose.

**[oh-my-mermaid](https://github.com/oh-my-mermaid/oh-my-mermaid)** —
same pattern (skill + local tooling), different asset class. oh-my-mermaid
turns code into living architecture diagrams. AgentHTML turns LLM
output into living tools.

**Claude Artifacts (the product).** Anthropic's artifacts run inside
the Claude product. AgentHTML produces standalone `.html` files that
work in any browser, with any agent (Claude Code, Codex, Cursor,
Gemini CLI), shipping to anyone — no product lock-in.

## What this is not

- ❌ A Claude Artifacts clone
- ❌ A Markdown-to-HTML converter
- ❌ A web app builder
- ❌ A slide-deck-only tool
- ❌ A SaaS, gallery platform, or hosted service

It's a skill, some references, four examples, and a small CLI. The
artifact your agent produces is just a `.html` file. You own it. You
can put it anywhere.

## Status

**v0.2** — Skill, references, CLI with `init/preview/validate/serve`,
four examples covering different artifact categories.

What shipped in v0.2:
- `agenthtml init` / `preview` / `validate` CLI
- `agenthtml serve` — local HTTP server with Anthropic API proxy + live reload
- Category-specific references: PR review, status reports, comparisons
- Three new examples: PR review, research report, side-by-side comparison

Coming next (v0.3):
- Packaged `.skill` build for one-click install on claude.ai
- `category-implementation-plan.md` reference
- Streaming adapter support
- More examples (implementation plan with timeline, triage board)

## Contributing

Right now: try the skill on your own artifacts and tell us where it
breaks. Open an issue with the prompt you used and the HTML it
produced. The fastest path to v0.2 is real-world failure cases.

Style preset PRs welcome. Category reference PRs welcome
(`skills/agenthtml/references/category-*.md`). Please open an issue
to discuss before writing — these files are the agent's primary
context and need to compose with each other.

## License

Apache 2.0.

## Acknowledgments

- **Thariq Shihipar** for the original argument about HTML over Markdown
  and the twenty demos that made it concrete.
- **Omar Sanseviero** for the "agents talk to artifacts, artifacts talk
  to agents" framing that motivates the agent-aware protocol.
- **The oh-my-mermaid team** for showing what a Claude Code skill
  ecosystem can look like at scale.
- **dogum** for being first with `html-artifacts` — sometimes the
  prior art tells you what's missing.

---

<sub>AgentHTML is a community project, not an Anthropic product.
"Claude" and "Claude Code" are trademarks of Anthropic.</sub>
