---
title: AI 实习求职雷达
slug: jobmatchai
summary: 面向中文 AI 实习求职流程的 Chrome 扩展 Alpha，完成 BOSS 岗位采集、判重、多目标管理、Agent 分批筛选与人工确认沟通。
status: alpha
featured: true
priority: 3
role: 产品设计 · Agent 协作开发与验收
startDate: 2026-06-01
lastUpdated: 2026-07-24
gallery: []
tags:
  - Chrome MV3
  - Agent Workflow
  - Job Data
  - Human-in-the-loop
problem: 手工复制 BOSS 岗位、公司、薪资和 HR 信息耗时；重复岗位容易被反复采集和分析；不同求职方向共用岗位池会造成筛选与导出串批；数十个完整 JD 一次交给 Agent 会造成上下文过长；自动生成简历内容存在技能、数字和职责夸大风险；自动发送消息存在误发和平台风控风险。
targetUsers:
  - 中文 AI 实习求职者（当前主要用户是项目发起者本人，尚无用户规模验证）
responsibilities:
  - 从个人求职流程定义采集、判重、分目标、Agent 筛选和人工沟通范围
  - 设计多目标归属、目标内计次、Agent Pack 与 HR 活跃度独立维度
  - 约束招呼语只填入草稿、简历基于母版修改、不自动投递
  - 组织 Codex/Claude Code 任务拆解、审查、修复和验收
keyDecisions:
  - 从自动投递收缩为"采集—筛选—人工决策"半自动工作台
  - 多求职目标独立管理，同一岗位全局判重、目标内独立计次和导出
  - Agent Pack 每批 ≤8 岗、含 manifest、内容哈希与结果 Schema，降低长上下文压力
  - 招呼语只填入聊天框草稿、简历基于母版修改，不自动发送或投递
architecture: |
  Chrome Extension Manifest V3
  → Content Script + Shadow DOM 侧边栏
  → Background Service Worker
  → chrome.storage.local / downloads / runtime messaging
  → BOSS API 优先采集 + DOM 降级解析
  → JSON / Markdown / Agent ZIP
evaluation: 18 个测试文件、263/263 项自动化测试通过，全部跟踪 JS/MJS 语法检查通过，Manifest 引用 21 个运行时文件缺失 0。自动测试使用模拟 DOM/API 数据，本轮未在实时 BOSS 页面复测；没有匹配准确率、节省时间、回复率、面试或 Offer 数据。
results:
  - 18 个测试文件、263/263 项自动化测试通过，全部跟踪 JS/MJS 语法检查通过。
  - BOSS detail/list API 优先、DOM 降级采集；用强标识和回退键全局判重，并按求职目标隔离计次与导出。
  - Agent Pack 默认每批最多 8 岗、约 1.5 万字符，包含 manifest、内容哈希和结果 Schema；沟通只填入草稿，由用户确认发送。
badCases:
  - 本轮未在实时 BOSS 页面复测，页面或接口变化可能导致字段缺失。
  - AI 七维评分没有人工标注集、面试结果或一致性评测。
  - 简历补丁校验只能拦截新增数字和部分职责升级，不能识别全部语义造假。
  - 最新版本尚未同步全部远端提交，也没有 Chrome Web Store 发布证据。
nextSteps:
  - 完成最新 BOSS 页面人工 smoke test。
  - 同步最新本地提交并形成可复现版本。
  - 用脱敏导出或使用日志验证真实去重数量、筛选结果和人工耗时。
  - 保持半自动路线，不把自动投递或自动发送作为下一阶段目标。
draft: false
---

<section id="snapshot">

## 30 秒摘要

AI 实习求职雷达是一个本地可运行、可演示的 Chrome 扩展 Alpha，不是自动投递系统，也没有 Chrome Web Store 发布证据。它面向中文 AI 实习求职者，完成 BOSS 岗位采集、判重、多目标管理、Agent 分包筛选和人工确认沟通。核心价值来自采集效率、数据结构设计、安全边界和可验证测试，而不是自动化程度。

</section>

<section id="context">

## 背景与目标

中文 AI 实习求职者在 BOSS 直聘上的工作流与美区 ATS（Applicant Tracking System）工具明显不同：岗位信息分散在搜索结果、详情页和聊天会话中，没有标准化 API 导出；不同求职方向（算法、产品、开发）的筛选标准和沟通策略不同，但岗位池容易混合；通用 AI 求职工具面向英文简历和 ATS 优化，不解决中文实习场景的采集、判重和分批筛选问题。

