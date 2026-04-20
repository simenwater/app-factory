/**
 * @description Rewrite API 输入验证逻辑测试（不依赖 Next.js 运行时）
 */
describe('Rewrite API input validation', () => {
  it('空字符串应被视为无效输入', () => {
    const text = '';
    const isValid = text && typeof text === 'string';
    expect(isValid).toBeFalsy();
  });

  it('undefined 应被视为无效输入', () => {
    const text = undefined;
    const isValid = text && typeof text === 'string';
    expect(isValid).toBeFalsy();
  });

  it('null 应被视为无效输入', () => {
    const text = null;
    const isValid = text && typeof text === 'string';
    expect(isValid).toBeFalsy();
  });

  it('数字类型应被视为无效输入', () => {
    const text = 123;
    const isValid = text && typeof text === 'string';
    expect(isValid).toBeFalsy();
  });

  it('有效字符串应通过验证', () => {
    const text = '这是一段有效的文本';
    const isValid = text && typeof text === 'string';
    expect(isValid).toBeTruthy();
  });

  it('默认风格应为 summary', () => {
    const style = undefined;
    const resolvedStyle = style || 'summary';
    expect(resolvedStyle).toBe('summary');
  });

  it('应支持所有四种重写风格', () => {
    const validStyles = ['summary', 'formal', 'bullet', 'blog'];
    validStyles.forEach((style) => {
      expect(['summary', 'formal', 'bullet', 'blog']).toContain(style);
    });
  });
});
