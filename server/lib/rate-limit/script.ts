export const TOKEN_BUCKET_LUA = `
local key = KEYS[1]

local nowMs = tonumber(ARGV[1])
local capacity = tonumber(ARGV[2])
local refillRatePerSec = tonumber(ARGV[3])
local cost = tonumber(ARGV[4])
local ttlSec = tonumber(ARGV[5])

local data = redis.call("HMGET", key, "tokens", "ts")

local tokens = tonumber(data[1])
local ts = tonumber(data[2])

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

if tokens >= cost then
  tokens = tokens - cost
  allowed = 1
else
  local needed = cost - tokens
  if refillRatePerSec > 0 then
    retryAfterSec = math.ceil(needed / refillRatePerSec)
  else
    retryAfterSec = ttlSec
  end
end

local missing = capacity - tokens
if refillRatePerSec > 0 then
  resetAfterSec = math.ceil(missing / refillRatePerSec)
else
  resetAfterSec = ttlSec
end

redis.call("HSET", key, "tokens", tokens, "ts", ts)
redis.call("EXPIRE", key, ttlSec)

return {
  allowed,
  math.floor(tokens),
  retryAfterSec,
  resetAfterSec
}
`;