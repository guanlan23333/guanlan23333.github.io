# TASK-014-IMPLEMENT：同步四个项目档案到个人网站

状态：`APPROVED`

## 目标

依据 2026-08-01 的四份项目档案，将最新、可公开、可验证且已脱敏的信息同步到网站。只更新现有内容模型能够表达的内容；不修改页面结构、组件、样式、配置、Schema 或依赖。

本任务覆盖：

1. 更新 SecondBrain Desktop。
2. 更新 AI 实习雷达。
3. 更新 MerchantOps Copilot，并将状态从 `testing` 降为 `alpha`。
4. 新增 E-commerce After-Sales Agent，明确它仍是数据库基础阶段。
5. 新增四条项目更新记录。
6. 将站点公开内容更新时间更新为 2026-08。

## 执行前要求

执行者必须重新从磁盘读取：

- `TASK.md`
- 本任务文件
- `AGENTS.md`
- `CLAUDE.md`
- `CONTENT_MODEL.md`
- `src/content.config.ts`
- `src/data/profile.ts`
- `src/content/projects/`
- `src/content/updates/`
- 当前 Git 状态与已有变更

不得依赖会话中的旧任务或旧项目事实。

## 用户已确认的公开职责

四个项目均可写入以下本人职责：

- 产品定义
- 研究与流程设计
- 架构决策
- 代码实现或 AI 协作开发
- 测试与验收

不得写入发布运营、商业运营、真实用户增长或其他未确认职责。

所有公开文案必须脱敏，不得出现本地绝对路径、账号、内部身份信息、真实业务数据、凭证或未公开服务配置。

## 允许修改

- `src/content/projects/secondbrain.md`
- `src/content/projects/jobmatchai.md`
- `src/content/projects/merchantops.md`
- `src/content/projects/ecommerce-after-sales-agent.md`（新增）
- `src/content/updates/2026-08-01-secondbrain-workbench.md`（新增）
- `src/content/updates/2026-08-01-jobmatchai-verification.md`（新增）
- `src/content/updates/2026-08-01-merchantops-evidence-audit.md`（新增）
- `src/content/updates/2026-08-01-after-sales-database-foundation.md`（新增）
- `src/data/profile.ts`

除上述文件外一律不得修改。不得复制或新增图片、视频、二进制文件。

## 全局写作边界

1. 严格区分：已实现、已测试、部分实现、仅规划、尚未验证。
2. 不得把历史测试结果写成本次验证结果。
3. 不得编造用户数、准确率、效率提升、业务成果、上线状态、真实用户验证或独立开发比例。
4. 不得把目标架构写成当前已运行架构。
5. 不得使用“从零开发”“完全自主研发”“生产可用”“已经上线”等无证据表述。
6. 保留项目正文现有 HTML section 包装方式和统一二级标题结构；允许按本任务事实替换段落、表格和列表。
7. URL 字段没有已确认公开地址时保持缺省，不写占位 URL。
8. `gallery` 保持空数组，不新增 `coverImage`。
9. 所有项目 `draft: false`。

## 一、SecondBrain Desktop

### Frontmatter 精确要求

- `title: SecondBrain Desktop`
- `slug: secondbrain`
- `status: alpha`
- `featured: true`
- `priority: 1`
- `role: 产品定义 · 研究与流程设计 · 架构决策 · AI 协作开发 · 测试与验收`
- `startDate: 2026-03-01`
- `lastUpdated: 2026-08-01`
- `gallery: []`
- 标签以已实现技术和产品能力为准，可使用：`Local-first`、`Tauri`、`Knowledge Workflow`、`Human-in-the-loop`、`FSRS`

摘要必须表达：本地优先 Windows 学习环境；音视频/转录资料进入 Obsidian 兼容 Markdown 工作台；已形成渐进阅读、FSRS 复习、来源引用问答和费曼式追问；当前仍是 Alpha。

### 必须写入的已实现事实

- 本地媒体、已有转录文本及 B 站内容摄入代码。
- 任务状态、失败重试、中断恢复和产物谱系。
- Obsidian 兼容 Markdown 工作台。
- Wikilink、别名、反链、搜索、Outline 和导航历史。
- 标签页恢复、安全自动保存、Command Palette、Wikilink 预览。
- 本地图片读取与剪贴板 PNG 导入。
- Topic/Extract 渐进阅读和 Today 队列。
- CardDraft 审核和内置 FSRS 复习。
- 带精确 Markdown 引用的问答。
- 费曼式追问及经用户确认后将薄弱点转为学习项。

