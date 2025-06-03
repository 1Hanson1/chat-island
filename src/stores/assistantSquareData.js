// 助手广场数据管理
export const assistantSquareData = {
  // 推荐助手
  recommendedAssistants: [
    {
      id: 1,
      name: '写作助手',
      description: '帮助您撰写各类文章'
    },
    {
      id: 2,
      name: '编程助手',
      description: '解答编程问题'
    },
    {
      id: 3,
      name: '学习助手',
      description: '辅助学习新知识'
    }
  ],
  
  // 推荐工具
  recommendedTools: [
    {
      id: 1,
      name: 'PDF转换',
      description: 'PDF文件转换工具'
    },
    {
      id: 2,
      name: '图片处理',
      description: '在线图片编辑'
    },
    {
      id: 3,
      name: '翻译插件',
      description: '多语言翻译工具'
    }
  ],
  
  // 全部助手
  allAssistants: [
    {
      id: 1,
      name: '写作助手',
      description: '帮助您撰写各类文章和文档',
      tags: ['写作', '文档']
    },
    {
      id: 2,
      name: '编程助手',
      description: '解答编程问题，提供代码示例',
      tags: ['编程', '代码']
    },
    {
      id: 3,
      name: '学习助手',
      description: '辅助学习新知识和技能',
      tags: ['学习', '教育']
    },
    {
      id: 4,
      name: '翻译助手',
      description: '多语言翻译工具',
      tags: ['翻译', '语言']
    },
    {
      id: 5,
      name: '数据分析',
      description: '帮助分析数据并提供见解',
      tags: ['数据', '分析']
    },
    {
      id: 6,
      name: '营销助手',
      description: '创建营销内容和策略',
      tags: ['营销', '广告']
    }
  ],
  
  // 全部工具
  allTools: [
    {
      id: 1,
      name: 'PDF转换',
      description: 'PDF文件转换和编辑工具',
      tags: ['PDF', '转换']
    },
    {
      id: 2,
      name: '图片处理',
      description: '在线图片编辑和优化',
      tags: ['图片', '编辑']
    },
    {
      id: 3,
      name: '翻译插件',
      description: '多语言实时翻译工具',
      tags: ['翻译', '语言']
    },
    {
      id: 4,
      name: '代码格式化',
      description: '代码格式化和美化工具',
      tags: ['代码', '开发']
    },
    {
      id: 5,
      name: '数据可视化',
      description: '创建数据图表和可视化',
      tags: ['数据', '图表']
    },
    {
      id: 6,
      name: '视频压缩',
      description: '在线视频压缩和转换',
      tags: ['视频', '压缩']
    }
  ],
  
  // 搜索助手
  searchAssistants(query) {
    if (!query) return this.allAssistants;
    const q = query.toLowerCase();
    return this.allAssistants.filter(a => 
      a.name.toLowerCase().includes(q) || 
      a.description.toLowerCase().includes(q) ||
      (a.tags && a.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  },
  
  // 搜索工具
  searchTools(query) {
    if (!query) return this.allTools;
    const q = query.toLowerCase();
    return this.allTools.filter(t => 
      t.name.toLowerCase().includes(q) || 
      t.description.toLowerCase().includes(q) ||
      (t.tags && t.tags.some(tag => tag.toLowerCase().includes(q)))
    );
  }
};
