# 内容模型

## 项目状态枚举

```text
idea | planning | development | alpha | testing | released | archived
```

显示文案由页面统一映射，不在每篇 Markdown 中自由填写。

## Project

```yaml
title: SecondBrain Desktop
slug: secondbrain
summary: 将课程材料加工为可审核的结构化笔记，并发布到 Obsidian 与 Anki
status: alpha
featured: true
priority: 1
role: 独立产品设计与开发
startDate: 2026-01-01
lastUpdated: 2026-07-22
coverImage: /images/projects/secondbrain/cover.webp
gallery: []
tags:
  - Agent
  - PySide6
problem: TODO：用真实用户情境描述问题
targetUsers:
  - 有大量课程录音和视频资料的学生
responsibilities:
  - TODO：列出本人实际承担工作
keyDecisions: []
architecture: TODO
evaluation: TODO
results: TODO
badCases: []
nextSteps: []
demoUrl:
githubUrl:
videoUrl:
draft: true
```

### 必填字段

`title`、`slug`、`summary`、`status`、`featured`、`priority`、`role`、`startDate`、`lastUpdated`、`coverImage`、`tags`、`problem`、`targetUsers`、`responsibilities`、`draft`。

URL 字段允许为空；非空时必须是 `https://` 地址。图片路径必须位于 `public/` 对应目录并真实存在。

## 项目正文结构

每篇案例使用一致的二级标题，方便目录与快速扫描：

1. 30 秒摘要
2. 背景与目标
3. 目标用户与问题
4. 我的角色和职责
5. 原有流程与调研
6. 关键洞察与问题重定义
7. 方案与用户流程
8. Agent / 系统工作流
9. 核心产品决策
10. 被放弃的方案
11. 技术设计
12. Demo 与输入输出
13. 验证方法
14. 结果与证据
15. Bad Case
16. 迭代记录
17. 复盘与下一步

没有证据的章节保留 TODO 或明确写「尚未验证」，不生成推测性结果。

## Update

```yaml
title: MerchantOps 路由规则更新
project: merchantops
date: 2026-07-22
summary: TODO：一句话说明本次实际变化
evidence: []
draft: true
```

正文只记录：做了什么、为什么改、验证结果、已知问题、下一步。

## Profile

个人资料集中在 `src/data/profile.ts`，只允许公开字段：姓名、学校、专业、届别、目标岗位、城市、到岗情况、邮箱、GitHub、公开简历。

## 能力与证据关系

- 业务问题分析 → MerchantOps、SecondBrain 的真实需求来源。
- AI 工作流设计 → Agent 路由、RAG、状态机、兜底与人工审核。
- 快速原型实现 → 可运行 Demo、Python/FastAPI/SQL/PySide6。
- 效果验证与交付 → 测试集、评测指标、Bad Case、README、演示与迭代记录。

能力卡片必须链接到至少一个已发布项目证据；没有证据时不展示该能力断言。

## 排序规则

1. 过滤 `draft: true`。
2. 首页只展示 `featured: true`。
3. 先按 `priority` 升序，再按 `lastUpdated` 降序。
4. 最近更新从 Update 集合按 `date` 降序取值。
