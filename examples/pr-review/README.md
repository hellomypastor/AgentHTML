# pr-review — annotated code review

A PR review artifact with severity-coded findings, code snippets, and
agent actions to explain, suggest fixes, or dispute findings.

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

1. **Severity bars** on the left edge of each finding — red for critical,
   amber for warning, blue for suggestion.
2. **Explain** button — asks the agent to elaborate on why the finding matters.
3. **Suggest fix** — returns a concrete code fix inline.
4. **Dispute** — plays devil's advocate, arguing the current code might be fine.

## What it demonstrates

| Protocol feature | Used here for |
|---|---|
| `data-agent-action` | Per-finding prompts with specific context |
| `data-agent-context` | Sends the finding's code and metadata to the agent |
| `data-agent-target` | Each finding has its own response slot |
| State block | Finding data keyed by ID for context resolution |

## Style

Uses **Preset A — Editorial Dark**: deep navy background, warm-gold accent,
Playfair Display + JetBrains Mono. See `category-pr-review.md` for the
category-specific patterns used.
