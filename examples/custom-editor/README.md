# custom-editor — commit message rewriter

The flagship AgentHTML example. An AI agent produced this entire
`.html` file from a short prompt. It's not a report you read — it's
a tool you use.

## Try it

```bash
open artifact.html              # macOS
xdg-open artifact.html           # Linux
start artifact.html              # Windows
```

The page runs in **mock mode** — agent calls return baked-in responses
so the demo works offline.

## What to look for

1. **Edit the commit on the left.** Bindings sync to state in real time.
2. **Pick a tone and a length.** Try `Terse / Short` vs `Explanatory / Long` —
   the rewrites should be qualitatively different.
3. **Hit Rewrite.** Right pane fills with the new commit, plus three follow-up
   buttons: Copy, Regenerate, Push back.
4. **Click "Push back on this tone."** The agent argues for the *opposite*
   tone — this is the moment that makes the case for agent-aware artifacts.
   A static document can't do this.

## What it demonstrates from the AgentHTML protocol

| Protocol feature | Used here for |
|---|---|
| `<script id="agenthtml-state">` | Holds `input`, `tone`, `length`, `scope` |
| `data-agent-bind` on textarea | Keeps the input synced to state |
| Custom segmented controls | Update state on click (no `data-agent-bind` needed for radio-style groups) |
| `data-agent-action` on Rewrite | Sends the prompt envelope to the agent |
| `data-agent-context` | Tells the agent which state slots to include |
| `data-agent-target` | Specifies where to render the response |
| Push-back as a second action | Same protocol, different prompt — argues against the chosen tone |

## What the agent had to figure out

From the user prompt alone (see [`prompt.md`](prompt.md)):

- The artifact's content is dev-facing → pick **Editorial Dark** preset
- The artifact has tweakable parameters → make it **agent-aware**
- The user said "mock the agent calls" → swap the live adapter for an inlined
  mock function with realistic responses across all 12 (tone × length) combos
- The user said "push back" → add a counter-argument button that uses the same
  protocol with a different prompt

No part of this was hand-coded after the agent produced it.

## Run it against a real agent

Replace the mock at the bottom of `artifact.html` with one of the adapters
from [`skills/agenthtml/references/agent-protocol.md`](../../skills/agenthtml/references/agent-protocol.md).
The protocol stays the same; only the adapter swaps.
