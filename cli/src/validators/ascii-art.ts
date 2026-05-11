import { Diagnostic } from './index.js';
import { stripScriptBodies } from '../util.js';

export function checkAsciiArt(rawHtml: string): Diagnostic[] {
  const html = stripScriptBodies(rawHtml);
  const diagnostics: Diagnostic[] = [];

  const cleaned = html
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');

  const boxDrawingRe = /[─│┌┐└┘├┤┬┴┼╌╎╔╗╚╝╠╣╦╩╬═║]{4,}/;
  if (boxDrawingRe.test(cleaned)) {
    diagnostics.push({
      level: 'warn',
      check: 'anti-slop:ascii-art',
      message: 'ASCII box-drawing characters detected in visible content — use CSS-drawn boxes, flexbox/grid layouts instead. This is HTML, not a terminal.',
    });
  }

  return diagnostics;
}
