# Agent Protocol

Read this file when an HTML artifact will include buttons, inputs, or annotations
that should call an agent back and patch the page in place.

The protocol is intentionally small. Five HTML attributes plus one global script.
The whole runtime fits in ~2KB and inlines directly into the artifact. No build
step, no external dependencies, no module imports.

## Contents

- Design goals
- The five attributes (`data-agent-action`, `data-agent-target`, `data-agent-context`, `data-agent-bind`, `data-agent-render`)
- State serialization (`<script type="application/json" id="agenthtml-state">`)
- The prompt envelope sent to agents
- Patch format (advanced, for multi-region updates)
- The runtime — full inlined script
- Adapters (mock, direct API, local server)
- What the protocol does NOT do

## Design goals

- **No build, no install.** The artifact is one `.html` file that works when opened
  from `file://`.
- **Degrades gracefully.** If the runtime fails to load or no agent is reachable, the
  artifact still reads as a complete static document. Agent calls are an enhancement,
  never a load-bearing requirement.
- **Same protocol regardless of who runs the agent.** The same artifact can be
  consumed by Claude Code, Codex, a hosted runtime, or a mock — the artifact does
  not encode the choice.
- **Spatial, not chat-y.** Agent responses appear next to the trigger that produced
  them, not as a stream at the bottom of the page.

## The five attributes

These go on any element. The runtime intercepts clicks (and `change` events for
inputs) and dispatches to the configured agent.

### `data-agent-action`

The prompt to send. This is the only required attribute.

```html
<button data-agent-action="Explain why backpressure matters in this hook">
  Explain why this matters
</button>
```

The text inside the element is the user-facing label; `data-agent-action` is what
gets sent. They can differ. The label says *what the user gets*; the action says
*what the agent does*. Phrase the action as a complete instruction — the agent has
no surrounding context unless you provide it (see `data-agent-context`).

### `data-agent-target`

Where to render the response. Either a CSS selector (`#fix-slot`, `.finding-3 .slot`)
or one of two keywords:

- `inline` — render in a sibling element directly after the trigger
- `replace` — replace the trigger's parent element with the response

Default: `inline`.

```html
<button
  data-agent-action="Suggest a fix for this finding"
  data-agent-target="#finding-1-slot">
  Suggest a fix
</button>
<div id="finding-1-slot"></div>
```

### `data-agent-context`

A JSON pointer (or comma-separated list) into the artifact's state object, telling
the runtime what to send along with the prompt. Without this, the agent only sees
the prompt, not the artifact's content.

```html
<button
  data-agent-action="Draft three alternatives to this approach"
  data-agent-context="options.current,constraints">
  Suggest alternatives
</button>
```

