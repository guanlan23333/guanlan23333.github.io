# 架构建议

## 结论

采用 Astro + TypeScript + 原生 CSS + Content Collections + Markdown/MDX 的静态站点。内容和页面组件分离；项目新增、更新和排序不需要修改页面代码。

## 运行结构

```text
Markdown / MDX
      │
      ▼
Astro Content Collections ── Schema 构建校验
      │
      ├── 首页精选项目与最近更新
      ├── 项目列表
      └── 动态项目详情页
      │
      ▼
标准静态 HTML / CSS / 图片
      │
      ├── GitHub Pages
      └── 国内静态托管（后续迁移）
```

## 推荐目录

```text
/
├── .github/workflows/deploy.yml
├── public/
│   ├── favicon.svg
│   ├── images/projects/
│   ├── resume/guo-nanyan-resume.pdf
│   ├── robots.txt
│   └── social-card.png
├── scripts/
│   ├── new-project.mjs
│   ├── new-update.mjs
│   ├── validate-content.mjs
│   └── check-privacy.mjs
├── src/
│   ├── components/
│   │   ├── Button.astro
│   │   ├── CapabilityCard.astro
│   │   ├── ContactCTA.astro
│   │   ├── EvidenceStat.astro
│   │   ├── ImageGallery.astro
│   │   ├── ProjectCard.astro
│   │   ├── ProjectTOC.astro
│   │   ├── SectionHeading.astro
│   │   ├── StatusBadge.astro
│   │   ├── Tag.astro
│   │   └── UpdateTimeline.astro
│   ├── content/
│   │   ├── projects/
│   │   │   ├── secondbrain.md
│   │   │   ├── merchantops.md
│   │   │   └── jobmatch-ai.md
│   │   ├── updates/
│   │   └── config.ts
│   ├── data/
│   │   ├── navigation.ts
│   │   ├── profile.ts
│   │   ├── skills.ts
│   │   └── social-links.ts
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── ProjectLayout.astro
│   ├── pages/
│   │   ├── projects/[slug].astro
│   │   ├── projects/index.astro
│   │   ├── 404.astro
│   │   └── index.astro
│   └── styles/global.css
├── astro.config.mjs
├── package.json
└── tsconfig.json
```

## 页面职责

- `index.astro`：只编排首页区块，从内容集合读取精选项目和证据。
- `projects/index.astro`：读取全部非草稿项目并按优先级/更新时间排序。
- `projects/[slug].astro`：基于统一案例布局生成详情页。
- `ProjectLayout.astro`：承载案例目录、锚点、上下篇导航和详情 CTA。
- `src/content`：保存经常更新的业务内容。
- `src/data`：保存低频更新的个人资料、导航和能力映射。
- `scripts`：只处理内容模板、结构校验和隐私扫描。

## 设计系统方向

- 浅色背景、深灰文字、单一冷色强调色。
- 系统字体栈，不请求外部在线字体。
- 大标题、大留白、清晰网格，项目截图作为主要视觉来源。
- 动效仅用于必要反馈，并尊重 `prefers-reduced-motion`。
- 组件保持展示型、无客户端状态；移动导航优先原生 HTML/CSS。

## 关键质量约束

- 静态 HTML 保留全部核心内容，JavaScript 失败不影响阅读。
- 图片本地化、明确尺寸、非首屏懒加载。
- 键盘可达、可见焦点、触控目标足够大、对比度合格。
- 构建时阻止缺字段、重复 slug、错误 URL、缺失图片和草稿泄漏。
- GitHub Pages 仅负责托管构建产物，不进入页面业务逻辑。

