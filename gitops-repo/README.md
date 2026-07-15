# Demo GitOps Repository

This sample GitOps repository demonstrates the deployment-side layout described by the DevOps platform blueprint.

## Layout

```text
argocd-apps/
  root-app.yaml          App of Apps entry point
  dev/                   Environment ArgoCD Applications
  test/
  staging/
  prod/
charts/
  demo-service/          Reusable Helm chart
environments/
  dev/                   Environment-specific Helm values
  test/
  staging/
  prod/
.github/workflows/
  validate.yaml          Render and validate every environment
  promote.yaml           Copy one immutable image to the next environment
.github/CODEOWNERS       Review ownership by environment and path
.github/dependabot.yaml  Dependency update schedule for workflows
```

## Delivery Flow

1. The application repository creates a pull request that updates the Dev image.
2. `validate.yaml` lints and renders the chart for all four environments.
3. Merging the Dev pull request lets Argo CD deploy automatically.
4. The chart's Argo CD `PostSync` hook calls `/healthz`; a failed smoke test marks the sync as failed.
5. Run `Promote demo-service` and select `test`, `staging`, or `prod`. The workflow always copies the exact image from the previous environment and creates a pull request.
6. Dev, Test, and Staging sync automatically after merge. Production remains a manual Argo CD sync.

Promotion routes are fixed:

| Target | Image source |
|---|---|
| Test | Dev |
| Staging | Test |
| Prod | Staging |

Configure the GitOps GitHub repository with a `PROMOTION_TOKEN` secret. Use a fine-grained token with Contents and Pull requests write access to this repository. A token other than the workflow `GITHUB_TOKEN` ensures that validation workflows run for automatically created promotion pull requests.

Create GitHub Environments named `test`, `staging`, and `prod`; add required reviewers where promotion approval is needed. Before bootstrapping Argo CD, replace the `example-org` repository and image references and register the `prod-cluster` destination.

Production changes must be reviewed through pull requests. CI updates Git state and never runs `kubectl apply` against a cluster.

## Repository Governance

- Replace `@example-org/*` in `.github/CODEOWNERS` with real teams before requiring owner reviews.
- Protect `main` and require `validate.yaml` before merge.
- Require CODEOWNER review for `environments/prod/`, `argocd-apps/prod/`, and promotion workflow changes.
- Dependabot opens weekly pull requests for GitHub Actions updates.
- Use the PR template to record target environment, rendered manifest validation, image reference, rollback image or commit, and production approval status.

This directory represents an independent GitOps repository. Its nested workflows only run after the directory is used as the root of its own GitHub repository.
