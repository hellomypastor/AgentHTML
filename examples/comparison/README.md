# comparison — side-by-side option evaluation

A cache layer comparison (Redis vs. Memcached vs. Cloudflare KV) with
criteria-based evaluation grid and agent-aware synthesis.

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

1. **Criteria grid** — each row compares all three options on one axis.
2. **Winner dots** — small accent-colored dots mark the strongest option
   per criterion.
3. **Go deeper** — asks the agent to expand on a specific criterion with
   benchmarks and evidence.
4. **Synthesize** — asks the agent to weigh all criteria and give a
   recommendation.
5. **"What if..."** — re-evaluates the comparison under different priorities.

## What it demonstrates

| Protocol feature | Used here for |
|---|---|
| `data-agent-action` | Per-criterion and synthesis-level prompts |
| `data-agent-context` | Sends criteria assessments and weights |
| `data-agent-target` | Slots within criterion rows and synthesis section |
| State with weights | Enables "what if" re-evaluation with changed priorities |

## Style

Uses **Preset E — Industrial**: graph-paper grid background, condensed
all-caps headers, blueprint cyan accent. Technical drawing aesthetic.

See `category-comparison.md` for the category-specific patterns used.