### 必须标为部分实现

- Anki TSV 与 AnkiConnect 兼容链：有代码、测试和确认门，未完成真实 Anki 桌面端全链路验收。
- Windows 安装与发布：已有 Tauri/NSIS 配置，当前安装器、升级、首次设置、签名和发布门未验收。

### 必须标为仅规划或未实现

- MCP、Agent Dock、通用 Agent 写入。
- 完整 Properties、标签、文件移动/删除、分栏、Graph、Canvas 和 Obsidian 插件生态。
- Windows Credential Manager。

### 验证结果精确要求

必须同时写清：

- 2026-08-01 当前可收集 856 项 Python 测试；只证明可收集。
- Python 全量测试本次未完成：315 项先通过，余下项目因沙箱临时目录权限在 setup 阶段受阻；不得解释为业务失败或全量通过。
- 37 项调度/复习测试通过。
- 19 个前端纯逻辑测试脚本通过。
- TypeScript 静态检查通过。
- 最新 HEAD 的 React/Vite 生产构建、Rust 测试、Tauri GUI、模型/B 站/BcutASR/Whisper/AnkiConnect 均未在本次运行。
- 2026-07-29 的 `845 passed / 6 skipped` 只能作为历史记录，且早于最新工作台提交。

删除旧的“550 项 Python 测试通过、Rust 与生产构建通过”当前基线。

### Bad Cases

至少覆盖：

- 外部修改触发 expected-hash 冲突时拒绝覆盖。
- 尚未写盘的草稿在崩溃时可能丢失。
- 模型伪造引用会被证据 ID 和哈希校验拒绝，但不能证明模型解释一定正确。
- 语义模型或索引不可用时回退词法检索。
- JSON 学习状态尚无大规模验证。
- 第三方服务可能失效。
- 当前工作台不是完整 Obsidian 替代品。

### 下一步

第一优先级是使用脱敏 disposable Vault 完成当前 HEAD 的完整 Tauri 桌面验收。不得再把渐进阅读、FSRS、RAG 或费曼流程写成下一步功能。

## 二、AI 实习雷达

### Frontmatter 精确要求

- 保留 `title: AI 实习求职雷达`
- `slug: jobmatchai`
- `status: alpha`
- `featured: true`
- `priority: 2`
- `role: 产品定义 · 研究与流程设计 · 架构决策 · AI 协作开发 · 测试与验收`
- `startDate: 2026-04-01`
- `lastUpdated: 2026-07-21`
- `gallery: []`

摘要必须表达：本地 Chrome MV3 扩展；面向中文 AI 实习求职；覆盖 BOSS 岗位采集、判重、多目标、结构化简历、硬过滤、AI 分析和批量导出；发送与提交始终由用户确认；当前为 Alpha。

### 已实现事实

- BOSS 岗位详情与列表采集，API 优先、DOM 降级。
- `jobId/securityId/lid` 强标识判重及公司/岗位/城市回退键。
- 多求职目标创建、切换、归档和岗位归属。
- JSON、Markdown、Agent ZIP 导出。
- 3 个结构化简历槽，支持 PDF/DOCX 文本解析；扫描 PDF 无 OCR。
- 五项硬过滤。
- 七维 AI 匹配评分和前端重算总分；不得声称准确率已验证。
- BOSS 招呼语生成、复制和草稿填入；不自动发送。

### 部分实现

- 申请表 Q&A 与辅助填入：有预览和敏感字段排除，但未完成跨站验证。
- DOCX 简历补丁：可修改已有母版，事实校验只能拦截新增数字和部分职责升级。

### 仅规划

- 唯一可写的统一求职台账和完整进展历史。
- 正式分析结果导入、SHA-256 协议、今日行动、跟进和漏斗。

### 验证结果

- 2026-08-01：18 个测试文件、263/263 项通过。
- 49 个 JS/MJS 文件语法检查通过。
- Manifest 21 个唯一运行时引用，缺失 0。
- 没有构建、lint 或 typecheck 命令。
- 没有执行真实 Chrome/BOSS Smoke Test。
- 没有匹配准确率、节省时间、回复率、面试或 Offer 数据。