Special value `data-agent-context="page"` sends a serialized snapshot of the visible
page text (cheap option when state isn't structured). Use sparingly — it's
token-expensive.

### `data-agent-bind`

For inputs: bind the input's value to a key in the artifact's state. The runtime
keeps state in sync as the user types/toggles. State is then available via
`data-agent-context` from any button on the page.

```html
<select data-agent-bind="filter.region">
  <option>US</option>
  <option>EU</option>
  <option>APAC</option>
</select>

<button
  data-agent-action="Recompute the table for the selected region"
  data-agent-context="filter,table.rows"
  data-agent-target="#table-body">
  Apply filter
</button>
```

### `data-agent-render`

Tells the runtime how to render the agent's response. One of:

- `html` (default) — response is HTML; insert directly
- `text` — response is plain text; wrap in `<p>` and escape
- `patch` — response is a JSON object describing DOM patches (advanced; see
  "Patch format" below)
- `replace-state` — response is a JSON object that replaces the current state at
  the path given by `data-agent-target` (used for "tweak this parameter and
  recompute" patterns)

## State serialization

Every agent-aware artifact has exactly one state block, near the top of `<body>`:

```html
<script type="application/json" id="agenthtml-state">
{
  "filter": { "region": "US" },
  "options": {
    "current": { "id": "B", "label": "Async iterator" },
    "all": [ /* ... */ ]
  },
  "constraints": [ "no breaking changes", "ship by Friday" ]
}
</script>
```

The runtime reads this on load, exposes it as `window.agentHtml.state`, and updates
it as bindings change. When a button uses `data-agent-context="filter.region"`, the
runtime resolves that path against `window.agentHtml.state` and includes the value
in the prompt envelope sent to the agent.

If the artifact has no meaningful state (e.g. a static-ish PR review where each
finding is independent), the state block can be omitted. Buttons without
`data-agent-context` just send the bare prompt.

## The prompt envelope

The runtime sends one structured object to the agent:

```json
{
  "action": "Suggest a fix for this finding",
  "context": {
    "options.current": { "id": "B", "label": "Async iterator" },
    "constraints": [ "no breaking changes", "ship by Friday" ]
  },
  "render": "html",
  "artifact_id": "pr-247-review",
  "version": "agenthtml/0.1"
}
```

The agent's job is to return the response in the format requested by `render`. The
runtime handles insertion.

## Patch format (advanced)

When `data-agent-render="patch"`, the agent returns:

```json
{
  "ops": [
    { "op": "replace", "selector": "#finding-3 .severity-bar", "class": "severity-bar gold" },
    { "op": "append",  "selector": "#finding-3 .agent-slot", "html": "<div>...</div>" },
    { "op": "set",     "path": "options.current", "value": { "id": "C" } }
  ]
}
```

Three op types: `replace` (swap an element's classes/attrs/innerHTML), `append`
(insert HTML into a target), `set` (mutate state at a JSON path; bound inputs
re-sync automatically).

Patch format is for cases where a single button changes multiple regions of the
page. For single-region changes, the simpler `html` render is enough.

## The runtime

Inline this `<script>` just before `</body>`. It's the entire client-side runtime:

```html
<script>
(() => {
  const ADAPTER = window.agentHtmlAdapter || mockAdapter();
  const state = readState();
  window.agentHtml = { state, dispatch };

  function readState() {
    const el = document.getElementById('agenthtml-state');
    if (!el) return {};
    try { return JSON.parse(el.textContent); } catch { return {}; }
  }

  function getPath(obj, path) {
    return path.split('.').reduce((o, k) => o?.[k], obj);
  }

  function setPath(obj, path, value) {
    const keys = path.split('.');
    const last = keys.pop();
    const target = keys.reduce((o, k) => (o[k] ??= {}), obj);
    target[last] = value;
  }

  function buildContext(spec) {
    if (!spec) return {};
    if (spec === 'page') return { page: document.body.innerText.slice(0, 8000) };
    const ctx = {};
    spec.split(',').map(s => s.trim()).forEach(p => { ctx[p] = getPath(state, p); });
    return ctx;
  }

  async function dispatch(el) {
    const action = el.dataset.agentAction;
    if (!action) return;
    const targetSpec = el.dataset.agentTarget || 'inline';
    const target = resolveTarget(el, targetSpec);
    const ctx = buildContext(el.dataset.agentContext);
    const render = el.dataset.agentRender || 'html';

    const orig = el.innerHTML;
    el.setAttribute('aria-busy', 'true');
    el.innerHTML = '<span class="ah-loading">…</span>';

    try {
      const response = await ADAPTER({
        action, context: ctx, render,
        artifact_id: document.documentElement.dataset.artifactId,
        version: 'agenthtml/0.1'
      });
      applyResponse(target, response, render);
    } catch (e) {
      console.error('[agenthtml]', e);
      target.insertAdjacentHTML('beforeend',
        `<div class="ah-error">Agent unreachable. Original content unaffected.</div>`);
    } finally {
      el.removeAttribute('aria-busy');
      el.innerHTML = orig;
    }
  }

  function resolveTarget(el, spec) {
    if (spec === 'inline') {
      const slot = document.createElement('div');
      el.insertAdjacentElement('afterend', slot);
      return slot;
    }
    if (spec === 'replace') return el.parentElement;
    return document.querySelector(spec);
  }

  function applyResponse(target, response, render) {
    if (render === 'text') {
      const p = document.createElement('p');
      p.textContent = typeof response === 'string' ? response : response.text || '';
      target.appendChild(p);
    } else if (render === 'patch') {
      (response.ops || []).forEach(op => applyPatch(op));
    } else if (render === 'replace-state') {
      Object.assign(state, response);
      syncBindings();
    } else {
      const html = typeof response === 'string' ? response : response.html || '';
      target.insertAdjacentHTML('beforeend', html);
    }
  }

  function applyPatch(op) {
    if (op.op === 'set') return setPath(state, op.path, op.value);
    const el = document.querySelector(op.selector);
    if (!el) return;
    if (op.op === 'append') el.insertAdjacentHTML('beforeend', op.html);
    if (op.op === 'replace') {
      if (op.class) el.className = op.class;
      if (op.html != null) el.innerHTML = op.html;
      if (op.attrs) Object.entries(op.attrs).forEach(([k, v]) => el.setAttribute(k, v));
    }
  }

  function syncBindings() {
    document.querySelectorAll('[data-agent-bind]').forEach(input => {
      const v = getPath(state, input.dataset.agentBind);
      if (v != null && input.value !== v) input.value = v;
    });
  }

  document.addEventListener('click', e => {
    const el = e.target.closest('[data-agent-action]');
    if (el) { e.preventDefault(); dispatch(el); }
  });

  document.addEventListener('change', e => {
    const el = e.target.closest('[data-agent-bind]');
    if (el) setPath(state, el.dataset.agentBind, el.value);
  });

  function mockAdapter() {
    return async () => '<div class="ah-mock">Mock mode — no agent connected.</div>';
  }
})();
</script>
```

## Adapters

The runtime calls `window.agentHtmlAdapter(envelope)` and expects a response. The
adapter is what connects the artifact to a real agent. Three reference adapters:

### Mock adapter (default, no setup)

If no adapter is registered, the runtime returns a placeholder. The artifact still
works as a static document.

### Direct API adapter

The artifact author provides a script that calls the Anthropic API directly with
the user's key (entered via a small dialog and stored in `localStorage`):

```html
<script>
window.agentHtmlAdapter = async (envelope) => {
  const key = localStorage.getItem('anthropic_key') || prompt('Anthropic API key:');
  localStorage.setItem('anthropic_key', key);
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': key,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [{
        role: 'user',
        content: `${envelope.action}\n\nContext:\n${JSON.stringify(envelope.context)}\n\nRespond as ${envelope.render === 'html' ? 'a small HTML fragment' : 'plain text'}, no preamble.`
      }]
    })
  }).then(r => r.json());
  return r.content?.[0]?.text || '';
};
</script>
```

Use this for self-hosted demo artifacts. Document loudly that the key is in
`localStorage` and only the user sees it.

### Local-server adapter (for Claude Code-driven artifacts)

The artifact opens `http://localhost:7331/agent` (a small server the user runs
locally). The server forwards to Claude Code or any other agent. This is the
preferred path when the user is working inside an agent CLI.

```html
<script>
window.agentHtmlAdapter = async (envelope) => {
  const r = await fetch('http://localhost:7331/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(envelope)
  }).then(r => r.json());
  return r.response;
};
</script>
```

The server side of this is out of scope for the skill — it's what the
companion CLI (`agenthtml serve`) provides. The artifact only needs to know the
endpoint.

## When to use which adapter

- **Mock** — for demos in README / GitHub Pages where the static content is enough
  to convey the idea
- **Direct API** — for shareable single-file artifacts where readers can BYO key
- **Local server** — for the Claude Code workflow (artifact lives next to the
  codebase, agent has full repo context)

## What this protocol does NOT do

- **Streaming.** Responses arrive whole. If you need streaming, write your own
  adapter — the runtime is small enough to fork.
- **Multi-turn chat inside the artifact.** Each button is a one-shot. For
  conversation, the user goes back to their agent.
- **Auth beyond `localStorage`.** No OAuth flows, no session management. The local
  server adapter punts auth to the user's terminal.
- **Cross-artifact state.** State is per-artifact. Two artifacts open in two tabs
  do not share state.

These are intentional. The runtime stays tiny, the artifact stays portable, and
the complex stuff lives in optional companion tools.