当前真实主要用户是项目发起者本人，尚无用户规模和商业化证据。目标不是做一个"自动投递机器人"，而是建立一条可验证的"采集→筛选→人工决策"半自动工作流。

### 我的职责

- 从个人求职流程定义采集、判重、分目标、Agent 筛选和人工沟通范围
- 设计多目标归属、目标内计次、Agent Pack 与 HR 活跃度独立维度
- 约束招呼语只填入草稿、简历基于母版修改、不自动投递
- 组织 Codex/Claude Code 任务拆解、审查、修复和验收

</section>

<section id="research">

## 调研与关键洞察

梳理中文 AI 实习求职的真实 BOSS 使用流程后，形成以下关键洞察：

1. **招聘方活跃度是联系机会，不等于岗位匹配度。**HR 最近活跃说明对方更可能查看消息，但这与岗位是否适合求职者是两个独立维度。将活跃度与匹配评分分开，避免招聘方行为污染岗位适配判断。

2. **多目标需要共享全局岗位实体，但独立记录目标内计次和导出。**同一个 AI 实习岗位可能同时适合"算法"和"产品"两个方向，应在全局只存一份岗位数据，但分别为每个目标记录采集次数和筛选结果。

3. **完整 JD 应分批交给 Agent，并使用哈希与 Schema 对应结果。**数十个完整 JD 一次性交给 Agent 会造成上下文过长、结果难以对应。每批 ≤8 岗、含内容哈希和结构化 Schema 的分包策略，既能控制上下文长度，也能将模型输出与具体岗位精确对应。

4. **AI 简历与沟通内容必须经过事实约束和人工确认。**不把缺失技能注入简历，不自动发送消息，不把 AI 生成的沟通内容直接投递——每一条 AI 产出都必须经过人工确认才能进入真实求职流程。

</section>

<section id="reframe">

## 重新定义问题

原问题：如何做一个自动投递工具？

重新定义后：如何构建一个"采集—筛选—人工决策"的半自动求职工作台，让求职者能高效采集和结构化岗位信息，由 Agent 辅助筛选和生成沟通草稿，但始终由人做出最终决策？

</section>

<section id="solution">

## 方案与关键决策

### 决策一：BOSS API 优先、DOM 降级

在 Content Script 的 MAIN world 包装 `fetch` 和 `XMLHttpRequest`，优先读取 BOSS detail/list API 响应获取结构化岗位数据。当 API 不可用或返回异常时，使用 DOM 选择器降级解析页面元素。API 内存缓存最多保留 30 条记录。

### 决策二：强标识与回退键全局判重

用 `jobId`、`securityId`、`lid` 作为强标识判重；当这些字段缺失时，回退到公司、岗位、城市组合键。同一岗位全局只保留一条记录，避免同一 JD 被反复采集和分析。

### 决策三：多求职目标归属、目标内计次和目标级导出

同一岗位可归属到多个求职目标，全局只存一份岗位实体。每个目标独立记录采集次数，导出 JSON、Markdown 或 Agent ZIP 时只包含当前目标内的岗位，不混入其他目标的数据。

### 决策四：Agent Pack 分批控制上下文

默认每批最多 8 岗、约 1.5 万字符。每批包含 `manifest.json`、`START_HERE.md`、评分规则、批次岗位文件、结果 Schema。使用 `recordId` 和 8 位 `contentHash` 支持结果对应和增量跳过。ZIP 最多 100 个文件、总文本上限 800 万字符，并检查危险路径。外部 Codex/Claude 分批读取岗位并输出评分结果；扩展本身不会启动 Agent。

### 决策五：五项硬过滤、七维评分、前端重算总分

硬过滤覆盖毕业年份、学历、城市、实习时长和招聘状态五项，参数来自用户配置。未配置时标记为不确定，不直接拒绝。AI 七维评分总计 100 分，前端独立重新计算分数和等级，不直接信任模型返回的总分。

### 决策六：招呼语草稿、简历母版、人工发送

招呼语先生成草稿、允许编辑、只填入聊天框、不触发发送按钮。聊天会话与岗位不一致时拒绝填入。简历基于 DOCX 母版应用人工勾选的补丁，不直接由 AI 从头生成。补丁校验拦截新增数字和从"参与"升级为"主导"等职责夸大。

### 被放弃的方向

