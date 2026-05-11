# Commit message rewriter — the prompt

This is the prompt that produced `artifact.html`. It's deliberately short — the
AgentHTML skill is doing most of the work.

---

## User prompt

> Make me an AgentHTML artifact that's a commit message rewriter. I paste a
> commit on the left, pick a tone (terse, conventional, explanatory, changelog)
> and a length, and the agent rewrites it on the right. Also let me push back
> on the chosen tone and have the agent argue the opposite case. Single file,
> works offline, mock the agent calls so the demo runs without an API key.

That's it.

---

## What the skill did with that

The user said "AgentHTML artifact" → skill activates. Then:

1. **Step 1 (project style scan)**: no project files found → falls through.
2. **Step 2 (pick a preset)**: prompt is technical, tool-like, dev-facing →
   skill picks **Editorial Dark** from `references/style-presets.md`.
3. **Step 3 (agent-aware?)**: the artifact has tweakable parameters (tone,
   length, scope) and items the user wants to act on (the rewritten output) →
   skill commits to making it agent-aware.
4. **Step 4 (category-specific)**: no category file matches "custom editor"
   directly — skill falls back to general agent-aware patterns from `SKILL.md`
   plus the protocol in `references/agent-protocol.md`.
5. **Step 5 (generate)**:
   - State block at the top with `input`, `tone`, `length`, `scope`
   - `<textarea data-agent-bind="input">` for the left pane
   - Segmented controls as a custom pattern (not in protocol, but `aria-pressed`
     toggle pairs cleanly with state)
   - Primary button: `data-agent-action="Rewrite the commit in state.input
     using tone state.tone, length state.length..."` with
     `data-agent-target="#rewrite-output"`
   - Push-back button generated in the rewrite output block, also using
     `data-agent-action` to call back with the opposite framing
   - Inlined mock adapter at the bottom — covers all 12 (tone × length)
     combinations plus 4 pushback responses

## What's worth noticing

- **The user didn't specify any visual styling.** "Editorial Dark" was picked
  by the skill because the artifact's *content* (dev tool, technical) maps to
  that preset's tone (technical, considered).
- **The user didn't specify the protocol.** `data-agent-bind`, `data-agent-action`,
  `data-agent-target` are the skill's defaults — the user said "the agent
  rewrites it on the right" and the skill produced the right bindings.
- **The user said "mock the agent calls".** The skill swapped the live adapter
  for an inlined mock function with 12 realistic responses. In a real Claude
  Code session, the user could later swap the mock for the local-server
  adapter from `references/agent-protocol.md` and the artifact would still
  work — same protocol.

## What the AI didn't write

The `mockRewrite` and `mockPushback` response content. In a real session, the
agent would either generate plausible mock responses (as it did here) or call
the actual API at runtime. The protocol layer is fixed; the response layer is
yours.
