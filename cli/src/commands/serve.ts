import { createServer, IncomingMessage, ServerResponse } from 'node:http';
import { readFileSync, existsSync, watch } from 'node:fs';
import { resolve, extname } from 'node:path';
import { info, warn, error, BOLD, RESET, DIM, CYAN } from '../util.js';

const DEFAULT_PORT = 7331;

const MIME: Record<string, string> = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
};

const LIVE_RELOAD_SCRIPT = `
<script>
(function(){
  const es = new EventSource('/__agenthtml_reload');
  es.onmessage = () => location.reload();
  es.onerror = () => setTimeout(() => location.reload(), 2000);
})();
</script>`;

const LOCAL_ADAPTER_SCRIPT = `
<script>
window.agentHtmlAdapter = async (envelope) => {
  const r = await fetch('/agent', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(envelope)
  });
  if (!r.ok) throw new Error('Agent request failed: ' + r.status);
  const data = await r.json();
  return data.response;
};
</script>`;

export function serve(filePath: string, portArg?: string): void {
  const resolved = resolve(process.cwd(), filePath);
  if (!existsSync(resolved)) {
    error(`File not found: ${filePath}`);
    process.exit(1);
  }
  if (!resolved.endsWith('.html') && !resolved.endsWith('.htm')) {
    error(`Expected an .html file, got: ${filePath}`);
    process.exit(1);
  }

  const port = portArg ? parseInt(portArg, 10) : DEFAULT_PORT;
  if (isNaN(port) || port < 1 || port > 65535) {
    error(`Invalid port: ${portArg}`);
    process.exit(1);
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    warn('ANTHROPIC_API_KEY not set — /agent proxy will return 503');
  }

  const sseClients: ServerResponse[] = [];

  watch(resolved, { persistent: false }, () => {
    sseClients.forEach(res => {
      try { res.write('data: reload\n\n'); } catch {}
    });
  });

  const server = createServer(async (req: IncomingMessage, res: ServerResponse) => {
    const url = req.url || '/';

    if (url === '/__agenthtml_reload') {
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
      });
      res.write('data: connected\n\n');
      sseClients.push(res);
      req.on('close', () => {
        const idx = sseClients.indexOf(res);
        if (idx >= 0) sseClients.splice(idx, 1);
      });
      return;
    }

    if (url === '/agent' && req.method === 'POST') {
      await handleAgent(req, res, apiKey);
      return;
    }

    if (url === '/agent' && req.method === 'OPTIONS') {
      res.writeHead(204, corsHeaders());
      res.end();
      return;
    }

    if (url === '/' || url === '/index.html') {
      serveHtml(resolved, res);
      return;
    }

    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  });

  server.listen(port, () => {
    console.log('');
    console.log(`  ${BOLD}agenthtml serve${RESET} ${DIM}v0.2${RESET}`);
    console.log('');
    console.log(`  ${DIM}Artifact:${RESET}  ${resolved}`);
    console.log(`  ${DIM}Local:${RESET}     ${CYAN}http://localhost:${port}/${RESET}`);
    console.log(`  ${DIM}API proxy:${RESET} ${apiKey ? 'enabled (ANTHROPIC_API_KEY set)' : 'disabled (no ANTHROPIC_API_KEY)'}`);
    console.log(`  ${DIM}Reload:${RESET}    watching for file changes`);
    console.log('');
    info('Server running — press Ctrl+C to stop');
  });
}

function serveHtml(filePath: string, res: ServerResponse): void {
  let html: string;
  try {
    html = readFileSync(filePath, 'utf-8');
  } catch {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Failed to read file');
    return;
  }

  html = injectBeforeClose(html, '</body>', LOCAL_ADAPTER_SCRIPT + LIVE_RELOAD_SCRIPT);

  res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
  res.end(html);
}

function injectBeforeClose(html: string, tag: string, snippet: string): string {
  const idx = html.lastIndexOf(tag);
  if (idx === -1) return html + snippet;
  return html.slice(0, idx) + snippet + html.slice(idx);
}

async function handleAgent(
  req: IncomingMessage,
  res: ServerResponse,
  apiKey: string | undefined
): Promise<void> {
  const headers = corsHeaders();

  if (!apiKey) {
    res.writeHead(503, headers);
    res.end(JSON.stringify({ error: 'ANTHROPIC_API_KEY not configured' }));
    return;
  }

  let body = '';
  for await (const chunk of req) body += chunk;

  let envelope: any;
  try {
    envelope = JSON.parse(body);
  } catch {
    res.writeHead(400, headers);
    res.end(JSON.stringify({ error: 'Invalid JSON' }));
    return;
  }

  const prompt = [
    envelope.action,
    envelope.context && Object.keys(envelope.context).length > 0
      ? `\n\nContext:\n${JSON.stringify(envelope.context, null, 2)}`
      : '',
    `\n\nRespond as ${envelope.render === 'html' ? 'a small HTML fragment' : 'plain text'}, no preamble.`,
  ].join('');

  try {
    const apiRes = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1500,
        messages: [{ role: 'user', content: prompt }],
      }),
    });

    const data = await apiRes.json() as any;
    const text = data.content?.[0]?.text || '';

    res.writeHead(200, headers);
    res.end(JSON.stringify({ response: text }));
  } catch (e: any) {
    res.writeHead(502, headers);
    res.end(JSON.stringify({ error: 'Upstream API error', detail: e.message }));
  }
}

function corsHeaders(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}
