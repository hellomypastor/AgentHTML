import { readHtmlFile, info, warn, error, heading, BOLD, RESET, GREEN, YELLOW, RED, DIM } from '../util.js';
import { runAllValidators } from '../validators/index.js';

export function validate(filePath: string): void {
  const html = readHtmlFile(filePath);

  heading(`Validating ${filePath}`);
  console.log('');

  const diagnostics = runAllValidators(html);

  let errors = 0;
  let warnings = 0;

  for (const d of diagnostics) {
    if (d.level === 'error') {
      errors++;
      console.log(`  ${RED}ERROR${RESET} ${DIM}[${d.check}]${RESET} ${d.message}`);
    } else if (d.level === 'warn') {
      warnings++;
      console.log(`  ${YELLOW}WARN ${RESET} ${DIM}[${d.check}]${RESET} ${d.message}`);
    }
  }

  if (diagnostics.length === 0) {
    info('All checks passed');
  }

  console.log('');

  if (errors > 0) {
    error(`${errors} error(s), ${warnings} warning(s)`);
    process.exit(1);
  } else if (warnings > 0) {
    warn(`${warnings} warning(s), 0 errors`);
  } else {
    info('No issues found');
  }

  console.log('');
}
