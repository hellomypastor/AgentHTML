# Examples

Single-file HTML artifacts produced with the AgentHTML skill. Each one
opens directly in a browser — no build, no server. They run in mock
mode (no agent connected) so you can see the interactions without
setting up an adapter.

| Example | What it shows | Status |
|---|---|---|
| [`custom-editor/`](custom-editor/) | A commit message rewriter — paste a commit, pick a tone, see it rewritten. Push back on the tone and the agent argues for the alternative. | ✅ v0.1 |
| [`pr-review/`](pr-review/) | Annotated PR review with explain / suggest fix / dispute buttons on each finding. | ✅ v0.2 |
| [`research-report/`](research-report/) | Structured research report with drill-down on each section. | ✅ v0.2 |
| [`comparison/`](comparison/) | Side-by-side option comparison with synthesis and "what if" re-evaluation. | ✅ v0.2 |
| [`implementation-plan/`](implementation-plan/) | Phased engineering plan with task breakdown, risk analysis, and timeline compression. | ✅ v0.3 |
| [`triage-board/`](triage-board/) | Bug triage board with diagnose, suggest fix, and effort estimation per bug. | ✅ v0.3 |

Each example folder contains:

- `artifact.html` — the single-file artifact, ready to open in a browser
- `prompt.md` — the user prompt that produced it, plus notes on what the skill did

## The custom editor is the flagship

If you only look at one, look at `custom-editor/`. It's the demo that
makes the case for agent-aware HTML: an AI agent produces a `.html`
file that isn't a report you read once, but a tool you use.

## Run them locally

```bash
# Mac
open custom-editor/artifact.html

# Linux
xdg-open custom-editor/artifact.html

# Windows
start custom-editor/artifact.html
```

Or with the CLI:

```bash
agenthtml preview custom-editor/artifact.html
agenthtml serve custom-editor/artifact.html   # live reload + API proxy
```

## Mock mode vs live mode

Every example here runs in **mock mode** — the agent calls return
pre-baked responses inlined in the file. This lets the examples work
offline, on GitHub Pages, and without anyone managing an API key.

To run an example against a real agent, see the **Adapters** section
of [`skills/agenthtml/references/agent-protocol.md`](../skills/agenthtml/references/agent-protocol.md).
The same artifact works with mock, direct-API, or local-server
adapters — only the `<script>window.agentHtmlAdapter = ...</script>`
block changes.
