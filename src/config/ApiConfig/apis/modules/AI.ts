export default {
  // AI魔法预检查
  pre: { method: 'post', url: '/api/aimagic/pre' },
  // 兼容旧路径
  preMagic: { method: 'post', url: '/api/aimagic/pre_magic' },
  // AI魔法素材列表
  listMaterial: { method: 'post', url: '/api/aimagic/list_material' },
  // AI魔法素材列表（旧接口）
  list: { method: 'post', url: '/api/aimagic/list' },
  // 提交AI魔法任务
  magic: { method: 'post', url: '/api/aimagic/generate_video' },
  // 我的AI魔法记录列表（清单口径）
  myMagic: { method: 'post', url: '/api/aimagic/my_magic' },
  // 我的AI魔法记录列表（兼容旧口径）
  records: { method: 'post', url: '/api/aimagic/records' },
  // AI去衣预检查
  preStrip: { method: 'post', url: '/api/ai/pre_strip' },
  // 提交AI去衣任务
  strip: { method: 'post', url: '/api/ai/strip' },
  // 我的AI去衣记录列表（清单口径）
  myStrip: { method: 'post', url: '/api/ai/my_strip' },
  // 我的AI去衣记录列表（兼容旧口径）
  stripList: { method: 'post', url: '/api/ai/strip_list' },
  // AI智能专区导航列表
  aiNav: { method: 'post', url: '/api/ai/ai_nav' }
}