### Bad Cases

至少覆盖：

- BOSS DOM/API 变化可能导致字段缺失。
- 岗位移出最后一个目标时，当前实现会删除对应记录。
- 采集、收藏和投递仍有多套数据视图。
- Agent ZIP 只有 8 位内容哈希，没有正式结果导入和过期判断。
- 扫描 PDF 无 OCR。
- 本地简历及 AI 配置存于 `chrome.storage.local`，未加密。
- AI 生成文本和简历补丁不能覆盖全部事实风险。

### 下一步

- 使用虚构或脱敏数据完成真实 Chrome/BOSS Smoke Test。
- 先完成统一台账内核，不提前把后续模块写成现有能力。
- 保持半自动路线，不增加自动发送或自动投递表述。

公开 GitHub 地址本轮不要写入：公开版本是否包含当前本地提交尚未验证。

## 三、MerchantOps Copilot

### Frontmatter 精确要求

- `title: MerchantOps Copilot`
- `slug: merchantops`
- `status: alpha`
- `featured: true`
- `priority: 3`
- `role: 产品定义 · 研究与流程设计 · 架构决策 · AI 协作开发 · 测试与验收`
- `startDate: 2026-03-01`
- `lastUpdated: 2026-07-30`
- `gallery: []`
- 标签只使用已有实现：`Python`、`FastAPI`、`Streamlit`、`MySQL`、`Redis`、`SQLGlot`

摘要必须表达：面向中小电商经营运营负责人；把只读经营数据查询和企业知识检索放进同一分析流程；展示 SQL、口径、日期范围、引用和风险；当前是本地 Alpha，开放问题、真实模型、部署及用户价值未验证。

### 已实现事实

- 固定 admin/analyst/viewer 三角色登录。
- 固定模拟数据经营驾驶舱。
- `.md/.txt/.pdf` 知识导入和关键词检索；不是语义 RAG，扫描 PDF 无 OCR。
- SQL 安全边界：SQLGlot、表字段白名单、强制行限制和只读账户设计；账户权限本次未复测。
- 执行 Trace。
- Redis 缓存和限流代码。
- 30 题固定评测工件存在。

### 部分实现

- 自然语言数据查询：本地模式主要覆盖固定问题模板。
- 数据与知识联合分析：两工具串行执行，三个核心场景主要使用手写组合逻辑。
- 证据、风险和图表展示：缺少统一结果 Contract 和独立 evidence guard。
- Dify：只有可解析 DSL，未在真实工作区导入运行。

### 仅配置或仅规划

- Docker/Caddy 只有配置，未在 Docker/Linux 实跑。
- LangGraph、轻量语义 RAG、统一结果 Contract、公开 HTTPS 均未实现。

### 验证结果精确要求

2026-08-01 本次验证：

- `git diff --check` 通过。
- 25 个 Python 文件静态语法解析通过。
- 6 个 JSON/Dify 工件解析通过。
- MySQL、Redis、FastAPI、Streamlit 四个服务端口均未监听。
- pytest、30 题评测、Docker 和 UI 走查均未运行。

历史结果必须单独标注：

- 2026-07-22 文档记录隔离环境中 55 项 pytest 通过。
- 2026-07-22 固定 30 题规则模式结果全部通过。
- 历史压测：20 VU P95 3.17 秒，未达到 3 秒目标；50 VU P95 5.05 秒，达到后来冻结的 6 秒目标。
- 历史结果不能代表开放问题、真实模型或公开环境。

删除旧的“本轮 55 项可收集、25 项通过”表述，不得继续使用 `testing` 状态。

### Bad Cases

至少覆盖：

- 开放式问题可能超出固定 SQL 模板。
- 关键词检索可能漏召回复杂同义表达。
- 混合流程串行执行，缺少通用证据守卫。
- 三个固定场景之外的自然语言结论不完整。
- 文档冲突或过期时缺少人工确认流程。
- MySQL/Redis 不可用时完整查询无法运行。
- 高并发历史结果未达到原 3 秒目标。
- 大量能力仍位于未提交工作区，缺少稳定版本锚点。

### 下一步

