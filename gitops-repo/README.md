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
```

Production changes should be reviewed through pull requests. CI from the application repository should update image tags through GitOps changes, not by running `kubectl apply` directly against clusters.
