---
title: E-commerce After-Sales Agent
slug: ecommerce-after-sales-agent
summary: 面向单一服饰 Shopify 商家的售后 Agent 项目；当前已完成产品边界、架构决策、PostgreSQL 初始 Schema 和迁移测试，客户门户、AI 编排与外部集成尚未实现。
status: development
featured: false
priority: 4
role: 产品定义 · 研究与流程设计 · 架构决策 · AI 协作开发 · 测试与验收
startDate: 2026-03-01
lastUpdated: 2026-07-30
gallery: []
tags:
  - Python
  - PostgreSQL
  - psycopg
  - SQL
  - unittest
problem: 售后自动化涉及客户身份、确定性规则、外部写入、幂等和人工接管，错误操作可能带来财务、履约和隐私风险。
targetUsers:
  - 单一服饰 Shopify 商家的售后客户与客服团队（尚未经过真实用户验证）
responsibilities:
  - 定义单商家 MVP、售后边界和目标流程
  - 研究退货资格、人工接管、审计和幂等控制
  - 决定外部写入权限、事实源和数据库边界
  - 完成数据库基础代码实现或通过 AI 协作拆解并交付实现
  - 设计并执行数据库集成测试与约束验收
keyDecisions:
  - Agent 最多计划创建 Return Request，不执行退款等不可逆操作
  - Shopify 计划作为退货事实源，不在本地复制完整退货生命周期
  - 当前使用 psycopg 和前向 SQL，不提前引入 ORM 或迁移框架
  - 模型只计划负责意图与表达，确定性 Procedure 负责状态、规则和写入闸门
architecture: 当前实际架构为 unittest 集成测试 → Python 迁移器 → psycopg → 隔离 PostgreSQL 测试 Schema；完整售后应用架构仅为规划
evaluation: 2026-08-01 实际运行 5/5 数据库集成测试并通过；Python、psycopg 和依赖一致性检查通过。pytest、Ruff、Docker 和全部外部服务未运行。
results:
  - 已形成 8 项产品与架构决策
  - 已建立 1 个 PostgreSQL 初始迁移，包含 8 张受约束的表
  - 已实现最小迁移器和统一迁移错误；完整业务工作流为 0 个
badCases:
  - 当前没有 Web 入口，客户流程在第一步中断
  - 没有 Shopify、Chatwoot 或模型适配器
  - 迁移器没有迁移版本账本
  - 原子状态更新、Confirmation 失效、单赢家幂等 claim 和审计脱敏尚未实现
  - 仓库没有可证明发布版本的 Commit 或远程地址
nextSteps:
  - 实现原子状态更新、Confirmation 失效和单赢家幂等 claim
  - 留下最小并发数据库测试
  - 在数据库边界完成前不提前搭建完整客户应用
draft: false
---

<section id="snapshot">

## 30 秒摘要

E-commerce After-Sales Agent 面向单一服饰 Shopify 商家的售后场景，目标是让已验证客户通过确定性规则提交 Return Request，并把异常问题安全转交人工。目前处于早期开发阶段：产品边界和架构决策已经完成，PostgreSQL 初始 Schema 与迁移测试可运行；客户门户、AI 编排和真实外部集成尚未实现。

</section>

<section id="context">

## 背景与目标

售后流程同时涉及客户身份、订单事实、退货资格、不可逆写入和人工例外处理。让模型直接控制退款或订单操作会放大财务、履约和隐私风险。

目标是设计一条受限、可审计的退货申请流程。当前只完成数据库基础，尚不能提供客户可操作的业务流程。

### 我的职责

- 负责产品定义、售后流程研究和单商家 MVP 范围
- 负责外部写入权限、事实源、幂等和人工接管等架构决策
- 完成数据库基础代码实现，或将需求拆解为 AI 可执行任务并审查交付
- 设计并执行数据库集成测试和约束验收

</section>

<section id="research">

## 关键洞察与问题重定义

售后 Agent 的首要问题不是自然语言能力，而是权限和状态控制。模型可以规划为负责理解和表达，但确定性规则、确认门、幂等和人工接管必须由应用代码控制。

项目因此从“自动客服”重定义为“如何在不越过财务与履约边界的前提下完成可审计的退货申请”。

</section>

<section id="solution">

## 方案与关键决策

- Agent 最多计划创建 Shopify Return Request，不执行退款、取消订单、改地址或补偿。
- Shopify 计划作为退货事实源，本地不复制完整退货生命周期。
- 当前使用 psycopg 和前向 SQL，不引入 ORM、Repository 或工作流框架。
- 目标编排中，模型只负责意图和表达，确定性 Procedure 负责状态、规则和写入闸门。
- 异常流程计划交给 Chatwoot，接管后停止该会话的自动写入。

除数据库方案外，上述业务流程和外部集成均未实现。

</section>

<section id="architecture">

## 当前实际架构

```text
unittest 集成测试
→ Python 迁移器
→ psycopg
→ 隔离 PostgreSQL 测试 Schema
```

当前部分实现：1 个初始迁移、8 张受约束的表、最小 SQL 迁移器和统一 `MIGRATION_FAILED` 错误。迁移器每次按文件名执行 SQL，没有迁移版本账本。

Shopify 登录和订单读取、退货资格、Return Request、DeepSeek、Chatwoot、Support Portal、FastAPI 页面和 Docker Compose 均仅在规划中，不能视为当前系统架构。

</section>

<section id="validation">

## 验证与当前结果

| 验证项 | 结果 | 边界 |
|---|---|---|
| 数据库集成测试 | 5/5 通过 | 2026-08-01 连接隔离 PostgreSQL 环境实际运行 |
| Python 与 psycopg | 可用 | Python 3.13.13、psycopg 3.3.4 |
| 依赖一致性 | 通过 | `pip check` 无破损依赖 |
| pytest、Ruff | 未运行 | 当前环境未安装 |
| Docker/Compose | 未运行 | Docker 不可用且仓库无 Compose 文件 |
| Shopify、DeepSeek、Chatwoot | 未运行 | 对应代码尚未实现 |

当前完整业务工作流为 0 个，没有 Demo、用户、性能或商业结果。

</section>

<section id="bad-cases">

## Bad Case

- 当前没有 Web 应用入口，客户流程在第一步中断。
- 没有 Shopify、Chatwoot 或模型适配器。
- 迁移器没有版本账本，未来非幂等迁移需要补充机制。
- 原子状态更新、Confirmation 失效和单赢家幂等 claim 尚未实现。
- 只有审计表结构，没有审计脱敏器或金丝雀测试。
- 仓库没有可证明发布版本的 Commit、跟踪文件或远程地址。

</section>

<section id="reflection">

## 复盘与下一步

当前最小目标是实现原子状态更新、Confirmation 失效和单赢家幂等 claim，并留下最小并发数据库测试。在这些边界完成前，不提前搭建客户门户、模型编排或外部服务集成。

</section>
