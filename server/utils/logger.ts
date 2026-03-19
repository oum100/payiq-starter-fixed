export function logWebhook(data: any) {
  console.log(
    JSON.stringify({
      type: "webhook",
      ...data,
      ts: new Date().toISOString(),
    })
  );
}