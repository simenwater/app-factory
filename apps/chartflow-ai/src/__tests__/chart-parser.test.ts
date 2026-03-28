import {
  inferChartType,
  isValidMermaidCode,
  isValidPlantUMLCode,
} from '@/lib/chart-parser';

describe('inferChartType', () => {
  it('应该识别流程图关键词', () => {
    expect(inferChartType('用户注册流程')).toBe('flowchart');
    expect(inferChartType('描述一个步骤')).toBe('flowchart');
  });

  it('应该识别时序图关键词', () => {
    expect(inferChartType('系统间的交互时序')).toBe('sequence');
    expect(inferChartType('HTTP 请求调用链')).toBe('sequence');
  });

  it('应该识别时间线关键词', () => {
    expect(inferChartType('公司发展历程时间线')).toBe('timeline');
    expect(inferChartType('React 的发展史')).toBe('timeline');
  });

  it('应该识别类图关键词', () => {
    expect(inferChartType('展示类图和继承关系')).toBe('class');
  });

  it('应该识别状态图关键词', () => {
    expect(inferChartType('订单的状态转换')).toBe('state');
  });

  it('应该识别 ER 图关键词', () => {
    expect(inferChartType('数据库实体关系')).toBe('er');
  });

  it('应该识别甘特图关键词', () => {
    expect(inferChartType('项目排期甘特图')).toBe('gantt');
  });

  it('应该识别饼图关键词', () => {
    expect(inferChartType('各部门占比饼图')).toBe('pie');
  });

  it('应该识别思维导图关键词', () => {
    expect(inferChartType('Web 开发思维导图')).toBe('mindmap');
  });

  it('应该识别协议格式关键词', () => {
    expect(inferChartType('TCP 协议数据格式')).toBe('binary-protocol');
    expect(inferChartType('二进制帧字段定义')).toBe('binary-protocol');
  });

  it('默认应返回 flowchart', () => {
    expect(inferChartType('一些随机文本')).toBe('flowchart');
  });
});

describe('isValidMermaidCode', () => {
  it('应该验证有效的 Mermaid 代码', () => {
    expect(isValidMermaidCode('flowchart TD\n  A-->B')).toBe(true);
    expect(isValidMermaidCode('sequenceDiagram\n  A->>B: Hi')).toBe(true);
    expect(isValidMermaidCode('pie\n  "A": 50')).toBe(true);
    expect(isValidMermaidCode('gantt\n  title Test')).toBe(true);
    expect(isValidMermaidCode('timeline\n  title Test')).toBe(true);
    expect(isValidMermaidCode('mindmap\n  root((Test))')).toBe(true);
    expect(isValidMermaidCode('classDiagram\n  class A')).toBe(true);
    expect(isValidMermaidCode('stateDiagram-v2\n  [*]-->A')).toBe(true);
    expect(isValidMermaidCode('erDiagram\n  A ||--o{ B : has')).toBe(true);
  });

  it('应该拒绝无效的代码', () => {
    expect(isValidMermaidCode('')).toBe(false);
    expect(isValidMermaidCode('hello world')).toBe(false);
    expect(isValidMermaidCode('@startuml')).toBe(false);
  });

  it('应该拒绝非字符串输入', () => {
    expect(isValidMermaidCode(null as unknown as string)).toBe(false);
    expect(isValidMermaidCode(undefined as unknown as string)).toBe(false);
  });
});

describe('isValidPlantUMLCode', () => {
  it('应该验证有效的 PlantUML 代码', () => {
    expect(isValidPlantUMLCode('@startuml\nA -> B\n@enduml')).toBe(true);
    expect(isValidPlantUMLCode('@startmindmap\n* root\n@endmindmap')).toBe(
      true
    );
    expect(isValidPlantUMLCode('@startgantt\n[task] lasts 5 days\n@endgantt')).toBe(
      true
    );
  });

  it('应该拒绝无效的代码', () => {
    expect(isValidPlantUMLCode('')).toBe(false);
    expect(isValidPlantUMLCode('flowchart TD')).toBe(false);
    expect(isValidPlantUMLCode('@startuml only')).toBe(false);
  });

  it('应该拒绝非字符串输入', () => {
    expect(isValidPlantUMLCode(null as unknown as string)).toBe(false);
  });
});
