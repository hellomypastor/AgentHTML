# triage-board — bug triage with agent actions

A bug triage board for an API gateway with 6 bugs across 3 severity
levels, each with agent-aware diagnose, fix, and estimation actions.

## Try it

```bash
open artifact.html              # macOS
xdg-open artifact.html           # Linux
start artifact.html              # Windows
```

Or use the CLI:

```bash
agenthtml serve artifact.html    # live reload + API proxy on :7331
```

## What to look for

1. **Severity grouping** — critical bugs first, visually prominent.
2. **Diagnose** — asks the agent for root cause analysis per bug.
3. **Suggest fix** — returns a concrete approach for fixing the bug.
4. **Estimate effort** — provides a time estimate with reasoning.
5. **Prioritize queue** — board-level action that ranks all bugs.

## What it demonstrates

| Protocol feature | Used here for |
|---|---|
| `data-agent-action` | Per-bug diagnostic and fix prompts |
| `data-agent-context` | Sends bug description, component, and severity |
| `data-agent-target` | Response slots after each bug's action row |
| Dense layout | Ops tool aesthetic — information density over whitespace |

## Style

Uses **Preset C — Terminal**: near-black background, phosphor green accent,
JetBrains Mono everywhere. Dense, console-inspired layout.
