---
title: SecondBrain Desktop
slug: secondbrain
summary: 本地优先 Windows Alpha，将课程视频、转录文本和 Markdown 资料转为可追溯、可链接、可审核的知识资产。
status: alpha
featured: true
priority: 1
role: 产品定义 · AI 协作开发与验收
startDate: 2026-07-02
lastUpdated: 2026-07-24
gallery: []
tags:
  - Local-first
  - Tauri
  - Knowledge Workflow
  - Human-in-the-loop
problem: 课程视频、B站内容和转录文本分散，获取、转录、整理需要多个工具；AI 生成笔记缺少来源和人工审核节点；Markdown 搜索、双链和回源链路分散。
targetUsers:
  - 需要处理课程视频、转录文本和 Markdown 资料的个人学习者
responsibilities:
  - 定义摄入、知识工作台、渐进阅读与复习的产品路线
  - 设计人工审核、来源追踪、哈希保护与安全写入等核心边界
  - 将需求拆解为 AI Agent 可执行任务，提供体验反馈与验收
  - 建立 Python、前端、TypeScript、Rust 统一验证脚本
keyDecisions:
  - 用户可停在转录、笔记或卡片任一阶段，不强制走完全流程
  - AI 结果必须显式发布，不得静默写入外部工具
  - Wikilink 采用两阶段创建，先显示未解析状态再确认
  - 数据安全优先于完全复制 Obsidian 交互
architecture: Tauri 2 + React + TypeScript → Rust async commands → Python CLI/core → JSON + Markdown
evaluation: 以 550 项 Python 测试通过、TypeScript 与 Rust 构建通过、前端逻辑测试通过作为 Alpha 验证基线；GUI、真实外部服务和安装器尚未验收。
results:
  - 本地可运行的 Windows Alpha，形成 Tauri 桌面端、Markdown 双链工作台和 CardDraft 审核链路
  - 支持 7 种媒体和 4 种文本输入，持久化任务支持失败重试与中断恢复
  - 550 项 Python 测试通过、5 项因 Windows 符号链接权限跳过；TypeScript、Rust 与生产构建通过
badCases:
  - 外部 ASR、大模型、B站接口和 AnkiConnect 可能失败，需任务状态、错误脱敏和重试机制保护
  - expected-hash 不一致时拒绝覆盖外部修改，保留冲突版本供人工合并
  - 中文输入法与原生拖放在 WebView 中存在兼容问题
nextSteps:
  - 完成真实 GUI、外部服务和安装器验收
  - 推进渐进阅读与复习闭环（Topic、FSRS、Review Event）
  - RAG、MCP、教师 Agent、费曼 Agent 尚未实现，仅在产品方向规划中
draft: false
---

<section id="snapshot">

## 30 秒摘要

SecondBrain Desktop 是一个本地知识处理与学习工作台，不是聊天机器人。它通过 Tauri 桌面端、Rust 异步命令和 Python 核心管线，将课程视频、转录文本和 Markdown 资料转化为可追溯来源、可双向链接、可人工审核的知识资产。当前是本地可运行的 Windows Alpha，不是已上线产品。

</section>

<section id="context">

## 背景与目标

课程视频、B站内容和转录文本分散在多个工具中。AI 生成的笔记和卡片容易丢失来源，结果缺少人工审核节点。普通 Markdown 虽可长期保存，但搜索、双链、回源和渐进加工链路分散。Obsidian 适合写作，但转录、任务恢复、CardDraft 和学习状态需要额外流程。

目标不是追求"一键生成"，而是建立一条本地优先的"摄入→审核→知识工作台→复习"闭环，让每一份 AI 产出都经过人工确认，每一步失败都可恢复。

### 我的职责

- 定义摄入→知识工作台→渐进阅读→复习→Agent 的完整产品方向
- 设计人工审核、来源追踪、哈希保护与安全写入等核心边界
- 将需求拆解为 AI Agent 可执行任务，提供体验反馈与验收
- 建立 Python、前端、TypeScript、Rust 统一验证脚本

</section>

<section id="research">

## 调研与关键洞察

对真实学习流程的梳理显示，核心问题不是"缺少 AI 摘要"，而是：

1. 材料加工过程缺少可追踪状态——用户不知道任务停在哪里
2. AI 结果缺少来源引用和人工确认节点，难以信任
3. 外部 ASR、大模型、B站接口和 AnkiConnect 都可能失败，需要恢复机制
4. 本地数据安全比追求完全自动化更重要

核心洞察：来源追踪、人工确认、恢复机制和本地数据安全，比"一键生成"更关键。模型负责结构化，人负责最终审核，系统负责状态、恢复与交付。

</section>

<section id="reframe">

## 重新定义问题

原问题：如何做一个 AI 转录工具？

重新定义后：如何为个人学习者构建一条本地优先的"摄入→审核→知识工作台→复习"闭环，让每一步都可追溯、可恢复、可独立使用？

