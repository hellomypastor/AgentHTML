import { checkExternalScripts } from './external-scripts.js';
import { checkStateBlock } from './state-block.js';
import { checkBindings } from './bindings.js';
import { checkAntiSlop } from './anti-slop.js';
import { checkAsciiArt } from './ascii-art.js';

export interface Diagnostic {
  level: 'error' | 'warn' | 'pass';
  check: string;
  message: string;
}

export function runAllValidators(html: string): Diagnostic[] {
  const diagnostics: Diagnostic[] = [];

  diagnostics.push(...checkExternalScripts(html));
  diagnostics.push(...checkStateBlock(html));
  diagnostics.push(...checkBindings(html));
  diagnostics.push(...checkAntiSlop(html));
  diagnostics.push(...checkAsciiArt(html));

  return diagnostics;
}
