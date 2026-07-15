# Demo Service App Repository

This sample application repository demonstrates the application-side layout described by the DevOps platform blueprint.

## Layout

```text
src/                    Application source code
test/                   Unit or integration tests
Dockerfile              Container image definition
.github/CODEOWNERS      Review ownership template
.github/dependabot.yaml Dependency update schedule
.github/workflows/      CI and release workflows
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

## Release Contract

Push a semantic version tag such as `v1.4.0` to run `release.yaml`. The release workflow:

1. Runs tests.
2. Builds the image with both `vX.Y.Z` and `vX.Y.Z-<git-sha>` tags.
3. Scans the release image with Trivy.
4. Pushes both immutable tags to GHCR.
5. Creates GitHub release notes.

Promote the released image through the GitOps repository instead of rebuilding it for each environment.

## Repository Governance

- Replace `@example-org/*` in `.github/CODEOWNERS` with real teams before requiring owner reviews.
- Use the PR template to capture validation and deployment impact.
- Dependabot opens weekly pull requests for npm and GitHub Actions updates.

This directory represents an independent application repository. Its nested workflow only runs after the directory is used as the root of its own GitHub repository.
