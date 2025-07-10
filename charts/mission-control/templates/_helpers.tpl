{{- define "mission-control.registry" -}}
{{- coalesce $.Values.global.imageRegistry .image.registry }}
{{- end }}
