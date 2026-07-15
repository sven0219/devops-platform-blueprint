## Summary

- 

## Environment

- [ ] Dev
- [ ] Test
- [ ] Staging
- [ ] Prod

## Validation

- [ ] `helm lint charts/demo-service --values environments/<env>/demo-service-values.yaml`
- [ ] `helm template demo-service charts/demo-service --values environments/<env>/demo-service-values.yaml`
- [ ] Argo CD diff reviewed when applicable

## Release / Rollback

- Image:
- Rollback image or commit:
- Smoke test expectation:

## Production Checklist

- [ ] Not production
- [ ] Production approvers assigned
- [ ] Monitoring dashboard checked
- [ ] Rollback owner identified
