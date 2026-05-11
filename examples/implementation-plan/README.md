# implementation-plan — phased engineering plan

A 3-phase implementation plan for API rate limiting with agent-aware
task breakdown, risk identification, and timeline compression.

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

1. **Timeline overview** — CSS flexbox track with proportional phase blocks.
2. **Break down tasks** — asks the agent to decompose a phase into
   concrete engineering tasks with day estimates.
3. **Identify risks** — surfaces risks beyond what's already documented.
4. **Compress timeline** — explores what it takes to cut a phase in half.
5. **Critical path** — plan-level analysis of the dependency chain.
6. **Decision points** — explicit moments where the team must choose.

## What it demonstrates

| Protocol feature | Used here for |
|---|---|
| `data-agent-action` | Phase-specific and plan-level prompts |
| `data-agent-context` | Sends phase scope, deliverables, and risks |
| `data-agent-target` | Per-phase response slots |
| State block | Full plan data for cross-phase agent reasoning |

## Style

Uses **Preset D — Soft Document**: warm off-white background, amber accent,
Libre Baskerville + Inter. See `category-implementation-plan.md` for the
category-specific patterns used.
