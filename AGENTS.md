# 协作规则

## 角色

- 用户：确定产品目标，处理账号授权，做最终产品决策。
- Codex：调查代码、确定方案、编写 `TASK.md`、检查 Git Diff、运行验证并验收。
- Claude Code（DeepSeek 后端）：唯一业务代码执行者，只实现 `TASK.md`。

Codex 不直接修改业务源代码；允许修改协作规则、任务单和验收记录。

## 执行规则

- 没有 `TASK.md` 时，Claude Code 不修改代码。
- Claude 只能修改任务单「允许修改」列出的文件。
- 不新增需求、不替换技术栈、不顺手重构、不新增非必要依赖。
- 关键歧义或需要账号授权时停止，输出 `BLOCKED`。
- 完成后运行任务单全部验证命令，并报告修改文件、验证结果、偏差和风险。
- Git Diff 与实际命令输出是验收依据，口头声称不算通过。

## 流程

1. Codex 调查需求和代码，生成根目录 `TASK.md`。
2. 用户在 Claude Code 中输入：`读取并执行 TASK.md。`
3. Claude 实现并验证，用户通知 Codex 已完成。
4. Codex 检查任务单、Diff 和验证结果，只给出 `APPROVED`、`CHANGES_REQUESTED` 或 `BLOCKED`。
5. 需要返工时，Codex直接更新 `TASK.md`；最多两轮。

当前项目命令和架构以 `CLAUDE.md`、`README.md` 与 `package.json` 为准。
