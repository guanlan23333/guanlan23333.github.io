---
title: AI 实习求职雷达
slug: jobmatchai
summary: 面向中文 AI 实习求职的本地 Chrome 扩展，覆盖 BOSS 岗位采集、判重、多目标、结构化简历、硬过滤、AI 分析和批量导出，发送与提交始终由用户确认。
status: alpha
featured: true
priority: 2
role: 产品定义 · 研究与流程设计 · 架构决策 · AI 协作开发 · 测试与验收
startDate: 2026-04-01
lastUpdated: 2026-07-21
gallery: []
tags:
  - Chrome MV3
  - Agent Workflow
  - Job Data
  - Human-in-the-loop
problem: 中文实习岗位信息分散、重复岗位难判定、不同求职目标容易串批，AI 生成的沟通与简历内容还存在事实夸大和误发风险。
targetUsers:
  - 使用 BOSS 直聘寻找中文 AI 实习的个人求职者（当前主要用户为项目发起者本人）
responsibilities:
  - 定义采集、判重、分目标、筛选和人工沟通的产品范围
  - 研究中文招聘流程并设计硬过滤、评分与 Agent Pack
  - 决定多目标数据归属、内容哈希和人工发送等架构边界
  - 完成核心代码实现或通过 AI 协作拆解并交付实现
  - 设计并执行自动测试、回归验收和 Bad Case 检查
keyDecisions:
  - 从自动投递收缩为采集、筛选和人工决策的半自动工作台
  - 岗位全局判重，多求职目标独立归属、计次和导出
  - Agent Pack 分批控制上下文，并用记录 ID 和内容哈希对应结果
  - 招呼语只填入草稿，简历只修改母版，最终发送和提交由用户确认
architecture: Chrome MV3 → Content Script 与 Shadow DOM → Background Service Worker → chrome.storage.local、downloads 与 runtime messaging → BOSS API 优先采集、DOM 降级
evaluation: 2026-08-01 实际验证 18 个测试文件、263/263 项通过，49 个 JS/MJS 文件语法检查通过，Manifest 21 个唯一引用缺失 0；未执行真实 Chrome/BOSS 页面 Smoke Test。
results:
  - 已实现 BOSS 采集、强标识判重、多求职目标和三类批量导出
  - 已实现 3 个简历槽、PDF/DOCX 解析、五项硬过滤和七维 AI 评分
  - 招呼语只生成或填入草稿；申请表辅助和 DOCX 简历补丁仍为部分实现
badCases:
  - BOSS 页面或接口变化可能导致字段缺失，本次未完成实时页面回归
  - 岗位移出最后一个目标时，当前实现会删除对应记录
  - Agent ZIP 没有正式结果导入和过期判断
  - AI 评分没有人工标注集，简历补丁也不能识别全部语义造假
  - 本地简历与 AI 配置存于 chrome.storage.local，未加密
nextSteps:
  - 使用虚构或脱敏数据完成真实 Chrome/BOSS Smoke Test
  - 先建立统一求职台账内核，再处理正式结果导入和今日行动
  - 保持半自动路线，不增加自动发送或自动投递
draft: false
---

<section id="snapshot">

## 30 秒摘要

AI 实习求职雷达是一款面向中文 AI 实习流程的本地 Chrome 扩展 Alpha。它从 BOSS 采集并判重岗位，按求职目标管理 JD，结合结构化简历完成硬条件过滤、AI 分析和批量导出。沟通与申请内容只会生成或填入草稿，最终发送和提交始终由用户确认。

</section>

<section id="context">

## 背景与目标

中文实习岗位信息分散在搜索结果、详情页和聊天会话中。不同求职方向共用岗位池容易串批，完整 JD 一次性交给 Agent 又会造成上下文过长和结果难对应。

项目目标不是自动投递，而是建立“采集 → 筛选 → 人工决策”的半自动工作流。当前主要用户是项目发起者本人，没有用户规模或商业化证据。

