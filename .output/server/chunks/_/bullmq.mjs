import { Queue } from 'bullmq';
import { j as redis } from '../nitro/nitro.mjs';

const queueNames = {
  callback: "payiq-callback",
  webhook: "payiq-webhook",
  webhookInbound: "payiq-webhook-inbound",
  reconcile: "payiq-reconcile"
};
const callbackQueue = new Queue(queueNames.callback, {
  connection: redis
});
new Queue(queueNames.webhook, {
  connection: redis
});
const webhookInboundQueue = new Queue(queueNames.webhookInbound, {
  connection: redis
});
new Queue(queueNames.reconcile, {
  connection: redis
});

export { callbackQueue as c, webhookInboundQueue as w };
//# sourceMappingURL=bullmq.mjs.map
