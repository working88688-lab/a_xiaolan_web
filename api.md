version > 4.9.1, 其他不变


金刚区： /api/tabnew/list_construct 
type新增
9=> "男漫",
10=> "同圈",
11 => "直播",


黄游：
 分类：/api/porngame/construct. 参数
 列表：/api/porngame/list           参数 id=分类ID sort=[flag键]
        详情:   /api/porngame/detail.     参数 id=黄游ID
        购买    /api/porngame/buy.         参数 id=黄游ID. type=2[支付方式 1 次数 2 金币]
        详情评论列表  /api/porngame/comment_list 参数 id=黄游ID
        发布评论  /api/porngame/comment 参数 porn_id=黄游ID comment_id=评论ID[可选，不为空时回复评论] content=评论
        评论回复列表 /api/porngame/comments_reply. 参数 comment_id=评论ID
        点赞.    /api/porngame/like.          参数 id=黄游ID

求片：
        榜单： /api/find/rank                      参数
        榜单该用户推荐的所有视频：/api/find/replyByRank  参数：uuid=榜单uuid

动漫：
        首页分类和广告: /api/cartoon/construct. 参数
 搜索分类：/api/cartoon/construct_cate 参数
 列表：/api/cartoon/list           参数 id=分类ID sort=
        按分类搜索：/api/cartoon/search_cate 参数 cate=分类ID sort=[new,hot],free_type=[1,2]
        详情:   /api/cartoon/detail.     参数 id=黄动漫ID
        点赞.    /api/cartoon/like.          参数 id=动漫ID
        我的收藏 点赞: /api/cartoon/like_list
        购买    /api/cartoon/buy.         参数 id=动漫ID
        我的购买    /api/cartoon/my_buy.         参数
        详情评论列表  /api/cartoon/comment_list 参数 id=动漫ID
        发布评论  /api/cartoon/comment 参数 id=动漫ID comment_id=评论ID[可选，不为空时回复评论] content=评论
        点赞/取消点赞 评论 /api/cartoon/like_comment. 参数 comment_id=评论ID

直播：
        分类导航：/api/live/nav 参数
        首页分类和广告: /api/live/rec 参数
 主播列表：/api/live/index           参数 id=分类ID
        搜索：/api/live/search 参数 word=关键词
        主播详情:   /api/live/detail.     参数 id=主播ID
        推荐主播:   /api/live/recommend.     参数 id=主播ID
        点赞.    /api/live/like.          参数 id=主播ID
        我的收藏 : /api/live/list_favorite
        购买    /api/live/buy.         参数 id=主播ID
        我的购买  /api/live/list_buy.         参数        直播评论  /api/live/comment_list 参数 id=主播ID
        发布评论  /api/live/comment 参数 live_id=主播ID comment_id=评论ID[可选，不为空时回复评论] content=评论
        评论回复  /api/live/comment_reply 参数 comment_id=评论ID
        打赏.        /api/live/reward         参数 id=主播ID coins=金币

        
博主个人页：
        收藏：/api/users/likes     参数 uid=博主uid.   kwy=搜索词
        购买：/api/users/buys     参数 uid=博主uid.   kwy=搜索词

有奖反馈
       /api /system/feddback_reward 参数 type，content，images(和社区的图片格式一样)

/api /system/nav_conf

色界和男漫 的 小说等通过配置获取

/api /system/feedback_reward_types 获取类型
