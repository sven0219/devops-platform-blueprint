# Demo Service App Repository

This sample application repository demonstrates the application-side layout described by the DevOps platform blueprint.

## Layout

```text
src/                    Application source code
test/                   Unit or integration tests
Dockerfile              Container image definition
.github/workflows/      GitHub Actions CI workflows
```

## Local Development

```bash
npm install
npm test
npm start
```

The service exposes:

- `GET /` for a simple service response.
- `GET /healthz` for Kubernetes liveness and readiness probes.

## CI/CD Contract

The CI workflow implements the application side of the minimum delivery loop:

1. Validate pull requests with tests and dependency scanning.
2. Build and scan `ghcr.io/<owner>/demo-service:v<version>-<git-sha>` after a merge to `main`.
3. Push the immutable image to GHCR only after the scan passes.
4. Update `environments/dev/demo-service-values.yaml` in the GitOps repository.
5. Open a Dev deployment pull request without directly accessing Kubernetes.

Configure the application GitHub repository with:

| Type | Name | Purpose |
|---|---|---|
| Repository variable | `GITOPS_REPOSITORY` | GitOps repository in `owner/repository` form |
| Repository secret | `GITOPS_TOKEN` | Fine-grained token with Contents and Pull requests write access to the GitOps repository |

GHCR publishing uses the workflow's built-in `GITHUB_TOKEN`. Enable package write access for GitHub Actions if organization policy overrides workflow permissions.

This directory represents an independent application repository. Its nested workflow only runs after the directory is used as the root of its own GitHub repository.
