# UniCycleHK Frontend Prototype

这是 IS5940 小组项目的本地优先前端演示原型。它不连接真实数据库、支付系统或大学身份认证服务。

**在线演示：** https://folklore25.github.io/unicyclehk-prototype/

**GitHub 仓库：** https://github.com/Folklore25/unicyclehk-prototype

## 打开方式

直接双击 `index.html` 即可打开。若浏览器限制本地脚本，可在本目录启动任意静态文件服务器后访问首页。

## 建议演示路径

1. 在主页浏览和筛选真实留学生日用品。
2. 点击顶部 `University & meet-up area`，先选择香港八大院校，再选择该校附近的 mock 交收点。
3. 点击商品卡片查看商品详情和已验证卖家资料。
4. 点击 `Message seller` 演示聊天及校园交收。
5. 点击 `Mark handover as complete` 演示双向评价。
6. 点击 `Sell an item` 演示三步发布流程。
7. 点击侧栏的 `View verification` 演示大学邮箱认证状态。

收藏、发布商品、压缩后的商品图片、聊天、评分和未完成草稿都会保存在当前浏览器。可以从个人资料窗口导出或重置这些演示数据。

## 技术说明

- Bootstrap 5.3 响应式基础层
- 定制 HTML、CSS 和原生 JavaScript
- 本地商品图片，无网络依赖
- Progressive Web App，可安装并支持离线打开
- LocalStorage 本地持久化和商品深链接
- 12 件学生实拍风格商品，分别来自香港八大院校，并按所选学校与交收点优先排序
- 商品图使用独立原始比例文件和 `cover` 裁切，不再拉伸拼图素材
- 独立 404 页面和版本化 Service Worker 缓存，错误页面不会污染离线首页
- 桌面端侧栏和移动端底部导航
- GitHub Actions 自动检查并部署 GitHub Pages
- 所有用户数据仅保存在当前浏览器，不会上传到 GitHub

## CityUHK patent concept

The prototype includes a separate **Smart Match** workspace based on CityUHK IDF 414, “Method and Apparatus for Matching Buyers with Sellers in a Marketplace to Facilitate Trade” (US 11,030,690 B2). The workspace combines university, handover point, budget and category controls with transparent mock-scoring results. See [PATENT-INTEGRATION.md](PATENT-INTEGRATION.md) for verified sources, proposed adaptation and licensing boundaries.

## GitHub Pages 边界

GitHub Pages 是静态托管。当前版本不会提供跨设备账号、共享商品数据库、真实大学邮件验证、实时聊天或付款。实现这些能力需要独立后端服务。
