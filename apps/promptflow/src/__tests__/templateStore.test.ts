import { useTemplateStore } from '@/store/templateStore';
import { DEFAULT_TEMPLATES } from '@/lib/defaultTemplates';

/**
 * @description 模板 Store 单元测试
 */
describe('templateStore', () => {
  beforeEach(() => {
    useTemplateStore.setState({
      templates: [...DEFAULT_TEMPLATES],
      filters: {
        search: '',
        category: 'all',
        platform: 'all',
        showFavoritesOnly: false,
        showSharedOnly: false,
      },
      selectedTemplateId: null,
      isEditing: false,
      editingContent: '',
    });
  });

  describe('addTemplate', () => {
    it('should add a new template and select it', () => {
      const store = useTemplateStore.getState();
      const initialCount = store.templates.length;

      const newTemplate = store.addTemplate({
        title: '测试模板',
        description: '这是一个测试',
        content: '测试内容',
        category: 'custom',
        platform: 'generic',
        tags: ['test'],
        isBuiltIn: false,
        isFavorite: false,
        isShared: false,
        author: '测试用户',
      });

      const updatedState = useTemplateStore.getState();
      expect(updatedState.templates.length).toBe(initialCount + 1);
      expect(updatedState.selectedTemplateId).toBe(newTemplate.id);
      expect(newTemplate.title).toBe('测试模板');
      expect(newTemplate.versions).toEqual([]);
    });
  });

  describe('deleteTemplate', () => {
    it('should remove the template by id', () => {
      const store = useTemplateStore.getState();
      const added = store.addTemplate({
        title: '待删除',
        description: '',
        content: '',
        category: 'custom',
        platform: 'generic',
        tags: [],
        isBuiltIn: false,
        isFavorite: false,
        isShared: false,
        author: 'test',
      });

      useTemplateStore.getState().deleteTemplate(added.id);
      const updatedState = useTemplateStore.getState();
      expect(updatedState.templates.find((t) => t.id === added.id)).toBeUndefined();
    });

    it('should clear selection if the deleted template was selected', () => {
      const store = useTemplateStore.getState();
      const added = store.addTemplate({
        title: '待删除',
        description: '',
        content: '',
        category: 'custom',
        platform: 'generic',
        tags: [],
        isBuiltIn: false,
        isFavorite: false,
        isShared: false,
        author: 'test',
      });

      expect(useTemplateStore.getState().selectedTemplateId).toBe(added.id);
      useTemplateStore.getState().deleteTemplate(added.id);
      expect(useTemplateStore.getState().selectedTemplateId).toBeNull();
    });
  });

  describe('updateTemplate', () => {
    it('should update the specified template fields', () => {
      const template = DEFAULT_TEMPLATES[0];
      useTemplateStore.getState().updateTemplate(template.id, { title: '更新后的标题' });
      const updated = useTemplateStore.getState().templates.find((t) => t.id === template.id);
      expect(updated?.title).toBe('更新后的标题');
    });
  });

  describe('duplicateTemplate', () => {
    it('should create a copy with a new id and "(副本)" suffix', () => {
      const template = DEFAULT_TEMPLATES[0];
      const store = useTemplateStore.getState();
      const duplicate = store.duplicateTemplate(template.id);

      expect(duplicate).not.toBeNull();
      expect(duplicate!.id).not.toBe(template.id);
      expect(duplicate!.title).toBe(`${template.title} (副本)`);
      expect(duplicate!.isBuiltIn).toBe(false);
    });

    it('should return null for non-existent template', () => {
      const result = useTemplateStore.getState().duplicateTemplate('nonexistent');
      expect(result).toBeNull();
    });
  });

  describe('toggleFavorite', () => {
    it('should toggle the isFavorite flag', () => {
      const template = DEFAULT_TEMPLATES[0];
      expect(template.isFavorite).toBe(false);

      useTemplateStore.getState().toggleFavorite(template.id);
      const toggled = useTemplateStore.getState().templates.find((t) => t.id === template.id);
      expect(toggled?.isFavorite).toBe(true);

      useTemplateStore.getState().toggleFavorite(template.id);
      const toggledBack = useTemplateStore.getState().templates.find((t) => t.id === template.id);
      expect(toggledBack?.isFavorite).toBe(false);
    });
  });

  describe('filters', () => {
    it('should filter by category', () => {
      useTemplateStore.getState().setFilter({ category: 'coding-style' });
      const filtered = useTemplateStore.getState().getFilteredTemplates();
      expect(filtered.every((t) => t.category === 'coding-style')).toBe(true);
    });

    it('should filter by platform', () => {
      useTemplateStore.getState().setFilter({ platform: 'cursor' });
      const filtered = useTemplateStore.getState().getFilteredTemplates();
      expect(filtered.every((t) => t.platform === 'cursor')).toBe(true);
    });

    it('should filter by search query', () => {
      useTemplateStore.getState().setFilter({ search: 'Claude' });
      const filtered = useTemplateStore.getState().getFilteredTemplates();
      expect(filtered.length).toBeGreaterThan(0);
      expect(
        filtered.every(
          (t) =>
            t.title.toLowerCase().includes('claude') ||
            t.description.toLowerCase().includes('claude') ||
            t.tags.some((tag) => tag.toLowerCase().includes('claude'))
        )
      ).toBe(true);
    });

    it('should filter favorites only', () => {
      const template = DEFAULT_TEMPLATES[0];
      useTemplateStore.getState().toggleFavorite(template.id);
      useTemplateStore.getState().setFilter({ showFavoritesOnly: true });
      const filtered = useTemplateStore.getState().getFilteredTemplates();
      expect(filtered.every((t) => t.isFavorite)).toBe(true);
      expect(filtered.length).toBe(1);
    });
  });

  describe('version management', () => {
    it('should save a version for a template', () => {
      const template = DEFAULT_TEMPLATES[0];
      useTemplateStore.getState().saveVersion(template.id, '测试保存');
      const updated = useTemplateStore.getState().templates.find((t) => t.id === template.id);
      expect(updated?.versions.length).toBe(1);
      expect(updated?.versions[0].message).toBe('测试保存');
      expect(updated?.versions[0].content).toBe(template.content);
    });

    it('should restore a version', () => {
      const template = DEFAULT_TEMPLATES[0];
      useTemplateStore.getState().saveVersion(template.id, '版本 1');
      const v1Content = template.content;

      useTemplateStore.getState().updateTemplate(template.id, { content: '新内容' });
      useTemplateStore.getState().saveVersion(template.id, '版本 2');

      const versions = useTemplateStore.getState().templates.find((t) => t.id === template.id)?.versions;
      expect(versions?.length).toBe(2);

      const v1Id = versions![versions!.length - 1].id;
      useTemplateStore.getState().restoreVersion(template.id, v1Id);

      const restored = useTemplateStore.getState().templates.find((t) => t.id === template.id);
      expect(restored?.content).toBe(v1Content);
    });
  });

  describe('importTemplates', () => {
    it('should import templates with new ids', () => {
      const initialCount = useTemplateStore.getState().templates.length;
      useTemplateStore.getState().importTemplates([
        {
          ...DEFAULT_TEMPLATES[0],
          title: '导入的模板',
        },
      ]);
      const state = useTemplateStore.getState();
      expect(state.templates.length).toBe(initialCount + 1);
      const imported = state.templates[state.templates.length - 1];
      expect(imported.title).toBe('导入的模板');
      expect(imported.isBuiltIn).toBe(false);
    });
  });
});