先恢复隔离 MySQL/Redis 环境并重新执行现有测试、危险 SQL 和 30 题评测；之后再决定是否迁移 LangGraph。不得把线上部署、Dify 实跑或用户验证写成已完成。

## 四、E-commerce After-Sales Agent

新增 `src/content/projects/ecommerce-after-sales-agent.md`。

### Frontmatter 精确要求

- `title: E-commerce After-Sales Agent`
- `slug: ecommerce-after-sales-agent`
- `status: development`
- `featured: false`
- `priority: 4`
- `role: 产品定义 · 研究与流程设计 · 架构决策 · AI 协作开发 · 测试与验收`
- `startDate: 2026-03-01`
- `lastUpdated: 2026-07-30`
- `gallery: []`
- 标签只使用已实现技术：`Python`、`PostgreSQL`、`psycopg`、`SQL`、`unittest`
- `draft: false`

摘要必须明确：目标是面向单一服饰 Shopify 商家的售后 Agent；当前只有产品边界、架构决策、PostgreSQL 初始 Schema 和迁移测试；没有可运行客户门户、AI 编排或真实外部集成。

### 当前已实现或部分实现

- 8 项已接受的产品和架构决策。
- 1 个 PostgreSQL 初始迁移，包含 8 张受约束的表。
- Python SQL 迁移执行器；没有迁移版本账本。
- 数据库非空、枚举、外键、正整数和唯一约束。
- 统一 `MIGRATION_FAILED` 迁移错误。

以上工程能力应标为“部分实现”，不得写成完整售后业务能力。

### 仅规划或尚未实现

- Shopify 登录、订单和物流读取。
- 确定性退货资格、状态声明、确认和 Return Request。
- DeepSeek 对话编排。
- Chatwoot Human Handoff。
- Support Portal、FastAPI 页面和应用入口。
- Docker Compose 和端到端演示。

### 验证结果

- 2026-08-01：5/5 数据库集成测试通过，连接隔离 PostgreSQL 测试环境。
- Python 3.13.13 和 psycopg 3.3.4 可用。
- `pip check` 通过。
- pytest 和 Ruff 未安装，相关检查未执行。
- Docker 命令不可用，仓库也没有 Compose 文件。
- Shopify、DeepSeek、Chatwoot 测试均未运行。
- 完整业务工作流为 0 个。

### Bad Cases

至少覆盖：

- 没有 Web 入口，客户流程当前在第一步中断。
- 没有 Shopify、Chatwoot 或模型适配器。
- 迁移器每次执行全部 SQL，没有迁移版本账本。
- 原子状态更新、Confirmation 失效和单赢家幂等 claim 未实现。
- 只有审计表结构，没有审计脱敏器和金丝雀测试。
- 仓库没有 Commit、跟踪文件或远程仓库，不能证明发布版本。

### 下一步

只写当前最小目标：实现原子状态更新、Confirmation 失效和单赢家幂等 claim，并留下最小并发数据库测试。不要提前搭建完整应用或扩展目标架构。

### 正文结构

使用与现有三个项目一致的 section 结构，至少包含：30 秒摘要、背景与目标、我的职责、关键洞察、问题重定义、方案与关键决策、当前实际架构、验证结果、Bad Case、复盘与下一步。

必须明确区分当前实际架构：

```text
unittest 集成测试
→ Python 迁移器
→ psycopg
→ 隔离 PostgreSQL 测试 Schema
```

目标中的 Shopify、DeepSeek、Chatwoot 架构只能以“规划”描述。

## 五、四条更新记录

新增以下文件，均为 `draft: false`，正文只记录变化、验证边界、已知问题和下一步：

### `2026-08-01-secondbrain-workbench.md`

- `title: SecondBrain 工作台与学习闭环更新`
- `project: secondbrain`
- `date: 2026-08-01`
- 摘要说明已补充工作台、渐进阅读、FSRS、引用问答和费曼流程的最新证据，同时保留 GUI、外部服务和安装器未验收边界。
- evidence 可使用：`856 项测试可收集`、`37 项调度与复习测试通过`、`19 个前端逻辑脚本通过`、`TypeScript 检查通过`。

### `2026-08-01-jobmatchai-verification.md`

