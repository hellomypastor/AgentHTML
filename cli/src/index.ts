#!/usr/bin/env node

import { init } from './commands/init.js';
import { preview } from './commands/preview.js';
import { validate } from './commands/validate.js';
import { BOLD, RESET, DIM, CYAN, error } from './util.js';

const VERSION = '0.1.0';

const USAGE = `
${BOLD}agenthtml${RESET} ${DIM}v${VERSION}${RESET}

${BOLD}Usage:${RESET}
  agenthtml init                  Install the AgentHTML skill into .agenthtml/
  agenthtml preview <file.html>   Open an artifact in your default browser
  agenthtml validate <file.html>  Check an artifact against AgentHTML conventions

${BOLD}Options:${RESET}
  --help, -h     Show this help message
  --version, -v  Show version number
`;

const args = process.argv.slice(2);
const command = args[0];

if (!command || command === '--help' || command === '-h') {
  console.log(USAGE);
  process.exit(0);
}

if (command === '--version' || command === '-v') {
  console.log(VERSION);
  process.exit(0);
}

switch (command) {
  case 'init':
    init();
    break;

  case 'preview':
    if (!args[1]) {
      error('Missing file argument. Usage: agenthtml preview <file.html>');
      process.exit(1);
    }
    preview(args[1]);
    break;

  case 'validate':
    if (!args[1]) {
      error('Missing file argument. Usage: agenthtml validate <file.html>');
      process.exit(1);
    }
    validate(args[1]);
    break;

  default:
    error(`Unknown command: ${command}`);
    console.log(`Run ${CYAN}agenthtml --help${RESET} for usage.`);
    process.exit(1);
}