- 无人值守自动投递——安全风险和责任边界不可接受
- 自动发送 BOSS 消息——存在误发和平台风控风险
- 把缺失技能注入简历——与真实求职伦理冲突
- 第一阶段同时适配牛客、力扣等站点——优先做通 BOSS 主流程

### 项目起点与改造边界

项目最初采用 JobMatchAI 已有的 Chrome 扩展框架、AI 提供商调用和简历解析基础。围绕中文 AI 实习流程重构或新增了 BOSS 采集、HR 活跃度、判重、多目标、Agent Pack、中文硬过滤、人工发送边界与测试治理。参考 boss-auto-greeting 的活跃度解析和聊天框填入行为，但没有采用自动打招呼产品定位。

</section>

<section id="architecture">

## 系统架构

```text
Chrome Extension Manifest V3
→ Content Script + Shadow DOM 侧边栏
→ Background Service Worker
→ chrome.storage.local / downloads / runtime messaging
→ BOSS API 优先采集 + DOM 降级解析
→ JSON / Markdown / Agent ZIP
```

- **Content Script**：在 MAIN world 拦截 BOSS API 响应，注入 Shadow DOM 侧边栏，处理用户交互和 DOM 降级解析
- **Background Service Worker**：管理 `chrome.storage.local` 中的岗位记录、求职目标、简历数据和用户配置
- **通信**：Content Script 与 Background SW 通过 `chrome.runtime.sendMessage` 通信
- **导出**：通过 `chrome.downloads` API 导出 JSON、Markdown 和 Agent ZIP 文件
- **简历解析**：使用 PDF.js 和 Mammoth 提取 PDF/DOCX 文本，由配置的 AI 模型解析为结构化资料
- **Agent 协作**：外部 Codex/Claude 分批读取 Agent ZIP 中的岗位并输出评分结果，扩展本身不会启动外部 Agent

</section>

<section id="validation">

## 验证与当前结果

| 指标 | 结果 | 说明 |
|---|---|---|
| 自动化测试 | 18 文件、263/263 通过 | 本轮 `npm test` 实际运行 |
| JS/MJS 语法检查 | 全部通过 | 本轮 `node --check` 实际运行 |
| Manifest 引用 | 21 个运行时文件，缺失 0 | 本轮 Manifest 引用检查 |
| 硬过滤测试 | 17 项通过 | 覆盖毕业年份、学历、城市、实习时长、招聘状态 |
| BOSS 解析与判重测试 | 9 项通过 | 覆盖 API 解析、DOM 降级、强标识与回退键判重 |
| 招呼语安全测试 | 3 项通过 | 覆盖事实约束、会话校验、不自动发送 |
| 简历补丁安全测试 | 5 项通过 | 覆盖数字拦截、职责升级拦截 |

重要限制：
- 自动测试使用模拟 DOM/API 数据，本轮没有实时 BOSS 页面 smoke test
- 没有匹配准确率、节省时间、回复率、面试或 Offer 数据
- AI 七维评分依赖模型判断，没有真实面试结果或人工标注集验证

</section>

<section id="bad-cases">

## Bad Case

- **API/DOM 变化风险**：BOSS 页面或接口变化可能导致字段缺失。本轮仅在模拟数据上验证，未在实时 BOSS 页面复测——这是当前最大的可靠性风险。
- **评分无真实标签**：AI 七维评分没有人工标注集、面试结果或一致性评测，不能写成"提升匹配准确率"。
- **简历语义造假无法完全识别**：补丁校验器只能拦截新增数字和部分职责升级（如"参与→主导"），不能识别新技能或全部语义造假。AI 输出仍必须人工核对。
- **会话与岗位不一致时拒绝填入**：当用户在当前聊天页面打开的不是对应岗位的会话时，扩展拒绝填入招呼语——这是设计上的安全约束，但也可能在多标签页场景下增加操作步骤。

</section>

<section id="reflection">

## 复盘与下一步

这个项目的产品价值来自范围控制、数据结构设计、人工确认节点和风险边界，而不是自动化程度。把产品从"自动投递"收缩到"采集—筛选—人工决策"，反而让每一步都可验证、可审计、可信任。Agent 的角色是辅助筛选和生成草稿，最终决策始终由人完成。

下一步优先级：
1. 完成最新 BOSS 页面人工 smoke test，验证当前选择器在真实页面上的可用性
2. 同步最新本地提交并形成可复现版本
3. 用脱敏导出或使用日志验证真实去重数量、筛选结果和人工耗时
4. 保持半自动路线，不把自动投递或自动发送作为下一阶段目标

</section>
