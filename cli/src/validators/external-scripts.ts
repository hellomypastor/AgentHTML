import { Diagnostic } from './index.js';

export function checkExternalScripts(html: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];
  const scriptSrcRe = /<script[^>]+src\s*=\s*["']([^"']+)["']/gi;

  let match;
  while ((match = scriptSrcRe.exec(html)) !== null) {
    const src = match[1];
    diagnostics.push({
      level: 'warn',
      check: 'external-script',
      message: `External script dependency: ${src} — artifacts should be self-contained with all JS inlined`,
    });
  }

  return diagnostics;
}
