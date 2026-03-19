import client from "prom-client";


const register = new client.Registry();

client.collectDefaultMetrics({ register });

export const webhookMetrics = {
  processed: new client.Counter({
    name: "webhook_processed_total",
    help: "Total processed webhooks",
  }),
  failed: new client.Counter({
    name: "webhook_failed_total",
    help: "Total failed webhooks",
  }),
  completed: new client.Counter({
    name: "webhook_completed_total",
    help: "Completed jobs",
  }),
};

register.registerMetric(webhookMetrics.processed);
register.registerMetric(webhookMetrics.failed);
register.registerMetric(webhookMetrics.completed);

export { register };