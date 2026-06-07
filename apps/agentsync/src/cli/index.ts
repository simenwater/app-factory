#!/usr/bin/env node
/**
 * @fileoverview AgentSync CLI 入口
 * @description 命令行工具主入口，注册所有子命令
 */

import { Command } from 'commander';
import { scanCommand } from './commands/scan';
import { convertCommand } from './commands/convert';
import { mergeCommand } from './commands/merge';
import { initCommand } from './commands/init';
import { statusCommand } from './commands/status';

const program = new Command();

program
  .name('agentsync')
  .description('Standardize AI agent configuration files across tools')
  .version('1.0.0');

program.addCommand(scanCommand);
program.addCommand(convertCommand);
program.addCommand(mergeCommand);
program.addCommand(initCommand);
program.addCommand(statusCommand);

program.parse(process.argv);
