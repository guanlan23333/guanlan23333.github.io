# TASK-009-IMPLEMENT：首页首屏 Product delivery path 替换为紧凑版 Capabilities

状态：`APPROVED`

## 目标

将首页首屏右侧的 "Product delivery path" 四步流程替换为紧凑版 Capabilities 能力展示，并删除页面下方重复的 Capabilities section。

## 允许修改

- `src/pages/index.astro`
- `src/styles/global.css`

## 实现要求

1. 完全移除 `.hero-system` Product delivery path 结构
2. 将 Capabilities 内容以紧凑 2×2 卡片网格形式放入首屏右侧
3. 新增 `.hero-capabilities` 容器，`id="capabilities"` 放在该容器或合适的父级元素上
4. 删除页面下方原来的 `#capabilities` section（`<section class="section" id="capabilities">` 整块）
5. 保留顶部导航 `/#capabilities` 锚点定位，增加 `scroll-margin-top`
6. 删除不再使用的 `.hero-system`、`.hero-system ol`、`.hero-system li` 等 CSS
7. 保留四项能力内容：业务问题分析、AI 工作流设计、快速原型实现、验证与交付
8. 四个项目证据链接不变

## 响应式要求

- 桌面端：首屏左右双栏，右侧 2×2 卡片网格
- 平板端（≤900px）：首屏上下布局，能力卡片保持 2×2
- 手机端（≤640px）：首屏上下排列，能力卡片单列

## 禁止事项

- 不新增第三方依赖
- 不修改项目内容模型、排序、SEO、简历页或项目详情页
- 不修改 `src/data/`、`src/content/`、导航组件、SectionHeading 组件
- 不修改治理文档和任务文件（`AGENTS.md`、`CLAUDE.md`、`DECISIONS.md` 等）
- 不提交、不推送

## 验收标准

1. 首页只出现一处 Capabilities
2. Product delivery path 已完全移除
3. 顶部"能力"导航跳转到新的首屏能力面板
4. 四个项目证据链接指向正确页面
5. 桌面端、平板端和手机端无溢出、错位和异常空白
6. 无未使用的旧样式或明显重复 CSS
7. 项目页、简历页和其他页面不受影响

## 验证命令

```bash
npm run validate:content
npm run check:privacy
npm run build
```

## 完成报告

报告：
- 修改了哪些文件
- 首页结构发生了什么变化
- 响应式布局如何处理
- 删除了哪些废弃代码
- 三条检查命令的执行结果
- 是否存在仍需人工确认的视觉问题

## Codex 验收记录

- 业务 Diff 仅涉及 `src/pages/index.astro` 与 `src/styles/global.css`，符合授权范围。
- 旧 `.hero-system`、`.capability-grid` 和 “Product delivery path” 已从源码与构建产物移除。
- 首页只有一个 `#capabilities`，保留四项能力及原项目证据链接，锚点具有 `scroll-margin-top: 100px`。
- `git diff --check` 通过。
- `npm run build` 通过：内容与隐私检查通过，Astro 0 errors、0 warnings、0 hints，共生成 7 个页面。
- 浏览器实测：
  - 桌面端：左右双栏，能力卡片 2×2，无横向溢出。
  - 900px：上下布局，能力卡片保持 2×2，无横向溢出。
  - 320px：能力卡片单列，无横向溢出或异常空白。
  - 控制台无 error 或 warning。
- 非阻塞观察：320px 下卡片内证据链接仍沿用原文本链接形态，点击区域高度约 21px；本次迁移未造成退化，不扩大当前任务处理。
- 验收结论：`APPROVED`。
