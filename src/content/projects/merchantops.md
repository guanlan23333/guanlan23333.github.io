---
title: MerchantOps Copilot
slug: merchantops
summary: 单主 Agent 联合只读经营数据与企业知识，输出带 SQL、指标口径和文档引用的可核验经营分析。
status: testing
featured: true
priority: 2
role: 产品定义 · AI 协作开发与验收
startDate: 2026-07-01
lastUpdated: 2026-07-24
gallery: []
tags:
  - Agent Routing
  - Text-to-SQL
  - Knowledge Retrieval
  - Evaluation
problem: 运营问题同时分散在经营数据和业务知识中；普通 AI 回答不展示 SQL、指标口径或拒答边界，难以核验。
targetUsers:
  - 中小电商运营、商品运营和客服负责人（尚未经过真实访谈验证的目标用户假设）
responsibilities:
  - 锁定知识问答、数据问答、联合分析三个黄金场景与量化门槛
  - 设计 knowledge/data/hybrid/unsupported 四路由与证据契约
  - 将需求拆解为 AI Agent 可实现任务，组织三角色测试验收与 Bad Case 记录
  - 定义 SQL 安全边界、Redis 缓存限流与故障降级策略
keyDecisions:
  - 单主 Agent 四路由，先判断问题类型再选择工具
  - SQLGlot AST 校验、白名单、只读账户、200 行上限四层安全
  - 回答必须附 SQL、指标口径、时间范围和知识引用
  - 证据不足时拒答，不把常识推测写成经营结论
architecture: Streamlit → FastAPI → 单主 Agent → data/knowledge/hybrid/unsupported → MySQL/知识文件 → 证据回答
evaluation: 30 题固定评测历史结果六项指标为 100%（本地固定演示结果，不代表真实模型或生产效果）；本轮 55 项可收集，因缺少 MySQL/Redis/演示账户配置仅 25 通过。
results:
  - 已实现 1 个单主 Agent、4 类结构化路由、18 个 API 路由与 11 张 MySQL 表
  - 30 题固定评测历史结果六项指标为 100%（本地固定演示结果，不代表真实模型或生产效果）
  - 20 VU P95 为 3.17s、50 VU P95 为 5.05s，两组均未达到 P95<3s 门槛
badCases:
  - 路由误判：data 类问题被路由到 knowledge，只返回文档引用而无数据
  - 拒答不稳定：部分边界问题应拒答但给出推测，部分应回答但路由到 unsupported
  - SQL 口径偏差：语法和权限正确，但遗漏退款订单过滤或使用错误的指标口径
  - 引用多样性不足：多条证据来自同一文档同一段落，缺少跨来源交叉验证
nextSteps:
  - 接入真实 DeepSeek 模型验证效果，当前仅本地规则模式
  - 收口 Git 与可复现环境，80 个未跟踪文件纳入版本管理
  - 线上部署、真实用户价值与 Dify 导入尚未验证
draft: false
---

<section id="snapshot">

## 30 秒摘要

MerchantOps Copilot 是一个本地可运行、进入测试阶段的经营分析 Agent 原型，不是生产系统。它通过单主 Agent 将用户自然语言问题路由到只读 MySQL 查询或本地知识检索，输出附 SQL、指标口径、时间范围和文档引用的可核验经营分析。当前以固定演示数据和规则模式运行，真实模型效果尚未验证。

</section>

<section id="context">

## 背景与目标

真实运营判断经常需要同时查询订单、商品、流量等结构化数据，以及活动规则、指标定义和复盘记录等非结构化知识。手工切换工具效率低，而通用模型容易忽略企业自己的指标口径。

项目定义了三个产品假设场景，尚未经过真实用户访谈验证：

1. **制度查询**：判断拆封质量问题商品能否退货，答案需引用售后制度和商品资料原文
2. **经营分析**：分析本周 GMV 下滑的主要因素，展示 SQL、指标口径和趋势
3. **联合归因**：找出退款率最高的三个 SKU，结合数据、客服原因和商品资料形成整改建议

### 我的职责

- 锁定三个黄金场景与量化完成标准，控制 MVP 范围
- 设计 knowledge/data/hybrid/unsupported 四路由与证据契约
- 将需求拆解为 AI Agent 可实现任务，组织三角色测试验收
- 定义 SQL 安全边界、Redis 缓存限流与故障降级策略

</section>

<section id="research">

## 调研与关键洞察

调研了两个核心问题：

1. 同一句运营问题可能包含不同任务类型。"为什么本周转化下降"既需要查询数据变化，也需要结合活动、库存或内容策略解释。单一知识检索或单一 Text-to-SQL 都无法覆盖完整链路。

2. SQL 可执行不等于业务正确。指标口径、时间范围和业务过滤条件错误，往往比语法错误更危险——语法错误的 SQL 不会执行，而口径错误的 SQL 会输出"看起来合理但实际错误"的结论。

核心洞察：结论必须同时展示 SQL、指标口径、时间范围和知识引用，让运营人员能自行核验，而不是接受一个"看起来合理"的答案。

</section>

<section id="reframe">

