# CLAUDE.md

@AGENTS.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 执行职责

你是使用 DeepSeek 后端的代码执行层。只执行根目录 `TASK.md`，不得自行重新定义需求或决定验收通过。

## 项目概要

郭南焱的 AI 产品作品集 — Astro 6 静态站点，面向中国大陆招聘场景。Content Collections + Markdown 驱动内容，GitHub Pages 部署。无 CMS、无数据库、无运行时 JS 依赖。

## 常用命令

```bash
npm run dev                  # 开发服务器 http://127.0.0.1:4321
npm run build                # 完整构建：validate → privacy → astro check → build → check-build
npm run preview              # 预览生产构建
npm run new:project          # 交互式创建新项目草稿
npm run new:update           # 交互式创建更新草稿
npm run validate:content     # 单独校验：必填字段、slug 唯一、图片存在、URL 格式
npm run check:privacy        # 隐私扫描：API key、手机号、身份证号、本地绝对路径
npm run check:build          # 构建后检查：内部链接有效、首页 CTA 存在、无草稿泄漏
```

## 架构

```
Markdown/MDX (src/content/)
    → Astro Content Collections + Zod schema 校验
    → 页面 (src/pages/) ← 组件 (src/components/) ← 数据 (src/data/)
    → 纯静态 HTML/CSS
    → GitHub Pages (push main 自动部署)
```

- `src/content/` — 项目（`projects/`）和更新（`updates/`），schema 定义在 `src/content.config.ts`
- `src/data/` — 低频更新的个人资料 `profile.ts`、导航 `navigation.ts`
- `src/pages/` — 路由：首页、`/projects/`、`/projects/[slug]/`、`/resume/`、404
- `src/layouts/` — `BaseLayout.astro`（全局 chrome）和 `ProjectLayout.astro`（案例详情）
- `scripts/` — 纯 Node.js（`.mjs`），无框架依赖，直接 `node` 运行
- `public/` — 静态资源：图片在 `images/projects/<slug>/`，简历在 `resume/`

## 内容模型

项目状态只能是：`idea | planning | development | alpha | testing | released | archived`

草稿过滤：所有页面通过 `!data.draft` 过滤。`draft: true` 的内容不出现在任何页面，`check-build` 扫描 `dist/` 确保无草稿泄漏。

排序规则：`featured: true` 的项目出现在首页。列表按 `priority` 升序 → `lastUpdated` 降序。

必填字段：`title`、`slug`、`summary`、`status`、`featured`、`priority`、`role`、`startDate`、`lastUpdated`、`tags`、`problem`、`targetUsers`、`responsibilities`、`architecture`、`evaluation`、`draft`。

缺失真实数据时保留 TODO 或「尚未验证」，不填写推测值。

## 设计约束

- 系统字体栈，不请求外部在线字体
- 原生 CSS（`src/styles/global.css`），无组件库或 CSS 框架
- 动效需尊重 `prefers-reduced-motion`
- 核心内容在 HTML 中静态呈现，JS 失败不影响阅读
- 图片本地化、明确尺寸、非首屏懒加载

## 构建管线

`npm run build` 按顺序执行：

1. `validate:content` — 正则解析 frontmatter 检查必填字段、slug 唯一、图片路径指向 `public/` 真实文件、URL 格式有效
2. `check:privacy` — 扫描 `src/content/` 和 `public/` 中所有文本文件，匹配密钥/手机号/身份证号/本地绝对路径
3. `astro check` — TypeScript 类型检查
4. `astro build` — 生成 `dist/`
5. `check:build` — 遍历 `dist/` 中所有 HTML 的 `<a href>`，验证内部链接指向的文件存在；检查首页是否包含关键 CTA 文本；检查是否有 `draft` 文件泄漏

## 关键决策

- 不用 React/Vue/Next.js：第一版无复杂客户端状态，静态 HTML 足够
- 不用 CMS/数据库：单人维护，Git 已提供版本历史
- SITE_URL 通过环境变量注入（`process.env.SITE_URL`），默认 `https://example.com`，发布前必须在 GitHub Actions secrets 或 `.env` 设置正式域名
- 首页视觉借鉴 OrbTech（大标题、大留白），案例叙事借鉴 Simon Pan（价值前置、证据驱动）。借鉴限于信息层级和 UX 原则，不复制具体资产
