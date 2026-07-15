# Release and Hotfix Process

This blueprint uses one immutable image promoted across environments. A release is a controlled promotion of an image that already passed the application CI pipeline and lower-environment smoke tests.

## Standard Release

1. Merge application code into `main`.
2. Let CI build, scan, and push the immutable GHCR image.
3. Review and merge the automatically generated Dev GitOps pull request.
4. Confirm Argo CD sync and the PostSync smoke test in Dev.
5. Run `Promote demo-service` in the GitOps repository for `test`.
6. Review and merge the Test promotion pull request.
7. Repeat the same promotion path for `staging`.
8. Create a GitHub Release from the application repository after staging sign-off.
9. Promote the same image from `staging` to `prod`.
10. Review the production pull request, confirm the rollback plan, and manually sync the production Argo CD application.

## Versioning

- Application images use `v<package-version>-<short-sha>` for continuous delivery builds.
- Release tags use semantic versions such as `v1.4.0`.
- A release must point to a Git commit whose image already passed CI scan and lower-environment validation.
- Production must run an immutable image tag. `latest` is never allowed.

## Hotfix

1. Branch from the currently deployed production commit or the latest known good release tag.
2. Apply the smallest possible fix and open a pull request.
3. Run the normal PR checks.
4. Merge to `main` or a dedicated `hotfix/<version>` branch according to the team's branching model.
5. Build and scan the hotfix image.
6. Promote the exact hotfix image through the required lower environments. In a severity-one incident, Test or Staging dwell time may be shortened, but the GitOps pull request and audit trail stay mandatory.
7. Merge the production GitOps pull request and manually sync production.
8. Backport or forward-port the fix so `main` remains the source of truth.
9. Complete the incident review and record follow-up actions.

## Rollback

- Prefer reverting the GitOps image tag to the last known good production image.
- If the chart or configuration caused the issue, revert the GitOps commit.
- Record the rollback owner, verification steps, and dashboard links in the production pull request.

## Approvals

| Change | Required Review |
|---|---|
| Dev deployment | Application owner or platform owner |
| Test promotion | QA or application owner |
| Staging promotion | Application owner and SRE |
| Production promotion | Application owner, SRE, and security when risk is material |
| Hotfix | Incident commander plus production approver |

# 发布与 Hotfix 流程

本蓝图采用“同一个不可变镜像逐环境晋级”的发布模型。发布不是重新构建镜像，而是把已经通过 CI、低环境部署和 smoke test 的镜像逐步提升到更高环境。

## 标准发布

1. 应用代码合并到 `main`。
2. CI 构建、扫描并推送不可变 GHCR 镜像。
3. 审查并合并自动生成的 Dev GitOps PR。
4. 确认 Argo CD 在 Dev 同步成功，并通过 PostSync smoke test。
5. 在 GitOps 仓库运行 `Promote demo-service`，目标选择 `test`。
6. 审查并合并 Test 晋级 PR。
7. 对 `staging` 重复同样的晋级流程。
8. Staging 验收通过后，在应用仓库创建 GitHub Release。
9. 将同一镜像从 `staging` 晋级到 `prod`。
10. 审查生产 PR，确认回滚方案，并手动同步生产 Argo CD 应用。

## 版本规范

- 持续交付镜像使用 `v<package-version>-<short-sha>`。
- 正式 Release tag 使用语义化版本，例如 `v1.4.0`。
- Release 必须指向已经通过 CI 扫描和低环境验证的提交。
- 生产必须使用不可变镜像 tag，禁止 `latest`。

## Hotfix

1. 从当前生产提交或最近一个可用 Release tag 拉出分支。
2. 只做必要的最小修复，并提交 PR。
3. 执行正常 PR 检查。
4. 根据团队分支模型合并到 `main` 或专用 `hotfix/<version>` 分支。
5. 构建并扫描 hotfix 镜像。
6. 将同一个 hotfix 镜像晋级到必要的低环境。一级事故可以缩短 Test 或 Staging 停留时间，但 GitOps PR 和审计记录必须保留。
7. 合并生产 GitOps PR，并手动同步生产。
8. 将修复回合或前合，保证 `main` 仍是事实来源。
9. 完成事故复盘并记录后续改进项。

## 回滚

- 优先把 GitOps 中的镜像 tag 回退到上一个生产可用镜像。
- 如果问题来自 chart 或配置，回退 GitOps commit。
- 在生产 PR 中记录回滚负责人、验证步骤和监控面板链接。

## 审批

| 变更 | 必要评审 |
|---|---|
| Dev 部署 | 应用负责人或平台负责人 |
| Test 晋级 | QA 或应用负责人 |
| Staging 晋级 | 应用负责人和 SRE |
| 生产晋级 | 应用负责人、SRE，风险较高时增加安全负责人 |
| Hotfix | 事故指挥人和生产审批人 |
