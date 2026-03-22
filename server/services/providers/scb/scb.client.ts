import type { ScbAuditPayload, ScbTransportResponse } from "./scb.types"

type PostArgs = {
  url: string
  headers?: Record<string, string>
  body?: unknown
  bearerToken?: string
  timeoutMs?: number
}

function sanitizeHeaders(headers?: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}

  for (const [key, value] of Object.entries(headers || {})) {
    const lower = key.toLowerCase()

    if (
      lower.includes("authorization") ||
      lower.includes("secret") ||
      lower.includes("token") ||
      lower.includes("api-key")
    ) {
      out[key] = "***"
    } else {
      out[key] = value
    }
  }

  return out
}

export function buildScbAuditRequest(args: PostArgs): ScbAuditPayload {
  return {
    url: args.url,
    headers: sanitizeHeaders(args.headers),
    body: args.body,
  }
}

export function buildScbAuditResponse<T>(response: ScbTransportResponse<T>) {
  return {
    ok: response.ok,
    status: response.status,
    headers: sanitizeHeaders(response.headers),
    data: response.data,
  }
}

export async function postScbJson<T>(args: PostArgs): Promise<ScbTransportResponse<T>> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), args.timeoutMs ?? 15_000)

  try {
    const requestHeaders: Record<string, string> = {
      "content-type": "application/json",
      accept: "application/json",
      ...args.headers,
    }

    if (args.bearerToken) {
      requestHeaders.authorization = `Bearer ${args.bearerToken}`
    }

    const init: RequestInit = {
      method: "POST",
      headers: requestHeaders,
      signal: controller.signal,
    }

    if (args.body !== undefined) {
      init.body = JSON.stringify(args.body)
    }

    const response = await fetch(args.url, init)

    const rawText = await response.text()

    let data: T | null = null
    if (rawText) {
      try {
        data = JSON.parse(rawText) as T
      } catch {
        data = null
      }
    }

    const headers: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      headers[key] = value
    })

    return {
      ok: response.ok,
      status: response.status,
      headers,
      data,
      rawText,
    }
  } finally {
    clearTimeout(timeout)
  }
}