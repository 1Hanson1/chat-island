// 助手广场数据管理
export const assistantSquareData = {
  // 推荐助手
  recommendedAssistants: [
    {
      id: 1,
      name: '写作助手',
      description: '帮助您撰写各类文章',
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个专业的写作助手',
        contextExamples: [],
        conversationStarters: ['帮我写一篇文章', '我需要写作帮助']
      }
    },
    {
      id: 2,
      name: '编程助手',
      description: '解答编程问题',
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个专业的编程助手',
        contextExamples: [],
        conversationStarters: ['帮我解决这个编程问题', '解释这段代码']
      }
    },
    {
      id: 3,
      name: '学习助手',
      description: '辅助学习新知识',
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个耐心的学习助手',
        contextExamples: [],
        conversationStarters: ['解释这个概念', '帮我复习这个主题']
      }
    }
  ],
  
  // 推荐工具
  recommendedTools: [
    {
      id: 1,
      name: 'PDF转换',
      description: 'PDF文件转换工具',
      inputFormat: '',
      outputFormat: '',
      contextLength: 3
    },
    {
      id: 2,
      name: '图片处理',
      description: '在线图片编辑',
      inputFormat: '',
      outputFormat: '',
      contextLength: 3
    },
    {
      id: 3,
      name: '翻译插件',
      description: '多语言翻译工具',
      inputFormat: '',
      outputFormat: '',
      contextLength: 3
    }
  ],
  
  // 全部助手
  allAssistants: [
    {
      id: 1,
      name: '写作助手',
      description: '帮助您撰写各类文章和文档',
      tags: ['写作', '文档'],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个专业的写作助手',
        contextExamples: [],
        conversationStarters: ['帮我写一篇文章', '我需要写作帮助']
      }
    },
    {
      id: 2,
      name: '编程助手',
      description: '解答编程问题，提供代码示例',
      tags: ['编程', '代码'],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个专业的编程助手',
        contextExamples: [],
        conversationStarters: ['帮我解决这个编程问题', '解释这段代码']
      }
    },
    {
      id: 3,
      name: '学习助手',
      description: '辅助学习新知识和技能',
      tags: ['学习', '教育'],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个耐心的学习助手',
        contextExamples: [],
        conversationStarters: ['解释这个概念', '帮我复习这个主题']
      }
    },
    {
      id: 4,
      name: '翻译助手',
      description: '多语言翻译工具',
      tags: ['翻译', '语言'],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个多语言翻译专家',
        contextExamples: [],
        conversationStarters: ['翻译这句话', '这个词用英语怎么说']
      }
    },
    {
      id: 5,
      name: '数据分析',
      description: '帮助分析数据并提供见解',
      tags: ['数据', '分析'],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个数据分析专家',
        contextExamples: [],
        conversationStarters: ['分析这组数据', '帮我解读这个图表']
      }
    },
    {
      id: 6,
      name: '营销助手',
      description: '创建营销内容和策略',
      tags: ['营销', '广告'],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3,
      presetPrompts: {
        systemPrompt: '你是一个创意营销专家',
        contextExamples: [],
        conversationStarters: ['帮我策划一个营销活动', '写一个广告文案']
      }
    }
  ],
  
  // 全部工具
  allTools: [
    {
      id: 1,
      name: 'PDF转换',
      description: 'PDF文件转换工具',
      inputFormat: '',
      outputFormat: '',
      contextLength: 3
    },
    {
      id: 2,
      name: '图片处理',
      description: '在线图片编辑',
      inputFormat: '',
      outputFormat: '',
      contextLength: 3
    },
    {
      id: 3,
      name: '翻译插件',
      description: '多语言翻译工具',
      inputFormat: '',
      outputFormat: '',
      contextLength: 3
    },
    {
      id: 4,
      name: '代码格式化',
      description: '代码格式化和美化工具',
      tags: ['代码', '开发'],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3
    },
    {
      id: 5,
      name: '数据可视化',
      description: '创建数据图表和可视化',
      tags: ['数据', '图表'],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3
    },
    {
      id: 6,
      name: '视频压缩',
      description: '在线视频压缩和转换',
      tags: ['视频', '压缩'],
      inputFormat: '',
      outputFormat: '',
      contextLength: 3
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
