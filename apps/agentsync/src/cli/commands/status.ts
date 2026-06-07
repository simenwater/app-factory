/**
 * @fileoverview status 命令 - 显示项目同步状态
 */

import { Command } from 'commander';
import * as fs from 'fs';
import * as path from 'path';
import { Detector } from '../../core/detector';

export const statusCommand = new Command('status')
  .description('Show sync status of AI configuration files')
  .argument('[dir]', 'Project directory', '.')
  .action((dir: string) => {
    const rootDir = path.resolve(dir);
    const detector = new Detector();
    const files = detector.detect(rootDir);

    const agentsMdPath = path.join(rootDir, 'AGENTS.md');
    const hasAgentsMd = fs.existsSync(agentsMdPath);

    console.log('\n  AgentSync Status');
    console.log('  ═══════════════════════════════════');
    console.log(`  Project: ${path.basename(rootDir)}`);
    console.log(`  AGENTS.md: ${hasAgentsMd ? '✓ Present' : '✗ Not found'}`);
    console.log(`  Config files: ${files.length} detected`);

    if (files.length > 0) {
      console.log('\n  Detected Sources:');
      for (const file of files) {
        const relPath = path.relative(rootDir, file.filePath);
        const isNewer = hasAgentsMd &&
          file.lastModified > fs.statSync(agentsMdPath).mtime;
        const status = isNewer ? ' (newer than AGENTS.md)' : '';
        console.log(`    ● ${relPath}${status}`);
      }
    }

    if (hasAgentsMd && files.length > 0) {
      const agentsMdStat = fs.statSync(agentsMdPath);
      const newerFiles = files.filter(f => f.lastModified > agentsMdStat.mtime);
      if (newerFiles.length > 0) {
        console.log(`\n  ⚠ ${newerFiles.length} source file(s) are newer than AGENTS.md`);
        console.log('  Run `agentsync merge` to update.\n');
      } else {
        console.log('\n  ✓ AGENTS.md is up to date.\n');
      }
    } else if (!hasAgentsMd && files.length > 0) {
      console.log('\n  → Run `agentsync merge` to create AGENTS.md from existing configs.\n');
    } else if (!hasAgentsMd) {
      console.log('\n  → Run `agentsync init` to create a new AGENTS.md.\n');
    }
  });
