import { execSync } from 'node:child_process';
import { resolve } from 'node:path';
import { resolveFile, info, error } from '../util.js';

export function preview(filePath: string): void {
  const resolved = resolveFile(filePath);

  if (!resolved.endsWith('.html') && !resolved.endsWith('.htm')) {
    error(`Expected an .html file, got: ${filePath}`);
    process.exit(1);
  }

  const platform = process.platform;
  try {
    if (platform === 'darwin') {
      execSync(`open "${resolved}"`);
    } else if (platform === 'win32') {
      execSync(`start "" "${resolved}"`);
    } else {
      execSync(`xdg-open "${resolved}"`);
    }
    info(`Opened ${filePath} in default browser`);
  } catch {
    error(`Failed to open browser. Try opening manually: ${resolved}`);
    process.exit(1);
  }
}
