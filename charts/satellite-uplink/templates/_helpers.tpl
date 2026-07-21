{{- define "uplink.registry" -}}
{{- $root := index . 0 -}}
{{- $component := index . 1 -}}
{{- $reg := coalesce $root.Values.global.imageRegistry $component.registry -}}
{{- if $reg }}{{ $reg }}/{{- end }}
{{- end }}