## 重新定义问题

原问题：如何做一个电商问数机器人？

重新定义后：如何构建一个单主 Agent，让运营问题被路由到正确证据源，在不越过数据安全边界的前提下，输出可核验的经营判断？

</section>

<section id="solution">

## 方案与关键决策

### 决策一：四路由而非单一通道

Agent 先将问题分类为 knowledge（知识检索）、data（只读 SQL）、hybrid（两者联合）或 unsupported（拒答），再调用对应工具。避免所有问题进入同一条链路造成的噪声和错误。

### 决策二：四层 SQL 安全

SQLGlot MySQL AST 语法校验 → 表字段白名单 → 强制 LIMIT 200 行上限 → MySQL 只读账户。不依赖模型自觉遵守安全规则，每一层独立生效。

### 决策三：证据契约

每个回答必须包含：执行步骤、数据证据（SQL + 结果）、知识证据（文档 + 位置 + 更新时间）、结论、建议、风险提示。证据不足时拒答并列出缺失信息，不把常识推测写成经营结论。

### 决策四：用户隔离与限流

Redis 按用户隔离缓存结果，避免跨用户数据泄漏。Lua 固定窗口限流保护高成本接口。Redis 不可用时降级为直接查询，不阻断核心功能。

### 被放弃的方向

- 自由访问全库的问答 Agent：能更快产出演示，但无法说明指标口径、安全边界和错误责任
- 重型多 Agent 平台：当前单主 Agent 加四路由足以验证核心假设，多 Agent 协作留待后续

</section>

<section id="architecture">

## 系统架构

```text
Streamlit (角色化页面：驾驶舱 / AI 分析 / 知识库)
              ↓
FastAPI (Bearer Token + admin/analyst/viewer 三角色)
              ↓
单主 Agent (knowledge / data / hybrid / unsupported)
   ↙              ↓              ↘
知识检索        只读 SQL        混合任务
  ↓               ↓               ↓
Markdown        MySQL          联合证据
TXT/PDF         SQLGlot
  ↘              ↓              ↙
  证据回答 (SQL + 引用 + 口径 + 时间范围 + 风险)
              ↓
Redis (用户隔离缓存 + Lua 固定窗口限流)
```

已实现：1 个单主 Agent、4 类结构化路由、18 个 API 路由、11 张 MySQL 表、本地关键词检索与 PDF 文本提取、scrypt 密码摘要与 Token 摘要、18 条危险 SQL 对抗用例、30 题固定评测集。

尚未验证：真实 DeepSeek 模型模式（当前仅本地规则模式）、Dify 工作流导入、线上部署环境。

</section>

<section id="validation">

## 验证与当前结果

| 指标 | 结果 | 说明 |
|---|---|---|
| 固定评测 | 六项 100% | 30 题固定演示数据、本地规则模式；不代表真实模型或生产效果 |
| pytest 收集 | 55 项 | 本轮因缺少 MySQL、Redis 和演示账户配置，仅 25 通过、13 失败、17 错误 |
| 危险 SQL 用例 | 18 条 | 覆盖 DROP、DELETE、多语句、无 LIMIT、敏感表访问 |
| 20 VU 压测 | P50 1.07s、P95 3.17s | 未达到 P95<3s 门槛 |
| 50 VU 压测 | P50 2.65s、P95 5.05s | 未达到 P95<3s 门槛 |

尚未验收：
- 真实 DeepSeek 模型效果（当前仅本地规则模式验证）
- Dify 工作流导入（已生成脱敏 DSL 并静态检查，未在真实 Dify 运行）
- 线上部署环境（有 Dockerfile 和 Compose 草案，未部署）
- 真实用户价值（无用户访谈、试用记录或业务影响数据）

</section>

<section id="bad-cases">

## Bad Case

- **路由误判**：data 类问题被路由到 knowledge，只返回文档引用而无数据查询——当前通过固定评测集捕获，规则阈值仍需调优
- **拒答不稳定**：部分边界问题应拒答但给出推测，部分应回答但路由到 unsupported——已在 Bad Case 记录中标注具体问题
- **引用多样性不足**：多条证据来自同一文档同一段落，缺少跨来源交叉验证——知识库切分策略和引用去重逻辑需要改进
- **SQL 口径偏差**：语法和权限正确，但遗漏退款订单过滤或使用错误的指标口径——18 条危险 SQL 用例覆盖了语法层安全，口径层仍依赖指标字典的人工维护
- **并发瓶颈**：50 VU 下 P95 超过 5s，Redis 连接池和 FastAPI worker 配置需要调整

</section>

<section id="reflection">

## 复盘与下一步

当前最重要的不是增加更多工具或场景，而是先收口已有的代码、测试和环境，让项目处于可复现、可交接的状态：

1. 接入真实 DeepSeek 模型，对比规则模式和模型模式的评测差异——这是验证产品假设的关键一步
2. 收口 Git 状态，将 80 个未跟踪文件纳入版本管理，建立可复现的开发环境
3. 线上部署、真实用户价值和 Dify 导入尚未验证，不写成已具备的能力

</section>
