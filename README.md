# Mission Control Demo

Space-themed applications for Kubernetes demonstrations, security exercises, and
observability troubleshooting. Each application has a Helm chart in
[`charts`](./charts).

**Applications**
| Chart | What it does |
| --- | --- |
| [`mission-control`](charts/mission-control/) | React dashboard with Node.js services simulating station gravity, life support, and power cores, including configurable power-core failures. |
| [`aria`](charts/aria/) | Security exercise that compares the configured UI container image repository with an expected repository and changes the interface when they match. |
| [`sattrack`](charts/sattrack/) | Satellite tracking and telemetry microservices with load generation, optional OpenTelemetry tracing, and configurable memory-leak and latency scenarios. |
| [`deep-space-network`](charts/deep-space-network/) | Static Voyager communications dashboard served by Nginx, with a k6 load-generation job. |
| [`satellite-uplink`](charts/satellite-uplink/) | Static communications dashboard served by Nginx, with a k6 load-generation job and configurable container registries. |
| [`sal-9001`](charts/sal-9001/) | Browser terminal with scripted responses from a fictional station computer. |
| [`solar-power`](charts/solar-power/) | Browser visualization of simulated orbital solar-power generation and power budgets. |

**Deployment**

Requirements: a Kubernetes cluster, `kubectl` configured for that cluster, Helm,
and an ingress controller. Cluster nodes need access to the configured container
registries.

From the repository root, deploy Mission Control:

```bash
helm upgrade --install mission-control ./charts/mission-control \
  --namespace mission-control --create-namespace \
  --set ingress.host=mission-control.example.com \
  --set ingress.ingressClassName=nginx
```

Replace the hostname and ingress class with your cluster settings. Point the
hostname at your ingress controller. Configure the certificate secret through
`ingress.tls.secretName`, or provide the chart's default cert-manager issuer,
`letsencrypt-prod`. Open `https://mission-control.example.com` after the pods
are ready and the certificate is available.

To deploy another application, replace the release name, chart directory, and
namespace with its chart name. Check its `values.yaml` for configuration:

- Mission Control requires the `mission-control` namespace because its internal
  service addresses are hardcoded.
- Most charts use `ingress.host` and `ingress.className`. Mission Control uses
  `ingress.ingressClassName` instead.
- Deep Space Network uses `nginx.ingress.host`, `nginx.ingress.className`, and
  `nginx.ingress.tls.secretName`.
- TLS settings vary by chart. Supply the referenced certificate secret or
  configure certificate issuance before using HTTPS.

Use `-f my-values.yaml` for additional overrides. SATTRACK's
`telemetryStore.cacheEnabled` and `telemetryStore.frameValidation` enable fault
scenarios; both default to `false`.

Check the deployment or remove it:

```bash
kubectl get pods,svc,ingress -n mission-control
helm uninstall mission-control -n mission-control
```