- `title: AI 实习雷达 Alpha 证据更新`
- `project: jobmatchai`
- `date: 2026-08-01`
- 摘要说明 263 项自动测试与运行时引用检查通过，但实时 BOSS 页面 Smoke Test 尚未完成。
- 不得将日期写成业务功能发布日期。

### `2026-08-01-merchantops-evidence-audit.md`

- `title: MerchantOps 证据边界更新`
- `project: merchantops`
- `date: 2026-08-01`
- 摘要说明项目状态调整为 Alpha，并区分本次静态检查与 2026-07-22 历史测试/评测。

### `2026-08-01-after-sales-database-foundation.md`

- `title: 售后 Agent 数据库基础完成`
- `project: ecommerce-after-sales-agent`
- `date: 2026-08-01`
- 摘要说明 PostgreSQL 初始迁移和 5 项数据库测试通过，同时明确业务流程与外部集成尚未实现。

## 六、站点更新时间

仅将 `src/data/profile.ts` 中：

```ts
siteUpdated: '2026-07'
```

改为：

```ts
siteUpdated: '2026-08'
```

其他个人资料字段不得修改。

## 禁止事项

- 不修改 `src/pages/`、`src/components/`、`src/layouts/`、`src/styles/`。
- 不修改 `src/content.config.ts`、`CONTENT_MODEL.md`、`package.json` 或任何配置。
- 不新增依赖、页面、组件、Schema、排序逻辑或筛选逻辑。
- 不新增或复制图片、视频、PDF、二进制 Demo。
- 不读取或展示 `.env`、凭证、Token、密码、私钥或账号配置。
- 不写本地绝对路径。
- 不修改治理文档、其他任务文件或用户已有变更。
- 不提交、不推送、不发布。

## 验收标准

1. 四个项目均能通过现有 Content Collection Schema。
2. 首页代表项目顺序为 SecondBrain、AI 实习雷达、MerchantOps；售后项目不进入首页。
3. SecondBrain 不再把已实现的渐进阅读、FSRS、引用问答和费曼流程写成规划。
4. SecondBrain 不再使用旧的 550 项测试作为当前基线。
5. MerchantOps 状态为 `alpha`，本次验证与历史结果明确分开。
6. AI 实习雷达不暗示实时 BOSS 页面或评分准确率已经验证。
7. 售后项目清楚说明完整业务工作流为 0，所有外部集成仅规划。
8. 四个项目职责只包含用户已确认的五类工作，不含发布运营。
9. 所有公开内容已脱敏，无本地绝对路径、凭证、真实业务数据或未经确认 URL。
10. 四条更新记录能够被内容校验读取。
11. `siteUpdated` 为 `2026-08`，其他 profile 字段不变。
12. 除允许文件外没有新增业务 Diff。

## 验证命令

依次运行：

```bash
npm run validate:content
npm run check:privacy
npm run build
git diff --check
git status --short
```

## 完成报告

报告必须包含：

- 实际修改和新增的文件。
- 每个项目的状态、日期和主要事实变化。
- 哪些历史表述被删除或降级。
- 四条更新记录是否进入构建。
- 全部验证命令的实际结果。
- 是否发现敏感信息或本地路径。
- 是否存在偏差、未完成项或需要人工确认的问题。

不得声称 Codex 已验收，不得提交或推送。

## Codex 验收记录

- 实际业务 Diff 仅涉及任务授权的 4 个项目文件、4 个更新文件和 `src/data/profile.ts`；未修改页面、组件、样式、配置、Schema 或依赖。
- 首页代表项目顺序为 SecondBrain、AI 实习雷达、MerchantOps；售后项目仅出现在完整项目列表。
- 四个项目均按已实现、部分实现、仅规划和尚未验证划分事实，职责只包含用户确认的五类工作。
- `npm run validate:content` 通过：4 个项目，slug 唯一，字段完整。
- `npm run check:privacy` 通过：扫描 12 个公开内容文件。
- `npm run build` 在受限沙箱内因 Astro 子进程 `spawn EPERM` 失败；获准在沙箱外复跑后通过，Astro 0 errors、0 warnings、0 hints，共生成 8 个页面，内部链接、静态资源、404 与首页 CTA 检查通过。
- `git diff --check` 通过；未提交、未推送、未发布。
- 验收结论：`APPROVED`。
