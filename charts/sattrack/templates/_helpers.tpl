{{/*
  _helpers.tpl — reusable template fragments for the sattrack chart
*/}}

{{/*
  sattrack.labels — common labels applied to every resource
  Usage: {{ include "sattrack.labels" (dict "app" "orbit-engine" "root" .) }}
*/}}
{{- define "sattrack.labels" -}}
app.kubernetes.io/name: {{ .root.Chart.Name }}
app.kubernetes.io/instance: {{ .root.Release.Name }}
app.kubernetes.io/component: {{ .app }}
app.kubernetes.io/part-of: {{ .root.Chart.Name }}
app.kubernetes.io/managed-by: {{ .root.Release.Service }}
{{- end }}

{{/*
  sattrack.selectorLabels — minimal labels used in matchLabels / Service selector
  Usage: {{ include "sattrack.selectorLabels" (dict "app" "orbit-engine" "root" .) }}
*/}}
{{- define "sattrack.selectorLabels" -}}
app: {{ .app }}
release: {{ .root.Release.Name }}
{{- end }}

{{/*
  sattrack.otelInitContainer — init container that installs OTel packages
  into an emptyDir shared with the main container.

  Expects the pod spec to declare two volumes:
    - name: otel-src      (from the otel-tracing ConfigMap)
    - name: node-modules  (emptyDir)

  Usage: {{ include "sattrack.otelInitContainer" . }}
*/}}
{{- define "sattrack.otelInitContainer" -}}
- name: install-otel
  image: node:20-alpine
  command:
    - sh
    - -c
    - |
      cp /otel-src/package.json /app/
      cd /app
      npm install --omit=dev --no-fund --no-audit 2>&1
      cp /otel-src/tracing.js /app/
  volumeMounts:
    - name: otel-src
      mountPath: /otel-src
    - name: node-modules
      mountPath: /app
{{- end }}

{{/*
  sattrack.otelVolumes — the two volumes required by the OTel init container
  and main container volume mounts.

  Usage: {{ include "sattrack.otelVolumes" . }}
*/}}
{{- define "sattrack.otelVolumes" -}}
- name: otel-src
  configMap:
    name: {{ .Release.Name }}-otel-tracing
- name: node-modules
  emptyDir: {}
{{- end }}

{{/*
  sattrack.otelVolumeMounts — volume mounts for the main Node.js container
  to access tracing.js and node_modules installed by the init container.

  Usage: {{ include "sattrack.otelVolumeMounts" . }}
*/}}
{{- define "sattrack.otelVolumeMounts" -}}
- name: node-modules
  mountPath: /app/tracing.js
  subPath: tracing.js
- name: node-modules
  mountPath: /app/node_modules
  subPath: node_modules
{{- end }}

{{/*
  sattrack.otelEnv — standard OpenTelemetry env vars injected into every
  Node.js service container.

  Usage: {{ include "sattrack.otelEnv" (dict "service" "orbit-engine" "root" .) }}
*/}}
{{- define "sattrack.otelEnv" -}}
- name: OTEL_SERVICE_NAME
  value: {{ .service }}
- name: OTEL_EXPORTER_OTLP_ENDPOINT
  value: {{ .root.Values.otel.endpoint | quote }}
- name: OTEL_RESOURCE_ATTRIBUTES
  value: "deployment.environment={{ .root.Release.Namespace }},release={{ .root.Release.Name }}"
{{- end }}

{{/*
  sattrack.nodeCommand — standard command to start a Node.js service
  with the OTel require hook.

  Usage: {{ include "sattrack.nodeCommand" . }}
*/}}
{{- define "sattrack.nodeCommand" -}}
- node
- --require
- /app/tracing.js
- /app/server.js
{{- end }}
