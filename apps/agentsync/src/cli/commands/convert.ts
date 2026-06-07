/**
 * @fileoverview convert 命令 - 转换配置文件为 AGENTS.md
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { Converter } from '../../core/converter';
import { AgentsFormatter } from '../../formatters/agents-formatter';
import { findParser } from '../../parsers';

export const convertCommand = new Command('convert')
  .description('Convert an AI config file to AGENTS.md format')
  .argument('<file>', 'Source configuration file to convert')
  .option('-o, --output <path>', 'Output file path', 'AGENTS.md')
  .option('--dry-run', 'Preview output without writing file')
  .option('--stdout', 'Output to stdout instead of file')
  .action((file: string, options: { output: string; dryRun?: boolean; stdout?: boolean }) => {
    const filePath = path.resolve(file);

    if (!fs.existsSync(filePath)) {
      console.error(`  Error: File not found: ${filePath}`);
      process.exit(1);
    }

    const parser = findParser(filePath);
    if (!parser) {
      console.error(`  Error: No parser found for file: ${file}`);
      console.error('  Supported formats: CLAUDE.md, .cursorrules, .github/copilot-instructions.md, .windsurfrules');
      process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf-8');
    const parsed = parser.parse(content, filePath);

    const converter = new Converter();
    const agentsConfig = converter.convert(parsed);

    const formatter = new AgentsFormatter();
    const output = formatter.format(agentsConfig);

    if (options.stdout || options.dryRun) {
      console.log(output);
      if (options.dryRun) {
        console.log('\n  [dry-run] No file was written.');
      }
      return;
    }

    const outputPath = path.resolve(options.output);
    fs.writeFileSync(outputPath, output, 'utf-8');
    console.log(`\n  ✓ Converted ${file} → ${options.output}`);
    console.log(`  Directives: ${parsed.directives.length}`);
    console.log(`  Tech stack: ${agentsConfig.techStack.join(', ') || 'None detected'}\n`);
  });
