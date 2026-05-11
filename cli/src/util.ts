import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';

export const RESET = '\x1b[0m';
export const BOLD = '\x1b[1m';
export const DIM = '\x1b[2m';
export const RED = '\x1b[31m';
export const GREEN = '\x1b[32m';
export const YELLOW = '\x1b[33m';
export const CYAN = '\x1b[36m';

export function resolveFile(filePath: string): string {
  const resolved = resolve(process.cwd(), filePath);
  if (!existsSync(resolved)) {
    error(`File not found: ${filePath}`);
    process.exit(1);
  }
  return resolved;
}

export function readHtmlFile(filePath: string): string {
  const resolved = resolveFile(filePath);
  if (!resolved.endsWith('.html') && !resolved.endsWith('.htm')) {
    error(`Expected an .html file, got: ${filePath}`);
    process.exit(1);
  }
  return readFileSync(resolved, 'utf-8');
}

export function info(msg: string): void {
  console.log(`${GREEN}✓${RESET} ${msg}`);
}

export function warn(msg: string): void {
  console.log(`${YELLOW}⚠${RESET} ${msg}`);
}

export function error(msg: string): void {
  console.error(`${RED}✗${RESET} ${msg}`);
}

export function heading(msg: string): void {
  console.log(`\n${BOLD}${msg}${RESET}`);
}

export function stripScriptBodies(html: string): string {
  return html.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, (m) => {
    const openTag = m.match(/^<script[^>]*>/i)?.[0] ?? '';
    return openTag + '</script>';
  });
}

