# Service Onboarding Guide

Use this guide when a new service adopts the platform blueprint. The goal is to make every service build the same way, publish immutable images, deploy through GitOps, and expose enough runtime evidence for safe promotion.

## 1. Create Repositories

1. Create an application repository from `examples/app-repo/`.
2. Create or extend a GitOps repository from `examples/gitops-repo/`.
3. Replace `demo-service` with the real service name in:
   - `package.json`
   - `Dockerfile`
   - `.github/workflows/*.yaml`
   - `charts/<service>/`
   - `environments/*/<service>-values.yaml`
   - `argocd-apps/*/<service>.yaml`
4. Replace `@example-org/*` in CODEOWNERS with real teams.
5. Protect `main` and require pull request review plus required checks.

## 2. Configure Application Repository

Required settings:

| Type | Name | Purpose |
|---|---|---|
| Repository variable | `GITOPS_REPOSITORY` | Target GitOps repository in `owner/repository` form |
| Repository secret | `GITOPS_TOKEN` | Fine-grained token with Contents and Pull requests write access to the GitOps repository |

Required GitHub Actions permissions:

- `contents: read`
- `packages: write`

Required service files:

- `Dockerfile`
- Unit or integration tests
- Health endpoint used by Kubernetes probes and smoke tests
- OCI image labels for source, revision, version, and creation time

## 3. Configure GitOps Repository

Required settings:

| Type | Name | Purpose |
|---|---|---|
| Repository secret | `PROMOTION_TOKEN` | Fine-grained token with Contents and Pull requests write access to the GitOps repository |
| GitHub Environment | `test` | Optional required reviewers for Test promotion |
| GitHub Environment | `staging` | Required reviewers for Staging promotion |
| GitHub Environment | `prod` | Required production reviewers |

Required GitOps files:

- Environment values for `dev`, `test`, `staging`, and `prod`
- Argo CD applications for every target environment
- Helm chart or Kustomize overlay
- PostSync smoke test or equivalent deployment verification
- CODEOWNERS rules for production paths

## 4. Runtime Requirements

Every onboarded service should provide:

- `GET /healthz` or equivalent liveness/readiness endpoint.
- Resource requests and limits.
- Readiness and liveness probes.
- Structured logs with service, environment, level, timestamp, and trace ID fields.
- Basic RED metrics: request rate, error rate, and duration.
- A rollback-safe deployment strategy.

## 5. Promotion Readiness

Before the first production release, confirm:

- Dev deploys automatically after the Dev GitOps PR is merged.
- Smoke tests fail the Argo CD sync when the service is unhealthy.
- Test, Staging, and Prod promotions copy the same image tag from the previous environment.
- Production sync is manual or protected by an approval gate.
- Rollback is tested by reverting to a previous image tag.
- Dashboards and alerts exist for production verification.

## 6. Acceptance Checklist

- [ ] Application repository has CODEOWNERS, PR template, Dependabot, CI, and release workflow.
- [ ] GitOps repository has CODEOWNERS, PR template, Dependabot, validation workflow, and promotion workflow.
- [ ] Required secrets and repository variables are configured.
- [ ] Required GitHub Environments are configured.
- [ ] `main` branch protection requires CI and owner review.
- [ ] Dev deployment path has been exercised end to end.
- [ ] Production runbook owner and rollback owner are known.

# 服务接入指南

新服务接入平台蓝图时使用本文档。目标是让每个服务用同样的方式构建、发布不可变镜像、通过 GitOps 部署，并提供足够的运行证据支撑逐环境晋级。

## 1. 创建仓库

1. 基于 `examples/app-repo/` 创建应用仓库。
2. 基于 `examples/gitops-repo/` 创建或扩展 GitOps 仓库。
3. 将 `demo-service` 替换为真实服务名，至少包括：
   - `package.json`
   - `Dockerfile`
   - `.github/workflows/*.yaml`
   - `charts/<service>/`
   - `environments/*/<service>-values.yaml`
   - `argocd-apps/*/<service>.yaml`
4. 将 CODEOWNERS 中的 `@example-org/*` 替换为真实团队。
5. 保护 `main` 分支，并要求 PR 评审和必要检查通过。

## 2. 配置应用仓库

必要配置：

| 类型 | 名称 | 用途 |
|---|---|---|
| Repository variable | `GITOPS_REPOSITORY` | 目标 GitOps 仓库，格式为 `owner/repository` |
| Repository secret | `GITOPS_TOKEN` | 对 GitOps 仓库有 Contents 和 Pull requests 写权限的 fine-grained token |

必要 GitHub Actions 权限：

- `contents: read`
- `packages: write`

必要服务文件：

- `Dockerfile`
- 单元测试或集成测试
- 供 Kubernetes probe 和 smoke test 使用的健康检查接口
- 包含 source、revision、version、created 的 OCI 镜像标签

## 3. 配置 GitOps 仓库

必要配置：

| 类型 | 名称 | 用途 |
|---|---|---|
| Repository secret | `PROMOTION_TOKEN` | 对 GitOps 仓库有 Contents 和 Pull requests 写权限的 fine-grained token |
| GitHub Environment | `test` | 可选的 Test 晋级审批人 |
| GitHub Environment | `staging` | Staging 晋级审批人 |
| GitHub Environment | `prod` | 生产审批人 |

必要 GitOps 文件：

- `dev`、`test`、`staging`、`prod` 环境 values
- 每个目标环境的 Argo CD Application
- Helm chart 或 Kustomize overlay
- PostSync smoke test 或等价部署验证
- 面向生产路径的 CODEOWNERS 规则

## 4. 运行时要求

每个接入服务应提供：

- `GET /healthz` 或等价存活/就绪接口。
- 资源 requests 和 limits。
- readiness 和 liveness probes。
- 包含 service、environment、level、timestamp、trace ID 的结构化日志。
- 基础 RED 指标：请求量、错误率、请求耗时。
- 可回滚的部署策略。

## 5. 晋级就绪检查

首次生产发布前确认：

- Dev GitOps PR 合并后能自动部署到 Dev。
- 服务异常时 smoke test 会让 Argo CD sync 失败。
- Test、Staging、Prod 晋级始终从上一环境复制同一个镜像 tag。
- 生产同步是手动的，或受到审批门禁保护。
- 已通过回退到旧镜像 tag 验证回滚路径。
- 已有用于生产验证的 dashboard 和告警。

## 6. 验收清单

- [ ] 应用仓库具备 CODEOWNERS、PR 模板、Dependabot、CI 和 release workflow。
- [ ] GitOps 仓库具备 CODEOWNERS、PR 模板、Dependabot、验证 workflow 和晋级 workflow。
- [ ] 必要 secrets 和 repository variables 已配置。
- [ ] 必要 GitHub Environments 已配置。
- [ ] `main` 分支保护要求 CI 和 owner review。
- [ ] Dev 部署链路已端到端跑通。
- [ ] 生产 runbook owner 和 rollback owner 已明确。
