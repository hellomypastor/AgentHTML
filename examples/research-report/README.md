# research-report — structured research with drill-down

A technical research report comparing WebSocket and Server-Sent Events,
with agent-aware drill-down buttons on each section.

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

1. **Section drill-down** — each section has a button to get deeper analysis.
2. **Challenge** buttons — asks the agent to argue the opposite position.
3. **Print-publication aesthetic** — slab serif headings, cream background,
   tracked-out small caps for section labels.

## What it demonstrates

| Protocol feature | Used here for |
|---|---|
| `data-agent-action` | Section-specific drill-down prompts |
| `data-agent-context` | Sends section summary for grounded responses |
| `data-agent-target` | Response slots per section |
| Graceful degradation | Reads as a complete static document without agent |

## Style

Uses **Preset B — Brutalist Print**: cream paper, heavy slab serif,
red accent. Newspaper-like typographic feel.
