export const TOKEN_BUCKET_LUA = `
local key = KEYS[1]

local nowMs = tonumber(ARGV[1])
local capacity = tonumber(ARGV[2])
local refillRatePerSec = tonumber(ARGV[3])
local cost = tonumber(ARGV[4])
local ttlSec = tonumber(ARGV[5])
local blockDurationSec = tonumber(ARGV[6])

local data = redis.call("HMGET", key, "tokens", "ts", "blockedUntil")
local tokens = tonumber(data[1])
local ts = tonumber(data[2])
local blockedUntil = tonumber(data[3])

if blockedUntil ~= nil and blockedUntil > nowMs then
  local retryAfterSec = math.ceil((blockedUntil - nowMs) / 1000)
  return {0, math.floor(tokens or 0), retryAfterSec, retryAfterSec, 1, retryAfterSec}
end

if tokens == nil then
  tokens = capacity
end

if ts == nil then
  ts = nowMs
end

if nowMs > ts then
  local elapsedMs = nowMs - ts
  local refill = (elapsedMs / 1000.0) * refillRatePerSec
  tokens = math.min(capacity, tokens + refill)
  ts = nowMs
end

local allowed = 0
local retryAfterSec = 0
local resetAfterSec = 0
local blocked = 0
local blockRemainingSec = 0

if tokens >= cost then
  tokens = tokens - cost
  allowed = 1
else
  local needed = cost - tokens

  if refillRatePerSec > 0 then
    retryAfterSec = math.ceil(needed / refillRatePerSec)
    resetAfterSec = math.ceil((capacity - tokens) / refillRatePerSec)
  else
    retryAfterSec = ttlSec
    resetAfterSec = ttlSec
  end

  if blockDurationSec > 0 then
    local blockedUntilMs = nowMs + (blockDurationSec * 1000)
    redis.call("HSET", key, "blockedUntil", blockedUntilMs)
    blocked = 1
    blockRemainingSec = blockDurationSec
    retryAfterSec = math.max(retryAfterSec, blockDurationSec)
    resetAfterSec = math.max(resetAfterSec, blockDurationSec)
  end
end

if allowed == 1 then
  local missing = capacity - tokens
  if refillRatePerSec > 0 then
    resetAfterSec = math.ceil(missing / refillRatePerSec)
  else
    resetAfterSec = ttlSec
  end
end

redis.call("HSET", key, "tokens", tokens, "ts", ts)
redis.call("EXPIRE", key, ttlSec)

return {
  allowed,
  math.floor(tokens),
  retryAfterSec,
  resetAfterSec,
  blocked,
  blockRemainingSec
}
`;