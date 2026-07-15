# Environment Entry Checklist

Use this checklist as the promotion gate between environments. A promotion should be blocked when required evidence is missing, even if the image itself built successfully.

## Dev

Entry criteria:

- Code is merged into `main`.
- CI tests and dependency scan pass.
- Image is built, scanned, and pushed to GHCR.
- Dev GitOps pull request is created.

Exit criteria:

- Dev GitOps pull request is merged.
- Argo CD sync succeeds.
- PostSync smoke test passes.
- No obvious crash loops, probe failures, or startup errors.

Evidence:

- CI run URL
- Image reference
- GitOps PR URL
- Argo CD application sync result

## Test

Entry criteria:

- Dev exit criteria are complete.
- Test promotion PR copies the exact image from Dev.
- GitOps validation workflow passes.

Exit criteria:

- Test deployment succeeds.
- Smoke test passes.
- Automated integration, API, or regression tests pass.
- QA defects are either resolved or accepted for a later environment with explicit owner approval.

Evidence:

- Promotion PR URL
- Test execution report
- Argo CD sync result
- Known defect list

## Staging

Entry criteria:

- Test exit criteria are complete.
- Staging promotion PR copies the exact image from Test.
- Release notes or change summary are ready.
- Production-like configuration differences are reviewed.

Exit criteria:

- Staging deployment succeeds.
- Smoke test passes.
- Critical path regression tests pass.
- Observability signals are healthy.
- Rollback plan is documented.

Evidence:

- Staging promotion PR URL
- Regression test result
- Dashboard links
- Rollback image or GitOps commit

## Prod

Entry criteria:

- Staging exit criteria are complete.
- Production promotion PR copies the exact image from Staging.
- Required production approvers have reviewed the PR.
- Change window, verifier, and rollback owner are identified.
- No active release freeze or blocking incident applies.

Exit criteria:

- Production Argo CD application is manually synced or approved by the production gate.
- PostSync smoke test passes.
- Dashboards show healthy traffic, latency, error rate, saturation, and business-critical signals.
- Release verifier confirms success.

Evidence:

- Production PR URL
- Argo CD sync result
- Smoke test result
- Dashboard links
- Release verification comment

# 环境准入 Checklist

本文档作为环境间晋级门禁使用。即使镜像构建成功，只要必要证据缺失，也应该阻止晋级。

## Dev

准入条件：

- 代码已合并到 `main`。
- CI 测试和依赖扫描通过。
- 镜像已构建、扫描并推送到 GHCR。
- Dev GitOps PR 已创建。

退出条件：

- Dev GitOps PR 已合并。
- Argo CD sync 成功。
- PostSync smoke test 通过。
- 没有明显 crash loop、probe 失败或启动错误。

证据：

- CI run URL
- 镜像引用
- GitOps PR URL
- Argo CD 应用同步结果

## Test

准入条件：

- Dev 退出条件已满足。
- Test 晋级 PR 从 Dev 复制完全相同的镜像。
- GitOps 验证 workflow 通过。

退出条件：

- Test 部署成功。
- Smoke test 通过。
- 自动化集成测试、API 测试或回归测试通过。
- QA 缺陷已修复，或经负责人明确接受后进入下一环境。

证据：

- 晋级 PR URL
- 测试执行报告
- Argo CD 同步结果
- 已知缺陷列表

## Staging

准入条件：

- Test 退出条件已满足。
- Staging 晋级 PR 从 Test 复制完全相同的镜像。
- Release notes 或变更摘要已准备。
- 已审查与生产相似配置的差异。

退出条件：

- Staging 部署成功。
- Smoke test 通过。
- 关键链路回归测试通过。
- 可观测信号健康。
- 回滚方案已记录。

证据：

- Staging 晋级 PR URL
- 回归测试结果
- Dashboard 链接
- 回滚镜像或 GitOps commit

## Prod

准入条件：

- Staging 退出条件已满足。
- 生产晋级 PR 从 Staging 复制完全相同的镜像。
- 必要生产审批人已完成 PR 审查。
- 发布窗口、验证人和回滚负责人已明确。
- 不存在发布冻结或阻塞级事故。

退出条件：

- 生产 Argo CD 应用已手动同步，或通过生产门禁审批同步。
- PostSync smoke test 通过。
- Dashboard 显示流量、延迟、错误率、饱和度和关键业务信号健康。
- 发布验证人确认成功。

证据：

- 生产 PR URL
- Argo CD 同步结果
- Smoke test 结果
- Dashboard 链接
- 发布验证评论
