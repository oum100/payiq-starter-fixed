export async function processWebhook(data: {
  provider: string;
  rawBody: string;
  merchantId?: string;
}) {
  switch (data.provider) {
    case "scb":
      return handleSCB(data);
    case "kbank":
      return handleKBank(data);
    default:
      throw new Error("unknown provider");
  }
}

// 🔌 provider-specific logic

async function handleSCB(data: any) {
  console.log("SCB webhook", data.rawBody);

  // TODO: update payment status
}

async function handleKBank(data: any) {
  console.log("KBANK webhook", data.rawBody);

  // TODO: update payment status
}