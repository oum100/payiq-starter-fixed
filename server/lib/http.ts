export async function postJson<T>(
  url: string,
  body: unknown,
  headers: Record<string, string> = {},
): Promise<{ status: number; data: T; headers: Headers }> {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers,
    },
    body: JSON.stringify(body),
  })

  const data = (await res.json().catch(() => ({}))) as T
  return { status: res.status, data, headers: res.headers }
}
