# 同圈匹配 `/api/usersmatch/*` 接口说明（前端对齐用）

## 1. 开始匹配 — `POST /api/usersmatch/match`

- **返回 `data`：** 为**用户对象数组**（不是再包一层 `list`）。
- **列表项字段（示例）：** `uid`、`thumb`、`nickname`、`avatar_url`、`score`（数值，匹配度）等。
- **前端：** `normalizeMatchItems` 对「根为数组」的 `data` 直接解析；`score` 映射为 `match_percent`，用于后续 `get_match_info` 的 `score` 参数。

## 2. 选择匹配（详情 / 第二图层）— `POST /api/usersmatch/get_match_info`

**参数：** `uid`（int）、`score`（int，与列表项的数值匹配度一致）。

**返回 `data` 示例字段：**

| 字段 | 说明 |
|------|------|
| `uid` | 用户 id |
| `score` | **常为整句文案**，如 `匹配度80%, 你俩超级搭哟!`（**不是**纯数字） |
| `thumb` | 背景图 |
| `nickname` | 昵称 |
| `tags_list` | 标签数组，每项含 `name` 等 |

**语音：** 当前接口**不返回**对方语音文件 URL。前端在 `MatchItem.voice_url` / `voice_duration` 上**预留**字段，若后续增加 `voice` / `voice_url` 等，可在 `voiceUrlFromApiItem` 中兼容。

## 3. 提交匹配结果 — `POST /api/usersmatch/submit_match`

**参数：** `to_uid`（string）。

**成功后：** 前端关闭弹层并 **`router.push` 进入聊天页** `/chat/room`（仅提交成功时跳转，失败仅 Toast）。

**聊天页 query（同圈入口）：** `uid`、`name`、`score`（数值匹配度，与列表项 `score` 一致）。进入 `/chat/room` 后前端会再请求一次 `get_match_info`，若返回语音字段则展示为对方一条默认可播放语音消息。

---

## 聊天页 `/api/talk/*`（与 `chat-room.vue` 对齐）

| 接口 | 路径 | 说明 |
|------|------|------|
| 聊天用户信息 | `POST /api/talk/talk_info` | 无额外参数；`left_time` 用于展示「可发送消息数量」；`is_timeout === 1` 或 `left_time <= 0` 时展示时长不足提示 |
| 时长产品列表 | `POST /api/talk/product_list` | 无参数；项含 `id, name, price, promo_price, duration, icon_url` 等 |
| 购买时长 | `POST /api/talk/buy_time` | `product_id`（int）；扣金币，成功后需再拉 `talk_info` |
