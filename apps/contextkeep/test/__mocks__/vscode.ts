/**
 * @module vscode-mock
 * @description VS Code API 模拟，用于单元测试。
 */

export const workspace = {
  getConfiguration: () => ({
    get: (key: string) => {
      const defaults: Record<string, unknown> = {
        autoIndex: true,
        maxFileSize: 102400,
        excludePatterns: ['**/node_modules/**'],
        indexLanguages: ['typescript', 'javascript'],
        maxMemoryItems: 5000,
        topKResults: 10,
      };
      return defaults[key];
    },
  }),
  workspaceFolders: [
    {
      uri: { fsPath: '/mock/workspace' },
    },
  ],
  findFiles: async () => [],
  fs: {
    readFile: async () => Buffer.from(''),
    writeFile: async () => {},
    stat: async () => ({ size: 100 }),
    createDirectory: async () => {},
  },
  createFileSystemWatcher: () => ({
    onDidChange: () => ({ dispose: () => {} }),
    onDidCreate: () => ({ dispose: () => {} }),
    onDidDelete: () => ({ dispose: () => {} }),
    dispose: () => {},
  }),
  onDidChangeConfiguration: () => ({ dispose: () => {} }),
};

export const window = {
  showInformationMessage: async () => undefined,
  showWarningMessage: async () => undefined,
  showErrorMessage: async () => undefined,
  showInputBox: async () => undefined,
  showQuickPick: async () => undefined,
  createStatusBarItem: () => ({
    show: () => {},
    hide: () => {},
    dispose: () => {},
    text: '',
    tooltip: '',
    command: '',
  }),
  withProgress: async (_opts: unknown, task: (p: unknown, t: unknown) => Promise<unknown>) =>
    task({ report: () => {} }, { isCancellationRequested: false }),
  registerWebviewViewProvider: () => ({ dispose: () => {} }),
  activeTextEditor: undefined,
  createOutputChannel: () => ({
    appendLine: () => {},
    show: () => {},
    dispose: () => {},
  }),
};

export const commands = {
  registerCommand: (_cmd: string, _cb: () => void) => ({ dispose: () => {} }),
  executeCommand: async () => {},
};

export const env = {
  clipboard: {
    writeText: async () => {},
    readText: async () => '',
  },
  openExternal: async () => true,
};

export class Uri {
  fsPath: string;
  constructor(path: string) {
    this.fsPath = path;
  }
  static file(path: string) {
    return new Uri(path);
  }
  static parse(uri: string) {
    return new Uri(uri);
  }
  static joinPath(base: Uri, ...segments: string[]) {
    return new Uri(base.fsPath + '/' + segments.join('/'));
  }
}

export class Position {
  constructor(
    public readonly line: number,
    public readonly character: number
  ) {}
}

export class Selection {
  constructor(
    public readonly anchor: Position,
    public readonly active: Position
  ) {}
  get isEmpty() {
    return (
      this.anchor.line === this.active.line &&
      this.anchor.character === this.active.character
    );
  }
}

export class Range {
  constructor(
    public readonly start: Position,
    public readonly end: Position
  ) {}
}

export enum StatusBarAlignment {
  Left = 1,
  Right = 2,
}

export enum TextEditorRevealType {
  Default = 0,
  InCenter = 1,
  InCenterIfOutsideViewport = 2,
  AtTop = 3,
}

export enum ProgressLocation {
  Notification = 15,
  Window = 10,
  SourceControl = 1,
}

export class RelativePattern {
  constructor(
    public readonly base: unknown,
    public readonly pattern: string
  ) {}
}

export class CancellationTokenSource {
  token = { isCancellationRequested: false };
  cancel() {
    this.token.isCancellationRequested = true;
  }
  dispose() {}
}
