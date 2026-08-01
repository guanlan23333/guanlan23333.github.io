---
title: SecondBrain Desktop
slug: secondbrain
summary: 本地优先的 Windows 学习环境，将音视频和转录资料接入 Markdown 工作台，并通过渐进阅读、FSRS 复习、来源引用问答和费曼式追问形成学习闭环。
status: alpha
featured: true
priority: 1
role: 产品定义 · 研究与流程设计 · 架构决策 · AI 协作开发 · 测试与验收
startDate: 2026-03-01
lastUpdated: 2026-08-01
gallery: []
tags:
  - Local-first
  - Tauri
  - Knowledge Workflow
  - Human-in-the-loop
  - FSRS
problem: 学习资料分散在采集、转录、笔记、复习和问答工具中，AI 产出还容易丢失来源、审核节点和失败恢复能力。
targetUsers:
  - 需要持续处理音视频、转录文本和 Markdown 资料的个人学习者（尚无真实用户规模验证）
responsibilities:
  - 定义本地学习闭环、目标用户问题和功能优先级
  - 研究 Obsidian、渐进阅读、间隔复习和来源引用工作流
  - 决定 Markdown 归用户所有、阅读与记忆调度分离等架构边界
  - 完成核心代码实现或通过 AI 协作拆解并交付实现
  - 设计自动测试、桌面验收与 Bad Case 检查
keyDecisions:
  - Markdown 是事实源，索引和结构化状态可重建或独立持久化
  - 用户可停在转录、笔记、Extract 或 CardDraft 任一阶段
  - AI 结果需要引用校验和人工确认，不静默写入长期知识库
  - Topic/Extract 使用阅读调度，Card 使用 FSRS 记忆调度
architecture: Tauri 2 + React + TypeScript → Rust 异步命令 → Python CLI/core → Markdown、JSON 与可重建 SQLite 检索缓存
evaluation: 2026-08-01 可收集 856 项 Python 测试；37 项调度与复习测试、19 个前端逻辑脚本及 TypeScript 检查通过。全量 Python、最新生产构建、Rust、GUI 和外部服务未完成本次验证。
results:
  - 已实现资料摄入、任务恢复、Markdown 工作台、安全自动保存和来源追踪
  - 已实现 Topic/Extract 渐进阅读、Today 队列、CardDraft 与内置 FSRS 复习
  - 已实现带引用问答和费曼式追问；AnkiConnect 与当前安装交付仍为部分实现
badCases:
  - 外部程序修改文件后，expected-hash 冲突保护会拒绝覆盖并要求人工处理
  - 尚未成功写盘的草稿在应用崩溃时可能丢失
  - 语义模型或索引不可用时回退词法检索，真实模型和大 Vault 性能尚未验证
  - 第三方模型、转录、内容平台和 Anki 服务可能失效
  - 当前工作台只覆盖 Obsidian 核心子集，不支持完整插件生态
nextSteps:
  - 使用脱敏 disposable Vault 完成当前版本的完整 Tauri 桌面验收
  - 验证真实外部服务、AnkiConnect 和当前安装器
  - 在真实需求出现后再评估 MCP、Agent Dock 和 Obsidian 长尾能力
draft: false
---

<section id="snapshot">

## 30 秒摘要

SecondBrain 是一款本地优先的 Windows 学习环境。它把音视频和转录资料接入 Obsidian 兼容的 Markdown 工作台，并通过渐进阅读、FSRS 卡片复习、来源引用问答和费曼式追问形成学习闭环。项目已有可运行 Alpha 与自动测试，但最新桌面界面、外部服务和安装交付仍未完成完整验收。

</section>

<section id="context">

## 背景与目标

采集、转录、笔记、Obsidian、Anki 和问答工具彼此分散，学习材料很难持续进入阅读、提炼和复习流程。AI 生成内容还可能脱离来源或未经审核进入知识库。

