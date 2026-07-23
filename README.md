# 郭南焱 AI 产品作品集

面向 AI 产品经理、AI Agent 应用与 AI 产品开发实习的静态作品集。项目内容由 Markdown 管理，页面由 Astro 构建。

## 本地运行

```bash
npm install
npm run dev
```

## 5 分钟更新项目

1. 运行 `npm run new:update`，输入更新标题和项目 slug。
2. 打开生成的 `src/content/updates/日期-slug.md`。
3. 填写实际变化、验证结果、已知问题和证据，将 `draft` 改为 `false`。
4. 如需同步修改项目状态，编辑 `src/content/projects/slug.md` 的 `status`、`lastUpdated`、`results`、`badCases` 和 `nextSteps`。
5. 运行 `npm run build`。字段、链接、图片或隐私检查失败时，根据错误修正后再提交。

新增项目使用 `npm run new:project`。模板默认是草稿，不会进入生产站点。

## 内容状态

项目状态只能使用：`idea`、`planning`、`development`、`alpha`、`testing`、`released`、`archived`。

缺少真实指标、链接或截图时保留「尚未验证」或开发中说明，不填写推测值。

## 检查与构建

```bash
npm run validate:content
npm run check:privacy
npm run build
```

## 发布

推送到 `main` 后，GitHub Actions 构建 `dist/` 并发布到 GitHub Pages。首次发布需在仓库 Settings → Pages 中选择 GitHub Actions，并在 `astro.config.mjs` 设置正式 `site` 地址。

发布前逐项完成 `PRIVACY_CHECKLIST.md` 与 `PUBLISH_CHECKLIST.md`，尤其检查截图、视频、简历和 Git 历史。
