import { register } from "~/server/utils/metrics/prometheus";

export default defineEventHandler(async () => {
  return register.metrics();
});