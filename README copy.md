按以下要求进行开发，需求不明确，群内沟通。

## A.基础环境:

1. vue3、nuxt3框架为基础。
2. 组件使用Vant4的UI库
3. css样式使用Less工具格式
4. node: v18.7.0
5. npm: 8.15.0
6. 环境配置：~/app.config.ts
7. 统一使用yarn代替npm管理
8. 初始化依赖: yarn install
9. 项目启动: yarn run dev

## B.代码规范:

1. Html页面应包含分层注释和清晰的描述（例如：<!-- xxx start--> <!-- xxx end-->）。
2. Less应从上到下注释，或按功能模块层次注释，附有清晰的描述（例如：<!-- xxx start--> <!-- xxx end-->）。
3. Javascript应从上到下注释，或按功能模块分层，附有清晰的描述（例如：// xxx）。
4. 已知标签数量时，不使用v-for循环，直接使用HTML。
5. 操作事件以on开头（例如：onLikeTabChange）。
6. 引用命名以Ref结尾（例如：likeSwiperRef）。
7. 对于不需要复杂页面处理的非无限数据列表，直接在页面中定义它们。
8. 在新组件和页面的文件头部添加描述：
<!--
    Description: 组件描述
    Date: YYYY-MM-DD(动态日期格式)
-->
9. template部分以以下引用开始(以下为固定代码)：
<div class="container" ref="containerRef">
    // 业务代码...
</div>

10. Javascript部分以以下引用开始(以下为固定代码)：// 当前实例const \_\_ = useNuxtApp(); const \_route = useRoute();
    const \_router = useRouter(); // 业务代码...

11. Less部分以以下引用开始(以下为固定代码)：
<style lang="less" scoped>
.container {
    width: 100%;
    height: calc(100%);
    margin: 0 auto;
    text-align: center;
	overflow-y: auto;

    // 业务代码...
}
</style>

## C.协作规范

1. 不使用import来导入组件（特殊组件需要除外）。
2. ...
3. 页面跳转使用\_\_.$NavigateTo('跳转路由');
4. 图片放大浏览\_\_.$ImagePreview('图片路径');

5. 提示 5.1 简单场景使用：**.$Alert( 字符串 | { 参数 } ); 5.2 是否场景使
   用：**.$Confirm( 字符串 | { 参数 } );
    5.3 加载场景使用__.$MessageLoading( 字符串 | { 参数 } );

6. 不要重新创建现有相似组件（局部差异的组件可以通过反馈沟通后再复用）：

7. 常用辅助工具(全局) 7.1 金额格式：$Utils.formatNumber(数字)
    7.2 秒转时长：$Utils.toVideoTime(秒数) 7.3 广告打
   开：$Utils.formatNumber(数字)
    7.3 当前地址：$Utils.getUrlParams(参数) 在src/utils/index.js可添加追加自定义函数, 调
   用方式同上。以$Utils.函数名(参数)