</section>

<section id="solution">

## 方案与关键决策

### 决策一：用户可停在任一阶段

流程设计为可停在转录、AI 笔记或卡片任一阶段，产物均可独立使用，不强制走完全流程。转录结果可直接导出，AI 笔记可单独发布 Obsidian，卡片可筛选后推送 Anki。

### 决策二：AI 结果显式发布

AI 生成的笔记和卡片不会静默写入 Obsidian 或 Anki。用户审核后显式发布，外部写入必须经过确认，避免错误结果污染长期知识库。

### 决策三：Wikilink 两阶段创建

先显示未解析状态让用户预览目标笔记标题和路径，确认后再创建目标文件。减少误创建和确认摩擦，同时保持双链工作台的流畅性。

### 决策四：数据安全优先于交互完整

采用 Vault 路径越界拒绝、SHA-256 expected-hash 冲突保护、exclusive create 避免覆盖、系统回收站替代直接删除。优先保证数据不丢失，即使部分交互不如 Obsidian 完整。

### 被放弃的方向

- 黑盒一次生成：看似更短路径，但任务中断、模型输出不稳定或部分内容需要重做时，恢复成本更高
- 立即进入 RAG/Agent：先完成本地学习闭环（摄入→工作台→复习），再引入向量检索和多 Agent 协作

</section>

<section id="architecture">

## 系统架构

```text
Tauri 2 + React + TypeScript (Vite)
              ↓
      Rust async commands
              ↓
     Python CLI subprocess
              ↓
Python core + JSON + Markdown files
```

已实现三条流程：

1. **资料摄入与转录**：选择已有转录、本地媒体或 B站视频/合集 → 识别 7 种媒体和 4 种文本格式 → BcutASR 或 faster-whisper 转录 → 持久化任务（queued/running/done/failed/interrupted）→ 失败重试与中断恢复
2. **AI 笔记与 CardDraft**：转录结果 → AI 笔记生成 → 人工审核 → 显式发布到 Obsidian → CardDraft 生成 → 标记 draft/accepted/discarded → 仅导出 accepted 卡片为 TSV 或推送 AnkiConnect → 保存回执并读取遗忘信号
3. **Markdown 知识工作台**：打开 Vault → 文件树/全文搜索/Quick Switcher → CodeMirror 6 编辑与 Live Preview → Wikilink 创建、补全与导航 → Backlinks/Outline → 前进/后退导航 → Extract 精炼与回源

尚未形成：调度式渐进阅读、内置间隔复习（FSRS）、完整学习闭环串联。安全重命名尚未实现。

</section>

<section id="validation">

## 验证与当前结果

| 指标 | 结果 | 说明 |
|---|---|---|
| Python 测试 | 550 passed、5 skipped | skip 原因为 Windows 账户不可创建符号链接 |
| 前端逻辑测试 | 15 个测试文件通过 | 逐文件运行确认 |
| TypeScript | tsc --noEmit 通过 | 本轮实际运行 |
| Rust | 2 passed | 本轮 cargo test |
| 生产构建 | 通过，355 modules | MarkdownEditor chunk 632 kB，Vite 警告非失败 |

尚未验收：
- 桌面 GUI 完整交互验证
- 外部服务（BcutASR、faster-whisper、AnkiConnect）全链路测试
- Tauri 安装器安装、启动和卸载流程
- 无长期学习效果数据或真实用户试用记录

</section>

<section id="bad-cases">

## Bad Case

- 外部 ASR 服务不可用时转录任务失败——当前通过任务状态标记、错误脱敏和重试机制保护，不丢失已完成的阶段产物
- 大模型返回格式不符合预期时解析失败——保留原始输出并提示人工处理，不静默丢弃
- AnkiConnect 不可达或版本不兼容时卡片推送失败——保存推送回执并读取 Again 信号，支持重试
- expected-hash 不一致时拒绝覆盖外部修改——保留冲突版本供人工对比合并，不自动覆盖
- 中文输入法在 WebView 中存在组合字符和光标偏移问题——CodeMirror 6 层面做了 IME 事件处理，但仍有边界情况
- 原生拖放事件在 Tauri WebView 中存在路径解析差异——已从编辑器 File.path 方案转为 Tauri 原生拖放事件

</section>

<section id="reflection">

## 复盘与下一步

这个项目验证了：AI 工作流的可靠性主要来自任务状态、输入输出约束、人工审核与失败恢复，而不是更长的 Prompt 或更强的模型。把 AI 放在流水线中间、让人做最终审核、让系统管理状态与恢复——这一模式在产品层面是成立的。

下一步优先级：
1. 完成真实 GUI 交互、外部服务全链路和安装器验收
2. 推进渐进阅读（Topic、优先级、阅读位置）与复习闭环（FSRS、Review Event）
3. RAG、MCP、教师 Agent、费曼 Agent 均是产品方向上的规划，尚未进入实现

</section>
