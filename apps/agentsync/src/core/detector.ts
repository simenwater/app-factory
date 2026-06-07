/**
 * @fileoverview 配置文件自动检测器
 * @description 扫描项目目录，自动发现所有 AI 工具配置文件
 */

import * as fs from 'fs';
import * as path from 'path';
import { ConfigSource, ParsedConfig } from './types';
import { findParser, getAllParsers } from '../parsers';

/** 检测到的配置文件信息 */
export interface DetectedFile {
  /** 文件路径 */
  filePath: string;
  /** 配置来源类型 */
  source: ConfigSource;
  /** 文件大小 (字节) */
  size: number;
  /** 最后修改时间 */
  lastModified: Date;
}

export class Detector {
  /**
   * 扫描目录，查找所有 AI 工具配置文件
   * @param rootDir - 项目根目录路径
   * @returns 检测到的配置文件列表
   */
  detect(rootDir: string): DetectedFile[] {
    const detected: DetectedFile[] = [];
    const candidates = this.getCandidatePaths(rootDir);

    for (const filePath of candidates) {
      if (fs.existsSync(filePath)) {
        const stat = fs.statSync(filePath);
        const parser = findParser(filePath);
        if (parser) {
          detected.push({
            filePath,
            source: parser.source,
            size: stat.size,
            lastModified: stat.mtime,
          });
        }
      }
    }

    return detected;
  }

  /**
   * 扫描并解析所有检测到的配置文件
   * @param rootDir - 项目根目录路径
   * @returns 解析后的配置对象数组
   */
  detectAndParse(rootDir: string): ParsedConfig[] {
    const files = this.detect(rootDir);
    const configs: ParsedConfig[] = [];

    for (const file of files) {
      const parser = findParser(file.filePath);
      if (parser) {
        const content = fs.readFileSync(file.filePath, 'utf-8');
        configs.push(parser.parse(content, file.filePath));
      }
    }

    return configs;
  }

  /**
   * 获取所有需要检查的候选文件路径
   * @param rootDir - 项目根目录
   * @returns 候选文件路径数组
   */
  private getCandidatePaths(rootDir: string): string[] {
    const paths: string[] = [
      path.join(rootDir, 'CLAUDE.md'),
      path.join(rootDir, '.cursorrules'),
      path.join(rootDir, '.github', 'copilot-instructions.md'),
      path.join(rootDir, '.windsurfrules'),
      path.join(rootDir, 'AGENTS.md'),
    ];

    const srcDir = path.join(rootDir, 'src');
    if (fs.existsSync(srcDir)) {
      paths.push(path.join(srcDir, 'CLAUDE.md'));
    }

    return paths;
  }
}
