const { NodeSDK } = require('@opentelemetry/sdk-node');
const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
const { OTLPTraceExporter } = require('@opentelemetry/exporter-trace-otlp-http'); // Use HTTP Exporter
const { B3Propagator } = require('@opentelemetry/propagator-b3');

const otlpEndpoint = process.env.OTLP_ENDPOINT || "http://otel-collector:4318/v1/traces"; // Default endpoint

const sdk = new NodeSDK({
  traceExporter: new OTLPTraceExporter({
    url: otlpEndpoint, // Sends traces to an OTLP endpoint
  }),
  textMapPropagator: new B3Propagator(), // B3 for better trace correlation
  instrumentations: [getNodeAutoInstrumentations()],
});

sdk.start()
