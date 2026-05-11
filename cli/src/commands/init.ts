import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { join, resolve } from 'node:path';
import { SKILL_FILES } from '../generated/skill-files.js';
import { info, warn, heading, BOLD, RESET, DIM } from '../util.js';

export function init(): void {
  const targetDir = resolve(process.cwd(), '.agenthtml');
  const isUpdate = existsSync(targetDir);

  heading('AgentHTML init');

  mkdirSync(join(targetDir, 'references'), { recursive: true });

  let count = 0;
  for (const [relativePath, content] of Object.entries(SKILL_FILES)) {
    const dest = join(targetDir, relativePath);
    writeFileSync(dest, content, 'utf-8');
    count++;
    info(`${isUpdate ? 'updated' : 'wrote'} .agenthtml/${relativePath}`);
  }

  console.log('');
  if (isUpdate) {
    info(`Updated ${count} files in .agenthtml/`);
  } else {
    info(`Installed AgentHTML skill (${count} files) to .agenthtml/`);
  }

  console.log(`\n${DIM}Your agent can now read the skill from .agenthtml/SKILL.md${RESET}`);
  console.log(`${DIM}Try: "Use AgentHTML to write a status report as an interactive HTML artifact."${RESET}\n`);
}
