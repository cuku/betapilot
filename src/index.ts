#!/usr/bin/env node

import { runCLI } from './cli/index.js';

async function main() {
  try {
    const args = process.argv.slice(2);
    await runCLI(args);
  } catch (error) {
    console.error('Fatal error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main();
