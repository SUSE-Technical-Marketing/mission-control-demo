{{- define "mission-control.registry" -}}
{{- $root := index . 0 -}}
{{- $component := index . 1 -}}
{{- coalesce $root.Values.global.imageRegistry $component.image.registry }}
{{- end }}
