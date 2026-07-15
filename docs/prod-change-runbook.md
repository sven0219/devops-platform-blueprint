# Production Change Runbook

Use this runbook for production GitOps changes, including image promotion, configuration changes, and hotfix deployment. The operator should paste links and observations into the production pull request as the change progresses.

## Before the Change

Confirm:

- Production PR has required approvals.
- The promoted image matches the image currently running in Staging.
- GitOps validation workflow passed.
- Staging smoke test and regression evidence are linked.
- Change window is open.
- Rollback image or GitOps commit is known.
- Release verifier and rollback owner are available.
- Relevant dashboards and alert channels are open.

Record:

| Item | Value |
|---|---|
| Production PR | |
| Image | |
| Staging source | |
| Argo CD app | |
| Verifier | |
| Rollback owner | |
| Rollback target | |

## Execute

1. Merge the production GitOps pull request.
2. Open the production Argo CD application.
3. Review diff one final time.
4. Start manual sync.
5. Watch deployment rollout, replica readiness, and Kubernetes events.
6. Confirm the PostSync smoke test job succeeds.
7. Watch dashboards for at least one normal traffic window.

## Verify

Minimum signals:

- Availability is within SLO.
- Error rate is not materially elevated.
- P95/P99 latency is within expected range.
- Pod restarts, pending pods, and failed probes are not increasing.
- Critical business event rate is normal.
- Logs show no new high-volume errors.

Post a production PR comment with:

- Argo CD sync result
- Smoke test result
- Dashboard observation
- Final decision: success, rollback, or extended watch

## Rollback

Rollback when customer impact is confirmed, core SLOs are breached, or the release verifier cannot establish health within the agreed watch window.

Preferred rollback:

1. Revert the production GitOps image tag to the last known good image.
2. Merge the rollback PR or revert commit.
3. Sync the production Argo CD application.
4. Confirm smoke test and dashboards recover.
5. Add the rollback result to the original production PR.

Emergency rollback:

- If an immediate manual cluster action is required, record the command, operator, time, and reason.
- Reconcile the manual change back into GitOps as soon as service is stable.

## After the Change

- Close the production PR with verification evidence.
- Tag or publish release notes if this was a versioned release.
- Open incident or follow-up issues for any degraded signal.
- Update ADRs if the change altered production policy or platform architecture.

# 生产变更 Runbook

生产 GitOps 变更使用本文档，包括镜像晋级、配置变更和 hotfix 部署。执行人应在生产 PR 中持续补充链接和观察结果。

## 变更前

确认：

- 生产 PR 已获得必要审批。
- 晋级镜像与当前 Staging 运行镜像一致。
- GitOps 验证 workflow 通过。
- Staging smoke test 和回归证据已链接。
- 发布窗口已打开。
- 回滚镜像或 GitOps commit 已明确。
- 发布验证人和回滚负责人在线。
- 相关 dashboard 和告警频道已打开。

记录：

| 项目 | 值 |
|---|---|
| 生产 PR | |
| 镜像 | |
| Staging 来源 | |
| Argo CD app | |
| 验证人 | |
| 回滚负责人 | |
| 回滚目标 | |

## 执行

1. 合并生产 GitOps PR。
2. 打开生产 Argo CD Application。
3. 最后一次审查 diff。
4. 发起手动 sync。
5. 观察 deployment rollout、replica readiness 和 Kubernetes events。
6. 确认 PostSync smoke test job 成功。
7. 至少观察一个正常流量窗口的 dashboard。

## 验证

最低信号：

- 可用性在 SLO 范围内。
- 错误率没有明显升高。
- P95/P99 延迟在预期范围内。
- Pod restart、pending pod、probe 失败没有上升。
- 核心业务事件量正常。
- 日志中没有新的高频错误。

在生产 PR 中评论：

- Argo CD sync 结果
- Smoke test 结果
- Dashboard 观察
- 最终判断：成功、回滚或延长观察

## 回滚

当确认客户影响、核心 SLO 违约，或验证人在约定观察窗口内无法确认健康时，应回滚。

首选回滚：

1. 将生产 GitOps 镜像 tag 回退到上一个已知可用镜像。
2. 合并回滚 PR 或 revert commit。
3. 同步生产 Argo CD 应用。
4. 确认 smoke test 和 dashboard 恢复。
5. 将回滚结果补充到原生产 PR。

紧急回滚：

- 如果必须立即手工操作集群，需要记录命令、执行人、时间和原因。
- 服务稳定后，尽快将手工变更回写到 GitOps。

## 变更后

- 用验证证据关闭生产 PR。
- 如果这是版本化发布，创建 tag 或发布 release notes。
- 对任何异常信号创建事故或后续改进 issue。
- 如果变更影响生产策略或平台架构，更新 ADR。