目标是让摄入、阅读、提取、制卡、复习和来源回溯共用本地数据，同时保留人工确认和失败恢复边界。

### 我的职责

- 负责产品定义、用户问题研究与完整学习流程设计
- 负责 Markdown 数据所有权、调度模型、引用校验和人工确认等架构决策
- 完成核心代码实现，或将需求拆解为 AI 可执行任务并审查交付
- 设计并执行自动测试、桌面验收和 Bad Case 检查

</section>

<section id="research">

## 关键洞察与问题重定义

核心问题不是缺少一次性的 AI 摘要，而是材料加工缺少可追踪状态、来源引用、人工确认和持续学习机制。因此产品从“转录工具”重定义为本地优先的学习工作流：用户可以停在任一阶段，系统负责状态与恢复，人负责最终审核。

</section>

<section id="solution">

## 方案与关键决策

- **Markdown 由用户所有**：正文保持普通 Markdown，不锁进私有格式。
- **阅读与记忆调度分离**：Topic/Extract 使用简单阅读间隔，Card 使用 FSRS。
- **安全写入**：保存前校验 expected-hash，并使用原子替换避免静默覆盖外部修改。
- **引用必须可复核**：问答限定文档或 Vault 范围，并验证证据 ID、位置和文件哈希。
- **AI 结果需要确认**：笔记、卡片和费曼薄弱点不会静默写入长期知识库。

</section>

<section id="architecture">

## 系统架构与当前能力

```text
Tauri 2 + React + TypeScript
            ↓
     Rust 异步命令桥
            ↓
     Python CLI 与业务核心
            ↓
Markdown / JSON / 可重建 SQLite 缓存
```

已实现资料摄入、任务状态与恢复、Markdown 编辑、Wikilink、反链、搜索、Outline、导航历史、标签页恢复、安全自动保存、Command Palette、链接预览、本地图片读取、Topic/Extract、Today、CardDraft、FSRS、来源引用问答和费曼式追问。

Anki TSV/AnkiConnect 链路和 Windows 安装交付为部分实现。MCP、Agent Dock、通用 Agent 写入、完整 Properties、Graph、Canvas、分栏和 Obsidian 插件生态仅在规划中。

</section>

<section id="validation">

## 验证与当前结果

| 验证项 | 结果 | 边界 |
|---|---|---|
| Python 测试收集 | 856 项可收集 | 只证明当前测试可收集 |
| Python 全量尝试 | 315 项先通过，余下在 setup 阶段受环境权限阻塞 | 不能解释为全量通过或业务失败 |
| 调度与复习测试 | 37 项通过 | 覆盖阅读调度和卡片复习 |
| 前端纯逻辑测试 | 19 个脚本通过 | 包含自动保存、工作区、Today 等逻辑 |
| TypeScript | 静态检查通过 | 本次实际运行记录 |
| 最新生产构建、Rust、GUI、外部服务 | 未运行 | 尚未验证 |

2026-07-29 曾记录 `845 passed / 6 skipped` 及生产构建通过，但该结果早于最新工作台提交，只作为历史基线。

</section>

<section id="bad-cases">

## Bad Case

- 外部程序修改正在编辑的 Markdown 时，系统拒绝覆盖并要求人工处理冲突。
- 应用在保存前崩溃时，尚未成功写盘的草稿可能丢失。
- 模型返回不存在的引用时结果会被拒绝，但引用校验不能证明模型解释一定正确。
- 语义模型或索引不可用时回退词法检索；大 Vault 性能尚未验证。
- 外部模型、转录、内容平台或 Anki 服务失效时，任务可能失败并进入重试流程。

</section>

<section id="reflection">

## 复盘与下一步

可靠的 AI 学习工作流依赖状态、来源、人工确认和失败恢复，而不是更长的 Prompt。下一步先用脱敏 disposable Vault 完成当前版本的桌面验收，再验证外部服务、AnkiConnect 和安装器；MCP 与长尾编辑能力不提前承诺。

</section>
