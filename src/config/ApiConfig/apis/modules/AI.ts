export default {
  // AI魔法预检查
  preMagic: { method: 'post', url: '/api/aimagic/pre_magic' },
  // AI魔法素材列表
  listMaterial: { method: 'post', url: '/api/aimagic/list_material' },
  // AI魔法素材列表（旧接口）
  list: { method: 'post', url: '/api/aimagic/list' },
  // 提交AI魔法任务
  magic: { method: 'post', url: '/api/aimagic/magic' },
  // 我的AI魔法记录列表
  records: { method: 'post', url: '/api/aimagic/records' },
  // AI去衣预检查
  preStrip: { method: 'post', url: '/api/ai/pre_strip' },
  // 提交AI去衣任务
  strip: { method: 'post', url: '/api/ai/strip' },
  // 我的AI去衣记录列表
  stripList: { method: 'post', url: '/api/ai/strip_list' }
}
