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

- Bootstrap 5.3.8 响应式基础层，版本与本地资源完整性由 lockfile 校验
- 定制 HTML、CSS 和原生 JavaScript
- 本地商品图片，无网络依赖
- Progressive Web App，可安装并支持离线打开
- LocalStorage 本地持久化和商品深链接
- 12 件学生实拍风格商品，分别来自香港八大院校，并按所选学校与交收点优先排序
- 商品图使用独立原始比例文件和 `cover` 裁切，不再拉伸拼图素材
- 独立 404 页面和版本化 Service Worker 缓存，错误页面不会污染离线首页
- 桌面端侧栏和移动端底部导航
- GitHub Actions 通过全部安全及浏览器检查后自动部署 GitHub Pages
- 所有用户数据仅保存在当前浏览器，不会上传到 GitHub

## CityUHK patent concept

The prototype includes a separate **Smart Match** workspace based on CityUHK IDF 414, “Method and Apparatus for Matching Buyers with Sellers in a Marketplace to Facilitate Trade” (US 11,030,690 B2). The workspace combines university, handover point, budget and category controls with transparent mock-scoring results. See [PATENT-INTEGRATION.md](PATENT-INTEGRATION.md) for verified sources, proposed adaptation and licensing boundaries.

## GitHub Pages 边界

GitHub Pages 是静态托管。当前版本不会提供跨设备账号、共享商品数据库、真实大学邮件验证、实时聊天或付款。实现这些能力需要独立后端服务。

## 本地验证与 CI/CD

需要 Node.js 24 或更新版本。网页运行仍然使用本地静态文件；npm 只用于维护和部署检查。

```sh
npm ci --ignore-scripts
npm run check
npm test
npm audit --audit-level=high
npm run build
npx --no-install playwright install chromium
npm run test:e2e
```

`npm run build` 生成 `_site/`，只复制公开网页和资源。浏览器测试从该部署包运行，使用与 GitHub Pages 相同的 `/unicyclehk-prototype/` 路径，覆盖 320、390、768、1024、1280 和 1440px。

[Pages 工作流](.github/workflows/pages.yml) 的部署顺序：源码、依赖及单元检查 + 全 Git 历史密钥扫描 → 浏览器回归 → 公开文件打包 → 部署。任何检查失败都会阻止部署；PR 只检查，只有 `main` 的 push 或手动运行可部署。

- Actions 使用完整 commit SHA；只有部署 job 获得 Pages / OIDC 写权限，checkout 不保存 Git 凭据。
- Gitleaks 固定版本并校验 SHA-256，输出中的密钥会被隐藏。需要本地检查时使用官方 Gitleaks CLI 的 `gitleaks git --redact --ignore-gitleaks-allow --log-opts="--all" .`。
- npm 使用官方 registry 和锁定版本，安装时不执行依赖脚本；高危及严重漏洞会使审计失败。Bootstrap 本地文件必须与已审计 npm 包一致。
- Dependabot 每周检查 npm 与 Actions 更新。更新 Bootstrap 后必须运行 `npm run vendor` 并提交生成的两个资源文件；Gitleaks 版本和校验值需一起维护。
- 浏览器回归覆盖账户入口、收藏、商品详情、聊天、Smart Match、发布与持久化，以及 HTML 注入、CSP、404 和离线行为。
- 首页和 404 设置 CSP，限制脚本及网络连接到当前 origin，并拒绝内联脚本。样式暂保留 `unsafe-inline`，用于动态商品图片和现有行内样式。图片数据仅接受受限的 JPEG / PNG / WebP base64 或本地商品路径。

GitHub Pages 无法通过仓库文件设置任意 HTTP 响应头，因此这里使用 HTML meta CSP，不宣称具备 `frame-ancestors`、HSTS 等服务器响应头保护。失败的浏览器报告保留 7 天，不包含真实账号或用户数据。以上检查覆盖已知风险，不等同于完整安全审计。
