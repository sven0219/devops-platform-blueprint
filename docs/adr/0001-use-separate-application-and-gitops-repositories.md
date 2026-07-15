# ADR 0001: Use Separate Application and GitOps Repositories

## Status

Accepted

## Context

The platform needs a clear boundary between application source code and deployment desired state. The application repository owns source code, tests, Dockerfile, image build, and security scanning. The GitOps repository owns environment values, Argo CD applications, promotion rules, and production audit history.

Keeping both concerns in one repository is simpler for demos, but it couples application code review with environment promotion and makes production permissions harder to isolate.

## Decision

Use two independent repositories:

- `app-repo`: application source, CI, image build, image scan, GHCR push, and automated Dev GitOps pull request creation.
- `gitops-repo`: Argo CD applications, Helm chart, environment values, smoke test hook, validation workflow, and promotion workflow.

The examples remain in one blueprint repository only as templates. When adopted, each directory should become the root of its own GitHub repository.

## Consequences

- Application teams can merge code without direct Kubernetes access.
- GitOps changes stay reviewable, auditable, and environment-scoped.
- Production permissions can be enforced through GitHub Environments, CODEOWNERS, and Argo CD controls.
- Cross-repository automation requires fine-grained tokens such as `GITOPS_TOKEN` and `PROMOTION_TOKEN`.
