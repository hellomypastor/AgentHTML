# Category: PR Review

Use this reference when the artifact is a code review — annotated diffs with
findings, severity levels, and agent actions to explain, fix, or dispute.

## Structure

A PR review artifact has three zones:

1. **Header** — PR title, branch names, author, date, summary stats (files
   changed, additions, deletions, finding counts by severity).
2. **Findings list** — the core content. Each finding is one item with:
   - Severity bar (left edge, color-coded: red = critical, amber = warning,
     blue = suggestion, gray = nit)
   - File path + line range (monospace, clickable to expand diff context)
   - One-sentence finding title
   - Explanation paragraph (collapsible, open by default for critical/warning)
   - Code snippet showing the problematic lines
   - Agent action buttons (see below)
   - Response slot for agent output
3. **Summary** — overall assessment, blocking vs. non-blocking verdict,
   suggested next steps.

## Agent actions per finding

Each finding gets 2–3 buttons from this set:

| Button label | `data-agent-action` prompt pattern |
|---|---|
| **Explain** | `Explain why this is a problem: [finding title]. The code is: [snippet]. Consider edge cases and downstream effects.` |
| **Suggest fix** | `Suggest a concrete code fix for: [finding title]. Current code: [snippet]. Return the fixed code as an HTML code block.` |
| **Dispute** | `The reviewer flagged: [finding title]. Play devil's advocate — argue why the current code might be correct or why the fix isn't worth it. Be specific.` |
| **Show context** | `Show 20 lines of surrounding context for [file]:[line range] and explain how this code fits into the larger function.` |

Always include **Explain** and **Suggest fix**. Add **Dispute** for
warning-level and above. Add **Show context** when the snippet is < 5 lines
and might lack context.

## Context strategy

Use `data-agent-context` to send the finding's metadata:

```html
<button
  data-agent-action="Suggest a fix for: Unchecked null return from getUser()"
  data-agent-context="findings.f3"
  data-agent-target="#f3-slot">
  Suggest fix
</button>
```

State block should contain each finding keyed by ID:

```json
{
  "pr": { "title": "...", "branch": "...", "baseBranch": "..." },
  "findings": {
    "f1": { "file": "src/auth.ts", "lines": "42-48", "severity": "critical", "code": "..." },
    "f2": { ... }
  }
}
```

## Visual patterns

- Severity bar: 3px solid left border on the finding container. Use the
  preset's accent for the dominant severity; use a fixed palette for the
  others (red `#c0392b`, amber `#d4a017`, blue `#2980b9`, gray `#7f8c8d`).
- Code snippets: `<pre><code>` with the preset's monospace font, subtle
  background tint, line numbers in `::before` pseudo-elements.
- File paths: monospace, slightly smaller than body text, dimmed color.
- Finding count badges in the header: small pills with severity color
  backgrounds and white text.

## Layout

Single-column, findings stacked vertically. No cards-on-cards. Findings
are separated by a 1px hairline in the preset's muted color, not by
card borders or shadows.

Header is sticky on scroll (if the preset supports it) so the user always
sees the PR title and stats.

## Anti-patterns specific to PR reviews

- ❌ Rendering the full diff inline — show only the relevant snippet per
  finding. The full diff belongs in the git tool, not the review.
- ❌ Color-coding the entire finding card by severity — use only the left
  border bar. Full-card coloring is visually noisy with 10+ findings.
- ❌ Generic "Ask AI" buttons — every button must reference the specific
  finding. "Explain" on finding 3 sends finding 3's context, not the
  whole review.
- ❌ Putting all findings at the same visual weight — critical findings
  should be visually expanded (explanation visible) while nits are
  collapsed by default.
