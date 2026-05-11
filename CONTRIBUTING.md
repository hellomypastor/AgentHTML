# Contributing

AgentHTML is v0.1. The fastest path to v0.2 is **real-world failure cases**, not feature ideas.

## What helps most right now

1. **Try the skill on a real task.** Use it in Claude Code (or Codex / Cursor) to produce an artifact. If the output is good, that's data. If it's bad — wrong preset, ugly visuals, missing interactivity, AI-slop signatures the skill should have prevented — open an issue with:
   - The prompt you used
   - The artifact (paste the `.html` or attach it)
   - What you expected vs what you got

2. **Style preset PRs.** The five presets in [`skills/agenthtml/references/style-presets.md`](skills/agenthtml/references/style-presets.md) are designed as distinct visual languages, not flavors of the same one. New preset proposals are welcome if they're genuinely a sixth voice — not "Editorial Dark but blue." Open an issue first so we can discuss the niche.

3. **Category reference PRs.** Category references (e.g. `category-pr-review.md`, `category-status-report.md`) are the layer where the skill gets specific. None exist yet in v0.1. If you want to write one:
   - Pick a category from the table in `SKILL.md`
   - Write the reference in the same shape as `agent-protocol.md` (short prose + concrete examples + anti-patterns)
   - Include 1-2 example artifacts that exercise the pattern
   - Open an issue first to coordinate

4. **Example artifacts.** Every example is a chance to show what the skill can do. PRs adding examples to `examples/` are welcome if they:
   - Use the agent-protocol correctly (no custom event hacks)
   - Pick one of the five presets without inventing a new visual language
   - Include a `prompt.md` showing what the user asked for
   - Work standalone in `file://` (no server, no build)

## What's harder to land

- **Renaming the protocol attributes.** `data-agent-*` is the public surface. Changes here ripple through every example, every adapter, every downstream tool. Open an issue with a strong motivation before drafting.
- **Adding new attributes.** The protocol is intentionally small (five attributes). New attributes need to justify themselves against "could this be a convention in `data-agent-action` instead?"
- **CLI features.** The CLI is `init / preview / validate` in v0.1, with `serve` planned for v0.2. New CLI commands need a use case from real usage, not "would be nice."
- **Hosted services.** AgentHTML is not a SaaS. Sharing, gallery, cloud sync — these are downstream projects, not AgentHTML itself.

## Code style

- Skill files (`SKILL.md`, `references/*.md`): plain markdown, no tables of contents under 300 lines, no emoji as section markers, US English.
- HTML examples: single file, inline CSS and JS, no build step, no module imports, no external scripts beyond Google Fonts. The runtime should be inlined.
- CLI (`cli/`, coming v0.2): TypeScript, Node 20+, no heavy frameworks, no telemetry.

## Filing good issues

Good issue titles:
- "Skill picks Soft Document for a code review (should be Editorial Dark)"
- "Protocol: `data-agent-target=replace` removes the runtime script element"
- "Style preset: Brutalist Print's margin notes overflow on narrow viewports"

Bad issue titles:
- "Add support for X" (without "I tried, here's what broke")
- "Doesn't work" (with no artifact or prompt attached)
- "Suggestion: ..." (file as a discussion instead until you've used it)

## A note on AI-generated contributions

We're not going to gatekeep on AI assistance — most of this project was drafted with one. But:

- Don't paste raw LLM output into issues without trying the artifact yourself first
- PRs should be ones *you* understand and can defend in review
- Skill changes especially: if you can't explain why a wording change makes the skill trigger better, don't make the change

## Maintainer notes

Issues triaged weekly. PRs touching `SKILL.md` or the protocol get a longer review (these are the public surface). Style preset and example PRs ship faster.
