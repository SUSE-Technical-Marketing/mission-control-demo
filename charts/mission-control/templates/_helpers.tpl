{{- define "mission-control.registry" -}}
{{- coalesce .Values.global.imageRegistry .Values.image.registry }}
{{- end }}
