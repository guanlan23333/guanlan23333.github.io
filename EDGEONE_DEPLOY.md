# 腾讯 EdgeOne Pages 部署说明

## 当前项目类型

本项目是 Astro 静态站点生成项目，构建模式为 `output: 'static'`。源码页面位于 `src/pages/`，Markdown 内容位于 `src/content/`，构建产物输出到 `dist/`。

它不是纯 HTML/CSS/JS、Vite 单页应用、React、Vue 或 Next.js 项目。

## EdgeOne Pages 部署方式

推荐选择「导入 Git 仓库」部署，保留现有 GitHub Pages 工作流不变。EdgeOne 作为额外备用访问地址，从同一个仓库构建 `dist/` 静态产物。

根目录已有 `edgeone.json`，用于固定 EdgeOne 构建参数：

- 安装命令：`npm ci`
- 构建命令：`npm run build`
- 输出目录：`dist`
- Node.js 版本：`22.11.0`

EdgeOne 官方 Astro 静态站点默认也是 `npm run build` 和 `dist`。本项目不需要安装 `@edgeone/astro`，因为当前没有 SSR、API Routes 或服务端运行时。

## 环境变量

本项目构建不依赖私密环境变量。

可选变量：

```bash
SITE_URL=https://你的-edgeone-域名
```

`SITE_URL` 只影响 canonical、Open Graph URL 和 sitemap 的站点地址。首次部署如果还没有自定义域名，可以先不设置，站点仍可访问；绑定正式 EdgeOne 域名后，建议在 EdgeOne 控制台添加该变量并重新部署。

GitHub Pages 当前默认地址仍是：

```text
https://guanlan23333.github.io
```

## EdgeOne 控制台操作步骤

1. 打开 EdgeOne Pages/Makers 控制台。
2. 新建项目，选择「导入 Git 仓库」。
3. 选择当前作品集仓库。
4. 框架选择 Astro，或选择 Other 后手动填写构建配置。
5. 根目录保持仓库根目录：`./`。
6. 安装命令填写：`npm ci`。
7. 构建命令填写：`npm run build`。
8. 输出目录填写：`dist`。
9. Node.js 版本选择：`22.11.0`。
10. 生产分支选择当前 GitHub Pages 使用的分支，通常是 `main`。
11. 保存并触发首次部署。

## 绑定自定义域名

1. 在 EdgeOne 项目中进入域名管理。
2. 添加准备用作国内备用访问的自定义域名，例如 `<你的备用域名>`。
3. 将该域名关联到 Production 环境。
4. 按控制台提示到 DNS 服务商添加 CNAME 记录。
5. 等待 DNS 生效后，在 EdgeOne 控制台点击验证。
6. 开启或申请托管 HTTPS 证书。
7. 域名可访问后，把 EdgeOne 项目的 `SITE_URL` 环境变量改为这个正式域名，并重新部署一次。

## 访问验证

部署完成后检查这些路径：

```text
/
/projects/
/projects/secondbrain/
/projects/merchantops/
/projects/jobmatchai/
/resume/
/404.html
/favicon.svg
/og-image.png
```

建议用以下方式验证中国大陆访问稳定性：

- 使用国内网络直接打开 EdgeOne 域名。
- 用浏览器开发者工具 Network 面板确认 HTML、CSS、JS、图片均为 200。
- 使用国内多地测速或站长工具检查 DNS 解析和 HTTP 状态。
- 重点检查 `/_astro/` 下 CSS/JS 资源是否返回 200。

## 后续自动部署

EdgeOne 导入 Git 仓库后，后续代码推送到生产分支会自动触发重新部署。GitHub Pages 的 `.github/workflows/deploy.yml` 不需要删除，两边可以并行：

- GitHub Pages：继续发布到 `https://guanlan23333.github.io/`
- EdgeOne Pages：发布到 EdgeOne 默认域名或你绑定的自定义域名

## 常见问题排查

### 白屏

1. 在 EdgeOne 部署日志里确认 `npm ci` 和 `npm run build` 成功。
2. 确认输出目录是 `dist`，不是仓库根目录或 `dist/client`。
3. 打开浏览器 Network 面板，检查 `/_astro/` 下 CSS/JS 是否 404。
4. 如果 HTML 里的 canonical 或分享图地址仍指向 GitHub Pages，设置 `SITE_URL` 为 EdgeOne 正式域名后重新部署。

### 静态资源 404

1. 本地运行 `npm run build`，确认 `scripts/check-build.mjs` 没有报错。
2. 检查 `dist/favicon.svg`、`dist/og-image.png` 和 `dist/_astro/` 是否存在。
3. 确认 EdgeOne 输出目录填写为 `dist`。
4. 直接上传 ZIP 时，必须让 `index.html` 位于 ZIP 最外层，不能多包一层 `dist/` 目录。

### 路由刷新 404

本项目是 Astro 多页面静态站点，不是 SPA。正常页面都会在构建时生成真实 HTML 文件，因此刷新 `/projects/secondbrain/`、`/projects/merchantops/`、`/resume/` 应该直接命中对应文件。

如果刷新 404：

1. 检查对应文件是否存在，例如 `dist/projects/secondbrain/index.html`。
2. 检查项目 Markdown 的 `draft` 是否为 `false`。
3. 确认 EdgeOne 没有把输出目录配置错。

### 404 页面

项目已有 `src/pages/404.astro`，构建后会生成 `dist/404.html`。EdgeOne 会将它作为静态站点的自定义 404 页面识别。
