import { generateEmbedCode } from '@/lib/export';

describe('generateEmbedCode', () => {
  it('应该生成 Mermaid 嵌入代码', () => {
    const code = 'flowchart TD\n  A-->B';
    const result = generateEmbedCode(code, 'mermaid');

    expect(result).toContain('class="mermaid"');
    expect(result).toContain('mermaid.min.js');
    expect(result).toContain(code);
  });

  it('应该生成 PlantUML 嵌入代码', () => {
    const code = '@startuml\nA -> B\n@enduml';
    const result = generateEmbedCode(code, 'plantuml');

    expect(result).toContain('plantuml.com');
    expect(result).toContain(code);
  });

  it('Mermaid 嵌入应包含 base64 链接', () => {
    const code = 'pie\n  "A": 50\n  "B": 50';
    const result = generateEmbedCode(code, 'mermaid');

    expect(result).toContain('mermaid.live/edit#base64:');
  });
});
