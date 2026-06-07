/**
 * @fileoverview scan 命令 - 扫描项目中的 AI 配置文件
 */

import { Command } from 'commander';
import * as path from 'path';
import { Detector } from '../../core/detector';

export const scanCommand = new Command('scan')
  .description('Scan project directory for AI tool configuration files')
  .argument('[dir]', 'Project directory to scan', '.')
  .option('-j, --json', 'Output as JSON')
  .action((dir: string, options: { json?: boolean }) => {
    const rootDir = path.resolve(dir);
    const detector = new Detector();
    const files = detector.detect(rootDir);

    if (options.json) {
      console.log(JSON.stringify(files, null, 2));
      return;
    }

    if (files.length === 0) {
      console.log('\n  No AI configuration files found in this directory.');
      console.log('  Run `agentsync init` to create an AGENTS.md file.\n');
      return;
    }

    console.log(`\n  Found ${files.length} configuration file(s):\n`);
    for (const file of files) {
      const relPath = path.relative(rootDir, file.filePath);
      console.log(`  ● ${relPath}`);
      console.log(`    Source: ${file.source}`);
      console.log(`    Size: ${file.size} bytes`);
      console.log(`    Modified: ${file.lastModified.toLocaleDateString()}\n`);
    }
  });
