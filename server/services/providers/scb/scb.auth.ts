import { postScbJson } from "./scb.client"
import type { ScbProviderConfig, ScbTokenResponse } from "./scb.types"

type CachedToken = {
  accessToken: string
  expiresAt: number
}

const tokenCache = new Map<string, CachedToken>()
const inflight = new Map<string, Promise<string>>()

function getCacheKey(config: ScbProviderConfig): string {
  return [
    config.apiBaseUrl,
    config.apiKey,
    config.billerId,
    config.merchantId || "",
  ].join("|")
}

function resolveTokenFromResponse(data: ScbTokenResponse | null): string {
  return (data?.data?.accessToken || data?.accessToken || "").trim()
}

function resolveExpiresInSec(data: ScbTokenResponse | null, fallbackSec: number): number {
  const raw = data?.data?.expiresIn ?? data?.expiresIn
  const parsed =
    typeof raw === "number"
      ? raw
      : typeof raw === "string" && raw.trim()
        ? Number(raw)
        : NaN

  if (Number.isFinite(parsed) && parsed > 0) {
    return Math.max(60, parsed)
  }

  return Math.max(60, fallbackSec)
}

export function clearScbTokenCache(): void {
  tokenCache.clear()
  inflight.clear()
}

export async function getScbAccessToken(config: ScbProviderConfig): Promise<string> {
  const cacheKey = getCacheKey(config)
  const now = Date.now()
  const cached = tokenCache.get(cacheKey)

  if (cached && cached.expiresAt > now + 30_000) {
    return cached.accessToken
  }

  const existingInflight = inflight.get(cacheKey)
  if (existingInflight) {
    return existingInflight
  }

  const promise = (async () => {
    const response = await postScbJson<ScbTokenResponse>({
      url: `${config.apiBaseUrl}${config.tokenPath}`,
      headers: {
        resourceOwnerId: config.apiKey,
        requestUId: crypto.randomUUID(),
      },
      body: {
        applicationKey: config.apiKey,
        applicationSecret: config.apiSecret,
      },
    })

    if (!response.ok) {
      throw new Error(`SCB token request failed with status ${response.status}`)
    }

    const accessToken = resolveTokenFromResponse(response.data)
    if (!accessToken) {
      throw new Error("SCB token response missing accessToken")
    }

    const ttlSec = resolveExpiresInSec(response.data, config.tokenCacheTtlSec)

    tokenCache.set(cacheKey, {
      accessToken,
      expiresAt: Date.now() + ttlSec * 1000,
    })

    return accessToken
  })()

  inflight.set(cacheKey, promise)

  try {
    return await promise
  } finally {
    inflight.delete(cacheKey)
  }
}