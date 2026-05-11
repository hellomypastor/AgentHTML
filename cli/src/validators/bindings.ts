import { Diagnostic } from './index.js';
import { stripScriptBodies } from '../util.js';

export function checkBindings(rawHtml: string): Diagnostic[] {
  const html = stripScriptBodies(rawHtml);
  const diagnostics: Diagnostic[] = [];

  // Check data-agent-target selectors resolve to elements in the document
  const targetRe = /data-agent-target\s*=\s*["']([^"']+)["']/gi;
  let match;
  while ((match = targetRe.exec(html)) !== null) {
    const target = match[1];
    if (target === 'inline' || target === 'replace') continue;

    if (target.startsWith('#')) {
      const id = target.slice(1);
      const idExists = new RegExp(`id\\s*=\\s*["']${escapeRegex(id)}["']`).test(html);
      if (!idExists) {
        diagnostics.push({
          level: 'error',
          check: 'binding-target',
          message: `data-agent-target="${target}" references an element that doesn't exist in the document`,
        });
      }
    }
  }

  // Check data-agent-action is not empty
  const actionRe = /data-agent-action\s*=\s*["']([^"']*)["']/gi;
  while ((match = actionRe.exec(html)) !== null) {
    if (match[1].trim() === '') {
      diagnostics.push({
        level: 'error',
        check: 'empty-action',
        message: 'data-agent-action is empty — every action button needs a specific prompt',
      });
    }
  }

  return diagnostics;
}

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
