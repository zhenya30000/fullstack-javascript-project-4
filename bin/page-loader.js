#!/usr/bin/env node

import { Command } from 'commander';
import { cwd } from 'process';
import pageLoader from '../src/index.js';

const program = new Command();

program
  .name('page-loader')
  .description('Downloads a page from web')
  .version('0.0.1')
  .arguments('<url>')
  .option('-o, --output [dir]', 'output dir',cwd())
  .action((url, filePath) => {
    pageLoader(url, filePath);
  });

program.parse();
