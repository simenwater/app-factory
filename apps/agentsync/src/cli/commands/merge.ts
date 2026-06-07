/**
 * @fileoverview merge 命令 - 合并多个配置文件
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { Detector } from '../../core/detector';
import { Merger } from '../../core/merger';
import { AgentsFormatter } from '../../formatters/agents-formatter';
import { ConflictType } from '../../core/types';

export const mergeCommand = new Command('merge')
  .description('Merge all detected AI config files into a single AGENTS.md')
  .argument('[dir]', 'Project directory', '.')
  .option('-o, --output <path>', 'Output file path', 'AGENTS.md')
  .option('--dry-run', 'Preview without writing')
  .option('--show-conflicts', 'Display detected conflicts')
  .action((dir: string, options: { output: string; dryRun?: boolean; showConflicts?: boolean }) => {
    const rootDir = path.resolve(dir);
    const detector = new Detector();
    const configs = detector.detectAndParse(rootDir);

    if (configs.length === 0) {
      console.log('\n  No AI configuration files found to merge.');
      console.log('  Run `agentsync scan` to check available files.\n');
      return;
    }

    const merger = new Merger();
    const result = merger.merge(configs);

    console.log(`\n  Merge Summary:`);
    console.log(`  ─────────────────────────────────`);
    console.log(`  Sources:      ${result.stats.sourceCount}`);
    console.log(`  Directives:   ${result.stats.totalDirectives} → ${result.stats.mergedDirectives} (after dedup)`);
    console.log(`  Duplicates:   ${result.stats.deduplicatedCount} removed`);
    console.log(`  Conflicts:    ${result.stats.conflictCount}`);

    if (options.showConflicts && result.conflicts.length > 0) {
      console.log(`\n  Conflicts:`);
      console.log(`  ─────────────────────────────────`);
      for (const conflict of result.conflicts) {
        const icon = conflict.type === ConflictType.CONTRADICTING ? '⚠' :
                     conflict.type === ConflictType.DUPLICATE ? '≡' : '∩';
        console.log(`  ${icon} [${conflict.type}] ${conflict.description}`);
      }
    }

    const formatter = new AgentsFormatter();
    const output = formatter.format(result.config);

    if (options.dryRun) {
      console.log(`\n${output}`);
      console.log('  [dry-run] No file was written.\n');
      return;
    }

    const outputPath = path.resolve(dir, options.output);
    fs.writeFileSync(outputPath, output, 'utf-8');
    console.log(`\n  ✓ Merged ${configs.length} files → ${options.output}\n`);
  });
