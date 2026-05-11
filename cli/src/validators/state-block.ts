import { Diagnostic } from './index.js';

export function checkStateBlock(html: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  const hasAgentAction = /data-agent-action\s*=/.test(html);
  const hasAgentContext = /data-agent-context\s*=/.test(html);
  const hasStateBlock = /id\s*=\s*["']agenthtml-state["']/.test(html);

  if (hasAgentAction && hasAgentContext && !hasStateBlock) {
    diagnostics.push({
      level: 'warn',
      check: 'state-block',
      message: 'Agent-aware artifact uses data-agent-context but has no <script id="agenthtml-state"> block',
    });
  }

  return diagnostics;
}
