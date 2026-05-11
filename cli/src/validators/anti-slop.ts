import { Diagnostic } from './index.js';
import { stripScriptBodies } from '../util.js';

export function checkAntiSlop(rawHtml: string): Diagnostic[] {
  const html = stripScriptBodies(rawHtml);
  const diagnostics: Diagnostic[] = [];

  // Indigo/purple gradients
  if (/linear-gradient[^;]*(?:#[46]3[56][69]f[1e]|#818cf8|#a5b4fc|#6366f1|#4f46e5)/i.test(html)) {
    diagnostics.push({
      level: 'warn',
      check: 'anti-slop:gradient',
      message: 'Detected indigo/purple gradient — the most common AI-output visual signature',
    });
  }

  // Emoji in headings
  const emojiHeadingRe = /<h[1-6][^>]*>[^<]*[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1FA00}-\u{1FA9F}]/u;
  if (emojiHeadingRe.test(html)) {
    diagnostics.push({
      level: 'warn',
      check: 'anti-slop:emoji-heading',
      message: 'Emoji used in heading — use typographic markers instead (small caps, §, ◆, numbered sections)',
    });
  }

  // Glassmorphism
  if (/backdrop-filter\s*:\s*blur/i.test(html) && /rgba\s*\([^)]*,\s*0\.[1-6]\)/i.test(html)) {
    diagnostics.push({
      level: 'warn',
      check: 'anti-slop:glassmorphism',
      message: 'Glassmorphism detected (backdrop-filter: blur + semi-transparent background) — AI-default for 2+ years',
    });
  }

  // Pure white background on body
  if (/body\s*\{[^}]*background\s*:\s*(?:#fff(?:fff)?|white)\s*[;}]/i.test(html)) {
    diagnostics.push({
      level: 'warn',
      check: 'anti-slop:white-bg',
      message: 'Pure white (#FFF) background on body — use off-white, cream, or dark instead',
    });
  }

  // Large border-radius on cards/panels (>4px, excluding pills with 999px)
  const bigRadiusRe = /border-radius\s*:\s*(\d+)px/gi;
  let m;
  while ((m = bigRadiusRe.exec(html)) !== null) {
    const val = parseInt(m[1], 10);
    if (val > 4 && val < 900) {
      diagnostics.push({
        level: 'warn',
        check: 'anti-slop:rounded-corners',
        message: `border-radius: ${val}px — default to square corners (0px) or soft rounding (2-4px)`,
      });
      break;
    }
  }

  // Material-style box shadows
  if (/box-shadow\s*:\s*0\s+[48]px\s+\d+px\s+rgba/i.test(html)) {
    diagnostics.push({
      level: 'warn',
      check: 'anti-slop:material-shadow',
      message: 'Mid-range "Material card" box-shadow detected — use tight (1-2px) or dramatic shadows instead',
    });
  }

  return diagnostics;
}
