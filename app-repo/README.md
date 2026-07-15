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

The CI workflow validates pull requests and builds a versioned image on `main`. In a real deployment, the image tag should be propagated to the GitOps repository through a pull request instead of directly mutating production Kubernetes resources.