### 我的职责

- 负责产品定义、中文招聘流程研究和半自动边界设计
- 负责岗位判重、多目标、Agent Pack、硬过滤和人工确认等架构决策
- 完成核心代码实现，或将需求拆解为 AI 可执行任务并审查交付
- 设计并执行自动测试、回归验收和 Bad Case 检查

</section>

<section id="research">

## 关键洞察与问题重定义

- HR 活跃度表示联系机会，不等于岗位匹配度。
- 同一岗位应全局只保存一份，但可以归属多个求职目标。
- 完整 JD 应分批交给 Agent，并用记录 ID 和内容哈希对应结果。
- AI 简历与沟通内容必须经过事实约束和人工确认。

因此问题从“自动投递”重定义为“如何让 Agent 辅助采集与筛选，同时把真实决策留给人”。

</section>

<section id="solution">

## 方案与关键决策

扩展优先读取 BOSS 详情和列表 API，失败时降级解析 DOM；使用 `jobId`、`securityId`、`lid` 判重，缺失时回退公司、岗位和城市组合键。同一岗位可归属多个求职目标，目标内独立计次和导出。

Agent Pack 默认分批输出岗位、manifest、评分规则和结果 Schema。当前使用 8 位内容哈希，没有正式结果导入和过期判断。五项硬过滤处理毕业年份、学历、城市、实习时长和招聘状态；七维 AI 评分由前端重算总分，但没有准确率验证。

招呼语只填入聊天框草稿，不触发发送。简历从 DOCX 母版应用人工勾选的补丁，不从头生成。

</section>

<section id="architecture">

## 系统架构与当前能力

```text
Chrome Extension Manifest V3
→ Content Script + Shadow DOM 侧边栏
→ Background Service Worker
→ chrome.storage.local / downloads / runtime messaging
→ BOSS API 优先采集 + DOM 降级
```

已实现 BOSS 采集、判重、多目标、JSON/Markdown/Agent ZIP 导出、3 个简历槽、PDF/DOCX 解析、五项硬过滤、七维评分和招呼语草稿。

申请表辅助填入和 DOCX 简历补丁为部分实现，尚未完成跨站或全面事实验证。统一求职台账、正式分析结果导入、SHA-256 协议、今日行动、跟进和漏斗仅在规划中。

</section>

<section id="validation">

## 验证与当前结果

| 验证项 | 结果 | 边界 |
|---|---|---|
| 自动化测试 | 18 个文件、263/263 项通过 | 2026-08-01 实际运行 |
| JavaScript/MJS 语法 | 49 个文件通过 | 0 个失败 |
| Manifest 引用 | 21 个唯一引用，缺失 0 | 本地文件检查 |
| Chrome/BOSS Smoke Test | 未运行 | 需要脱敏或虚构数据的真实浏览器环境 |
| 匹配与求职结果 | 尚未验证 | 无准确率、节省时间、回复率、面试或 Offer 数据 |

仓库没有构建、lint 或 typecheck 命令。公开仓库是否包含当前本地提交也尚未验证，因此本轮不展示仓库 URL。

</section>

<section id="bad-cases">

## Bad Case

- BOSS DOM/API 变化时，岗位字段可能缺失。
- 岗位移出最后一个求职目标时，当前实现会删除对应记录。
- 采集、收藏和投递仍存在多套数据视图。
- Agent ZIP 只有 8 位内容哈希，没有正式结果导入和过期判断。
- 扫描 PDF 无 OCR；AI 生成文本和简历补丁无法覆盖全部事实风险。
- 本地简历与 AI 配置存于 `chrome.storage.local`，未加密。

</section>

<section id="reflection">

## 复盘与下一步

产品价值来自清晰的数据结构和人工确认边界，而不是自动化程度。下一步先用虚构或脱敏数据完成真实 Chrome/BOSS Smoke Test，再建立统一台账内核；自动发送和自动投递不进入当前路线。

</section>
