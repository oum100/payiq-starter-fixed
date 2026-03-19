import process from 'node:process';globalThis._importMeta_={url:import.meta.url,env:process.env};import { tmpdir } from 'node:os';
import { defineEventHandler, handleCacheHeaders, splitCookiesString, createEvent, fetchWithEvent, isEvent, eventHandler, setHeaders, sendRedirect, proxyRequest, getRequestHeader, setResponseHeaders, setResponseStatus, send, getRequestHeaders, setResponseHeader, appendResponseHeader, getRequestURL, getResponseHeader, removeResponseHeader, createError, getHeader, getRequestIP, getQuery as getQuery$1, readBody, createApp, createRouter as createRouter$1, toNodeListener, lazyEventHandler, getResponseStatus, getRouterParam, readRawBody, getHeaders, getResponseStatusText } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/h3/dist/index.mjs';
import * as http$1 from 'node:http';
import { Server } from 'node:http';
import { resolve, dirname, join } from 'node:path';
import crypto$1, { randomBytes, createHash, timingSafeEqual as timingSafeEqual$1, createHmac } from 'node:crypto';
import { parentPort, threadId } from 'node:worker_threads';
import { escapeHtml } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/@vue/shared/dist/shared.cjs.js';
import * as node_util from 'node:util';
import * as tdigest from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/tdigest/tdigest.js';
import * as node_url from 'node:url';
import { fileURLToPath } from 'node:url';
import * as node_https from 'node:https';
import * as node_zlib from 'node:zlib';
import * as node_fs from 'node:fs';
import { promises } from 'node:fs';
import * as node_process from 'node:process';
import * as node_v8 from 'node:v8';
import * as node_cluster from 'node:cluster';
import { z } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/zod/index.js';
import { nanoid } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/nanoid/index.js';
import { PrismaClient, Prisma } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/@prisma/client/default.js';
import BullMQ, { Queue as Queue$1 } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/bullmq/dist/cjs/index.js';
import IORedis from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/ioredis/built/index.js';
import { createRenderer, getRequestDependencies, getPreloadLinks, getPrefetchLinks } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/vue-bundle-renderer/dist/runtime.mjs';
import { parseURL, withoutBase, joinURL, getQuery, withQuery, withTrailingSlash, decodePath, withLeadingSlash, withoutTrailingSlash, joinRelativeURL } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/ufo/dist/index.mjs';
import destr, { destr as destr$1 } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/destr/dist/index.mjs';
import { createHooks } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/nitropack/node_modules/hookable/dist/index.mjs';
import { createFetch, Headers as Headers$1 } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/ofetch/dist/node.mjs';
import { fetchNodeRequestHandler, callNodeRequestHandler } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/node-mock-http/dist/index.mjs';
import { createStorage, prefixStorage } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/unstorage/dist/index.mjs';
import unstorage_47drivers_47fs from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/unstorage/drivers/fs.mjs';
import { digest } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/ohash/dist/index.mjs';
import { klona } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/klona/dist/index.mjs';
import defu, { defuFn } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/defu/dist/defu.mjs';
import { snakeCase } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/scule/dist/index.mjs';
import { getContext } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/unctx/dist/index.mjs';
import { toRouteMatcher, createRouter } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/radix3/dist/index.mjs';
import { readFile } from 'node:fs/promises';
import consola, { consola as consola$1 } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/consola/dist/index.mjs';
import { ErrorParser } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/youch-core/build/index.js';
import { Youch } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/youch/build/index.js';
import { SourceMapConsumer } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/source-map/source-map.js';
import { AsyncLocalStorage } from 'node:async_hooks';
import { stringify, uneval } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/devalue/index.js';
import { captureRawStackTrace, parseRawStackTrace } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/errx/dist/index.js';
import { isVNode, isRef, toValue } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/vue/index.mjs';
import _wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/@nuxt/vite-builder/dist/fix-stacktrace.mjs';
import { dirname as dirname$1, resolve as resolve$1 } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/pathe/dist/index.mjs';
import { createHead as createHead$1, propsToString, renderSSRHead } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/unhead/dist/server.mjs';
import { renderToString } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/vue/server-renderer/index.mjs';
import { walkResolver } from 'file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/node_modules/unhead/dist/utils.mjs';

const serverAssets = [{"baseName":"server","dir":"/Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/server/assets"}];

const assets$1 = createStorage();

for (const asset of serverAssets) {
  assets$1.mount(asset.baseName, unstorage_47drivers_47fs({ base: asset.dir, ignore: (asset?.ignore || []) }));
}

const storage = createStorage({});

storage.mount('/assets', assets$1);

storage.mount('root', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed","watchOptions":{"ignored":[null]}}));
storage.mount('src', unstorage_47drivers_47fs({"driver":"fs","readOnly":true,"base":"/Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/server","watchOptions":{"ignored":[null]}}));
storage.mount('build', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/.nuxt"}));
storage.mount('cache', unstorage_47drivers_47fs({"driver":"fs","readOnly":false,"base":"/Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/.nuxt/cache"}));
storage.mount('data', unstorage_47drivers_47fs({"driver":"fs","base":"/Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/.data/kv"}));

function useStorage(base = "") {
  return base ? prefixStorage(storage, base) : storage;
}

const Hasher = /* @__PURE__ */ (() => {
  class Hasher2 {
    buff = "";
    #context = /* @__PURE__ */ new Map();
    write(str) {
      this.buff += str;
    }
    dispatch(value) {
      const type = value === null ? "null" : typeof value;
      return this[type](value);
    }
    object(object) {
      if (object && typeof object.toJSON === "function") {
        return this.object(object.toJSON());
      }
      const objString = Object.prototype.toString.call(object);
      let objType = "";
      const objectLength = objString.length;
      objType = objectLength < 10 ? "unknown:[" + objString + "]" : objString.slice(8, objectLength - 1);
      objType = objType.toLowerCase();
      let objectNumber = null;
      if ((objectNumber = this.#context.get(object)) === void 0) {
        this.#context.set(object, this.#context.size);
      } else {
        return this.dispatch("[CIRCULAR:" + objectNumber + "]");
      }
      if (typeof Buffer !== "undefined" && Buffer.isBuffer && Buffer.isBuffer(object)) {
        this.write("buffer:");
        return this.write(object.toString("utf8"));
      }
      if (objType !== "object" && objType !== "function" && objType !== "asyncfunction") {
        if (this[objType]) {
          this[objType](object);
        } else {
          this.unknown(object, objType);
        }
      } else {
        const keys = Object.keys(object).sort();
        const extraKeys = [];
        this.write("object:" + (keys.length + extraKeys.length) + ":");
        const dispatchForKey = (key) => {
          this.dispatch(key);
          this.write(":");
          this.dispatch(object[key]);
          this.write(",");
        };
        for (const key of keys) {
          dispatchForKey(key);
        }
        for (const key of extraKeys) {
          dispatchForKey(key);
        }
      }
    }
    array(arr, unordered) {
      unordered = unordered === void 0 ? false : unordered;
      this.write("array:" + arr.length + ":");
      if (!unordered || arr.length <= 1) {
        for (const entry of arr) {
          this.dispatch(entry);
        }
        return;
      }
      const contextAdditions = /* @__PURE__ */ new Map();
      const entries = arr.map((entry) => {
        const hasher = new Hasher2();
        hasher.dispatch(entry);
        for (const [key, value] of hasher.#context) {
          contextAdditions.set(key, value);
        }
        return hasher.toString();
      });
      this.#context = contextAdditions;
      entries.sort();
      return this.array(entries, false);
    }
    date(date) {
      return this.write("date:" + date.toJSON());
    }
    symbol(sym) {
      return this.write("symbol:" + sym.toString());
    }
    unknown(value, type) {
      this.write(type);
      if (!value) {
        return;
      }
      this.write(":");
      if (value && typeof value.entries === "function") {
        return this.array(
          [...value.entries()],
          true
          /* ordered */
        );
      }
    }
    error(err) {
      return this.write("error:" + err.toString());
    }
    boolean(bool) {
      return this.write("bool:" + bool);
    }
    string(string) {
      this.write("string:" + string.length + ":");
      this.write(string);
    }
    function(fn) {
      this.write("fn:");
      if (isNativeFunction(fn)) {
        this.dispatch("[native]");
      } else {
        this.dispatch(fn.toString());
      }
    }
    number(number) {
      return this.write("number:" + number);
    }
    null() {
      return this.write("Null");
    }
    undefined() {
      return this.write("Undefined");
    }
    regexp(regex) {
      return this.write("regex:" + regex.toString());
    }
    arraybuffer(arr) {
      this.write("arraybuffer:");
      return this.dispatch(new Uint8Array(arr));
    }
    url(url) {
      return this.write("url:" + url.toString());
    }
    map(map) {
      this.write("map:");
      const arr = [...map];
      return this.array(arr, false);
    }
    set(set) {
      this.write("set:");
      const arr = [...set];
      return this.array(arr, false);
    }
    bigint(number) {
      return this.write("bigint:" + number.toString());
    }
  }
  for (const type of [
    "uint8array",
    "uint8clampedarray",
    "unt8array",
    "uint16array",
    "unt16array",
    "uint32array",
    "unt32array",
    "float32array",
    "float64array"
  ]) {
    Hasher2.prototype[type] = function(arr) {
      this.write(type + ":");
      return this.array([...arr], false);
    };
  }
  function isNativeFunction(f) {
    if (typeof f !== "function") {
      return false;
    }
    return Function.prototype.toString.call(f).slice(
      -15
      /* "[native code] }".length */
    ) === "[native code] }";
  }
  return Hasher2;
})();
function serialize(object) {
  const hasher = new Hasher();
  hasher.dispatch(object);
  return hasher.buff;
}
function hash(value) {
  return digest(typeof value === "string" ? value : serialize(value)).replace(/[-_]/g, "").slice(0, 10);
}

function defaultCacheOptions() {
  return {
    name: "_",
    base: "/cache",
    swr: true,
    maxAge: 1
  };
}
function defineCachedFunction(fn, opts = {}) {
  opts = { ...defaultCacheOptions(), ...opts };
  const pending = {};
  const group = opts.group || "nitro/functions";
  const name = opts.name || fn.name || "_";
  const integrity = opts.integrity || hash([fn, opts]);
  const validate = opts.validate || ((entry) => entry.value !== void 0);
  async function get(key, resolver, shouldInvalidateCache, event) {
    const cacheKey = [opts.base, group, name, key + ".json"].filter(Boolean).join(":").replace(/:\/$/, ":index");
    let entry = await useStorage().getItem(cacheKey).catch((error) => {
      console.error(`[cache] Cache read error.`, error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }) || {};
    if (typeof entry !== "object") {
      entry = {};
      const error = new Error("Malformed data read from cache.");
      console.error("[cache]", error);
      useNitroApp().captureError(error, { event, tags: ["cache"] });
    }
    const ttl = (opts.maxAge ?? 0) * 1e3;
    if (ttl) {
      entry.expires = Date.now() + ttl;
    }
    const expired = shouldInvalidateCache || entry.integrity !== integrity || ttl && Date.now() - (entry.mtime || 0) > ttl || validate(entry) === false;
    const _resolve = async () => {
      const isPending = pending[key];
      if (!isPending) {
        if (entry.value !== void 0 && (opts.staleMaxAge || 0) >= 0 && opts.swr === false) {
          entry.value = void 0;
          entry.integrity = void 0;
          entry.mtime = void 0;
          entry.expires = void 0;
        }
        pending[key] = Promise.resolve(resolver());
      }
      try {
        entry.value = await pending[key];
      } catch (error) {
        if (!isPending) {
          delete pending[key];
        }
        throw error;
      }
      if (!isPending) {
        entry.mtime = Date.now();
        entry.integrity = integrity;
        delete pending[key];
        if (validate(entry) !== false) {
          let setOpts;
          if (opts.maxAge && !opts.swr) {
            setOpts = { ttl: opts.maxAge };
          }
          const promise = useStorage().setItem(cacheKey, entry, setOpts).catch((error) => {
            console.error(`[cache] Cache write error.`, error);
            useNitroApp().captureError(error, { event, tags: ["cache"] });
          });
          if (event?.waitUntil) {
            event.waitUntil(promise);
          }
        }
      }
    };
    const _resolvePromise = expired ? _resolve() : Promise.resolve();
    if (entry.value === void 0) {
      await _resolvePromise;
    } else if (expired && event && event.waitUntil) {
      event.waitUntil(_resolvePromise);
    }
    if (opts.swr && validate(entry) !== false) {
      _resolvePromise.catch((error) => {
        console.error(`[cache] SWR handler error.`, error);
        useNitroApp().captureError(error, { event, tags: ["cache"] });
      });
      return entry;
    }
    return _resolvePromise.then(() => entry);
  }
  return async (...args) => {
    const shouldBypassCache = await opts.shouldBypassCache?.(...args);
    if (shouldBypassCache) {
      return fn(...args);
    }
    const key = await (opts.getKey || getKey)(...args);
    const shouldInvalidateCache = await opts.shouldInvalidateCache?.(...args);
    const entry = await get(
      key,
      () => fn(...args),
      shouldInvalidateCache,
      args[0] && isEvent(args[0]) ? args[0] : void 0
    );
    let value = entry.value;
    if (opts.transform) {
      value = await opts.transform(entry, ...args) || value;
    }
    return value;
  };
}
function cachedFunction(fn, opts = {}) {
  return defineCachedFunction(fn, opts);
}
function getKey(...args) {
  return args.length > 0 ? hash(args) : "";
}
function escapeKey(key) {
  return String(key).replace(/\W/g, "");
}
function defineCachedEventHandler(handler, opts = defaultCacheOptions()) {
  const variableHeaderNames = (opts.varies || []).filter(Boolean).map((h) => h.toLowerCase()).sort();
  const _opts = {
    ...opts,
    getKey: async (event) => {
      const customKey = await opts.getKey?.(event);
      if (customKey) {
        return escapeKey(customKey);
      }
      const _path = event.node.req.originalUrl || event.node.req.url || event.path;
      let _pathname;
      try {
        _pathname = escapeKey(decodeURI(parseURL(_path).pathname)).slice(0, 16) || "index";
      } catch {
        _pathname = "-";
      }
      const _hashedPath = `${_pathname}.${hash(_path)}`;
      const _headers = variableHeaderNames.map((header) => [header, event.node.req.headers[header]]).map(([name, value]) => `${escapeKey(name)}.${hash(value)}`);
      return [_hashedPath, ..._headers].join(":");
    },
    validate: (entry) => {
      if (!entry.value) {
        return false;
      }
      if (entry.value.code >= 400) {
        return false;
      }
      if (entry.value.body === void 0) {
        return false;
      }
      if (entry.value.headers.etag === "undefined" || entry.value.headers["last-modified"] === "undefined") {
        return false;
      }
      return true;
    },
    group: opts.group || "nitro/handlers",
    integrity: opts.integrity || hash([handler, opts])
  };
  const _cachedHandler = cachedFunction(
    async (incomingEvent) => {
      const variableHeaders = {};
      for (const header of variableHeaderNames) {
        const value = incomingEvent.node.req.headers[header];
        if (value !== void 0) {
          variableHeaders[header] = value;
        }
      }
      const reqProxy = cloneWithProxy(incomingEvent.node.req, {
        headers: variableHeaders
      });
      const resHeaders = {};
      let _resSendBody;
      const resProxy = cloneWithProxy(incomingEvent.node.res, {
        statusCode: 200,
        writableEnded: false,
        writableFinished: false,
        headersSent: false,
        closed: false,
        getHeader(name) {
          return resHeaders[name];
        },
        setHeader(name, value) {
          resHeaders[name] = value;
          return this;
        },
        getHeaderNames() {
          return Object.keys(resHeaders);
        },
        hasHeader(name) {
          return name in resHeaders;
        },
        removeHeader(name) {
          delete resHeaders[name];
        },
        getHeaders() {
          return resHeaders;
        },
        end(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2();
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return this;
        },
        write(chunk, arg2, arg3) {
          if (typeof chunk === "string") {
            _resSendBody = chunk;
          }
          if (typeof arg2 === "function") {
            arg2(void 0);
          }
          if (typeof arg3 === "function") {
            arg3();
          }
          return true;
        },
        writeHead(statusCode, headers2) {
          this.statusCode = statusCode;
          if (headers2) {
            if (Array.isArray(headers2) || typeof headers2 === "string") {
              throw new TypeError("Raw headers  is not supported.");
            }
            for (const header in headers2) {
              const value = headers2[header];
              if (value !== void 0) {
                this.setHeader(
                  header,
                  value
                );
              }
            }
          }
          return this;
        }
      });
      const event = createEvent(reqProxy, resProxy);
      event.fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: useNitroApp().localFetch
      });
      event.$fetch = (url, fetchOptions) => fetchWithEvent(event, url, fetchOptions, {
        fetch: globalThis.$fetch
      });
      event.waitUntil = incomingEvent.waitUntil;
      event.context = incomingEvent.context;
      event.context.cache = {
        options: _opts
      };
      const body = await handler(event) || _resSendBody;
      const headers = event.node.res.getHeaders();
      headers.etag = String(
        headers.Etag || headers.etag || `W/"${hash(body)}"`
      );
      headers["last-modified"] = String(
        headers["Last-Modified"] || headers["last-modified"] || (/* @__PURE__ */ new Date()).toUTCString()
      );
      const cacheControl = [];
      if (opts.swr) {
        if (opts.maxAge) {
          cacheControl.push(`s-maxage=${opts.maxAge}`);
        }
        if (opts.staleMaxAge) {
          cacheControl.push(`stale-while-revalidate=${opts.staleMaxAge}`);
        } else {
          cacheControl.push("stale-while-revalidate");
        }
      } else if (opts.maxAge) {
        cacheControl.push(`max-age=${opts.maxAge}`);
      }
      if (cacheControl.length > 0) {
        headers["cache-control"] = cacheControl.join(", ");
      }
      const cacheEntry = {
        code: event.node.res.statusCode,
        headers,
        body
      };
      return cacheEntry;
    },
    _opts
  );
  return defineEventHandler(async (event) => {
    if (opts.headersOnly) {
      if (handleCacheHeaders(event, { maxAge: opts.maxAge })) {
        return;
      }
      return handler(event);
    }
    const response = await _cachedHandler(
      event
    );
    if (event.node.res.headersSent || event.node.res.writableEnded) {
      return response.body;
    }
    if (handleCacheHeaders(event, {
      modifiedTime: new Date(response.headers["last-modified"]),
      etag: response.headers.etag,
      maxAge: opts.maxAge
    })) {
      return;
    }
    event.node.res.statusCode = response.code;
    for (const name in response.headers) {
      const value = response.headers[name];
      if (name === "set-cookie") {
        event.node.res.appendHeader(
          name,
          splitCookiesString(value)
        );
      } else {
        if (value !== void 0) {
          event.node.res.setHeader(name, value);
        }
      }
    }
    return response.body;
  });
}
function cloneWithProxy(obj, overrides) {
  return new Proxy(obj, {
    get(target, property, receiver) {
      if (property in overrides) {
        return overrides[property];
      }
      return Reflect.get(target, property, receiver);
    },
    set(target, property, value, receiver) {
      if (property in overrides) {
        overrides[property] = value;
        return true;
      }
      return Reflect.set(target, property, value, receiver);
    }
  });
}
const cachedEventHandler = defineCachedEventHandler;

const inlineAppConfig = {
  "nuxt": {}
};



const appConfig = defuFn(inlineAppConfig);

function getEnv(key, opts) {
  const envKey = snakeCase(key).toUpperCase();
  return destr(
    process.env[opts.prefix + envKey] ?? process.env[opts.altPrefix + envKey]
  );
}
function _isObject(input) {
  return typeof input === "object" && !Array.isArray(input);
}
function applyEnv(obj, opts, parentKey = "") {
  for (const key in obj) {
    const subKey = parentKey ? `${parentKey}_${key}` : key;
    const envValue = getEnv(subKey, opts);
    if (_isObject(obj[key])) {
      if (_isObject(envValue)) {
        obj[key] = { ...obj[key], ...envValue };
        applyEnv(obj[key], opts, subKey);
      } else if (envValue === void 0) {
        applyEnv(obj[key], opts, subKey);
      } else {
        obj[key] = envValue ?? obj[key];
      }
    } else {
      obj[key] = envValue ?? obj[key];
    }
    if (opts.envExpansion && typeof obj[key] === "string") {
      obj[key] = _expandFromEnv(obj[key]);
    }
  }
  return obj;
}
const envExpandRx = /\{\{([^{}]*)\}\}/g;
function _expandFromEnv(value) {
  return value.replace(envExpandRx, (match, key) => {
    return process.env[key] || match;
  });
}

const _inlineRuntimeConfig = {
  "app": {
    "baseURL": "/",
    "buildId": "dev",
    "buildAssetsDir": "/_nuxt/",
    "cdnURL": ""
  },
  "nitro": {
    "envPrefix": "NUXT_",
    "routeRules": {
      "/__nuxt_error": {
        "cache": false
      },
      "/_nuxt/builds/meta/**": {
        "headers": {
          "cache-control": "public, max-age=31536000, immutable"
        }
      },
      "/_nuxt/builds/**": {
        "headers": {
          "cache-control": "public, max-age=1, immutable"
        }
      }
    }
  },
  "public": {},
  "databaseUrl": "postgresql://postgres:postgres@localhost:5432/payiq?schema=public",
  "redisUrl": "redis://localhost:6379",
  "appBaseUrl": "http://localhost:3000",
  "scbApiBaseUrl": "https://api.partners.scb/partners/sandbox",
  "scbClientId": "demo-client-id",
  "scbClientSecret": "demo-client-secret",
  "scbCallbackSecret": "demo-callback-secret",
  "payiqWebhookSigningSecret": "replace-me"
};
const envOptions = {
  prefix: "NITRO_",
  altPrefix: _inlineRuntimeConfig.nitro.envPrefix ?? process.env.NITRO_ENV_PREFIX ?? "_",
  envExpansion: _inlineRuntimeConfig.nitro.envExpansion ?? process.env.NITRO_ENV_EXPANSION ?? false
};
const _sharedRuntimeConfig = _deepFreeze(
  applyEnv(klona(_inlineRuntimeConfig), envOptions)
);
function useRuntimeConfig(event) {
  if (!event) {
    return _sharedRuntimeConfig;
  }
  if (event.context.nitro.runtimeConfig) {
    return event.context.nitro.runtimeConfig;
  }
  const runtimeConfig = klona(_inlineRuntimeConfig);
  applyEnv(runtimeConfig, envOptions);
  event.context.nitro.runtimeConfig = runtimeConfig;
  return runtimeConfig;
}
_deepFreeze(klona(appConfig));
function _deepFreeze(object) {
  const propNames = Object.getOwnPropertyNames(object);
  for (const name of propNames) {
    const value = object[name];
    if (value && typeof value === "object") {
      _deepFreeze(value);
    }
  }
  return Object.freeze(object);
}
new Proxy(/* @__PURE__ */ Object.create(null), {
  get: (_, prop) => {
    console.warn(
      "Please use `useRuntimeConfig()` instead of accessing config directly."
    );
    const runtimeConfig = useRuntimeConfig();
    if (prop in runtimeConfig) {
      return runtimeConfig[prop];
    }
    return void 0;
  }
});

getContext("nitro-app", {
  asyncContext: false,
  AsyncLocalStorage: void 0
});

const config = useRuntimeConfig();
const _routeRulesMatcher = toRouteMatcher(
  createRouter({ routes: config.nitro.routeRules })
);
function createRouteRulesHandler(ctx) {
  return eventHandler((event) => {
    const routeRules = getRouteRules(event);
    if (routeRules.headers) {
      setHeaders(event, routeRules.headers);
    }
    if (routeRules.redirect) {
      let target = routeRules.redirect.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.redirect._redirectStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return sendRedirect(event, target, routeRules.redirect.statusCode);
    }
    if (routeRules.proxy) {
      let target = routeRules.proxy.to;
      if (target.endsWith("/**")) {
        let targetPath = event.path;
        const strpBase = routeRules.proxy._proxyStripBase;
        if (strpBase) {
          targetPath = withoutBase(targetPath, strpBase);
        }
        target = joinURL(target.slice(0, -3), targetPath);
      } else if (event.path.includes("?")) {
        const query = getQuery(event.path);
        target = withQuery(target, query);
      }
      return proxyRequest(event, target, {
        fetch: ctx.localFetch,
        ...routeRules.proxy
      });
    }
  });
}
function getRouteRules(event) {
  event.context._nitro = event.context._nitro || {};
  if (!event.context._nitro.routeRules) {
    event.context._nitro.routeRules = getRouteRulesForPath(
      withoutBase(event.path.split("?")[0], useRuntimeConfig().app.baseURL)
    );
  }
  return event.context._nitro.routeRules;
}
function getRouteRulesForPath(path) {
  return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
}

function _captureError(error, type) {
  console.error(`[${type}]`, error);
  useNitroApp().captureError(error, { tags: [type] });
}
function trapUnhandledNodeErrors() {
  process.on(
    "unhandledRejection",
    (error) => _captureError(error, "unhandledRejection")
  );
  process.on(
    "uncaughtException",
    (error) => _captureError(error, "uncaughtException")
  );
}
function joinHeaders(value) {
  return Array.isArray(value) ? value.join(", ") : String(value);
}
function normalizeFetchResponse(response) {
  if (!response.headers.has("set-cookie")) {
    return response;
  }
  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: normalizeCookieHeaders(response.headers)
  });
}
function normalizeCookieHeader(header = "") {
  return splitCookiesString(joinHeaders(header));
}
function normalizeCookieHeaders(headers) {
  const outgoingHeaders = new Headers();
  for (const [name, header] of headers) {
    if (name === "set-cookie") {
      for (const cookie of normalizeCookieHeader(header)) {
        outgoingHeaders.append("set-cookie", cookie);
      }
    } else {
      outgoingHeaders.set(name, joinHeaders(header));
    }
  }
  return outgoingHeaders;
}

/**
* Nitro internal functions extracted from https://github.com/nitrojs/nitro/blob/v2/src/runtime/internal/utils.ts
*/
function isJsonRequest(event) {
	// If the client specifically requests HTML, then avoid classifying as JSON.
	if (hasReqHeader(event, "accept", "text/html")) {
		return false;
	}
	return hasReqHeader(event, "accept", "application/json") || hasReqHeader(event, "user-agent", "curl/") || hasReqHeader(event, "user-agent", "httpie/") || hasReqHeader(event, "sec-fetch-mode", "cors") || event.path.startsWith("/api/") || event.path.endsWith(".json");
}
function hasReqHeader(event, name, includes) {
	const value = getRequestHeader(event, name);
	return !!(value && typeof value === "string" && value.toLowerCase().includes(includes));
}

const iframeStorageBridge = (nonce) => `
(function () {
  const NONCE = ${JSON.stringify(nonce)};
  const memoryStore = Object.create(null);

  const post = (type, payload) => {
    window.parent.postMessage({ type, nonce: NONCE, ...payload }, '*');
  };

  const isValid = (data) => data && data.nonce === NONCE;

  const mockStorage = {
    getItem(key) {
      return Object.hasOwn(memoryStore, key)
        ? memoryStore[key]
        : null;
    },
    setItem(key, value) {
      const v = String(value);
      memoryStore[key] = v;
      post('storage-set', { key, value: v });
    },
    removeItem(key) {
      delete memoryStore[key];
      post('storage-remove', { key });
    },
    clear() {
      for (const key of Object.keys(memoryStore))
        delete memoryStore[key];
      post('storage-clear', {});
    },
    key(index) {
      const keys = Object.keys(memoryStore);
      return keys[index] ?? null;
    },
    get length() {
      return Object.keys(memoryStore).length;
    }
  };

  const defineLocalStorage = () => {
    try {
      Object.defineProperty(window, 'localStorage', {
        value: mockStorage,
        writable: false,
        configurable: true
      });
    } catch {
      window.localStorage = mockStorage;
    }
  };

  defineLocalStorage();

  window.addEventListener('message', (event) => {
    const data = event.data;
    if (!isValid(data) || data.type !== 'storage-sync-data') return;

    const incoming = data.data || {};
    for (const key of Object.keys(incoming))
      memoryStore[key] = incoming[key];

    if (typeof window.initTheme === 'function')
      window.initTheme();
    window.dispatchEvent(new Event('storage-ready'));
  });

  // Clipboard API is unavailable in data: URL iframe, so we use postMessage
  document.addEventListener('DOMContentLoaded', function() {
    window.copyErrorMessage = function(button) {
      post('clipboard-copy', { text: button.dataset.errorText });
      button.classList.add('copied');
      setTimeout(function() { button.classList.remove('copied'); }, 2000);
    };
  });

  post('storage-sync-request', {});
})();
`;
const parentStorageBridge = (nonce) => `
(function () {
  const host = document.querySelector('nuxt-error-overlay');
  if (!host) return;

  const NONCE = ${JSON.stringify(nonce)};
  const isValid = (data) => data && data.nonce === NONCE;

  // Handle clipboard copy from iframe
  window.addEventListener('message', function(e) {
    if (isValid(e) && e.data.type === 'clipboard-copy') {
      navigator.clipboard.writeText(e.data.text).catch(function() {});
    }
  });

  const collectLocalStorage = () => {
    const all = {};
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i);
      if (k != null) all[k] = localStorage.getItem(k);
    }
    return all;
  };

  const attachWhenReady = () => {
    const root = host.shadowRoot;
    if (!root)
      return false;
    const iframe = root.getElementById('frame');
    if (!iframe || !iframe.contentWindow)
      return false;

    const handlers = {
      'storage-set': (d) => localStorage.setItem(d.key, d.value),
      'storage-remove': (d) => localStorage.removeItem(d.key),
      'storage-clear': () => localStorage.clear(),
      'storage-sync-request': () => {
        iframe.contentWindow.postMessage({
          type: 'storage-sync-data',
          data: collectLocalStorage(),
          nonce: NONCE
        }, '*');
      }
    };

    window.addEventListener('message', (event) => {
      const data = event.data;
      if (!isValid(data)) return;
      const fn = handlers[data.type];
      if (fn) fn(data);
    });

    return true;
  };

  if (attachWhenReady())
    return;

  const obs = new MutationObserver(() => {
    if (attachWhenReady())
      obs.disconnect();
  });

  obs.observe(host, { childList: true, subtree: true });
})();
`;
const errorCSS = `
:host {
  --preview-width: 240px;
  --preview-height: 180px;
  --base-width: 1200px;
  --base-height: 900px;
  --z-base: 999999998;
  --error-pip-left: auto;
  --error-pip-top: auto;
  --error-pip-right: 5px;
  --error-pip-bottom: 5px;
  --error-pip-origin: bottom right;
  --app-preview-left: auto;
  --app-preview-top: auto;
  --app-preview-right: 5px;
  --app-preview-bottom: 5px;
  all: initial;
  display: contents;
}
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}
#frame {
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  height: 100vh;
  border: none;
  z-index: var(--z-base);
}
#frame[inert] {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: var(--error-pip-right);
  bottom: var(--error-pip-bottom);
  width: var(--base-width);
  height: var(--base-height);
  transform: scale(calc(240 / 1200));
  transform-origin: var(--error-pip-origin);
  overflow: hidden;
  border-radius: calc(1200 * 8px / 240);
}
#preview {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: var(--app-preview-right);
  bottom: var(--app-preview-bottom);
  width: var(--preview-width);
  height: var(--preview-height);
  overflow: hidden;
  border-radius: 6px;
  pointer-events: none;
  z-index: var(--z-base);
  background: white;
  display: none;
}
#preview iframe {
  transform-origin: var(--error-pip-origin);
}
#frame:not([inert]) + #preview {
  display: block;
}
#toggle {
  position: fixed;
  left: var(--app-preview-left);
  top: var(--app-preview-top);
  right: calc(var(--app-preview-right) - 3px);
  bottom: calc(var(--app-preview-bottom) - 3px);
  width: var(--preview-width);
  height: var(--preview-height);
  background: none;
  border: 3px solid #00DC82;
  border-radius: 8px;
  cursor: pointer;
  opacity: 0.8;
  transition: opacity 0.2s, box-shadow 0.2s;
  z-index: calc(var(--z-base) + 1);
  display: flex;
  align-items: center;
  justify-content: center;
}
#toggle:hover,
#toggle:focus {
  opacity: 1;
  box-shadow: 0 0 20px rgba(0, 220, 130, 0.6);
}
#toggle:focus-visible {
  outline: 3px solid #00DC82;
  outline-offset: 0;
  box-shadow: 0 0 24px rgba(0, 220, 130, 0.8);
}
#frame[inert] ~ #toggle {
  left: var(--error-pip-left);
  top: var(--error-pip-top);
  right: calc(var(--error-pip-right) - 3px);
  bottom: calc(var(--error-pip-bottom) - 3px);
  cursor: grab;
}
:host(.dragging) #frame[inert] ~ #toggle {
  cursor: grabbing;
}
#frame:not([inert]) ~ #toggle,
#frame:not([inert]) + #preview {
  cursor: grab;
}
:host(.dragging-preview) #frame:not([inert]) ~ #toggle,
:host(.dragging-preview) #frame:not([inert]) + #preview {
  cursor: grabbing;
}

#pip-close {
  position: absolute;
  top: 6px;
  right: 6px;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: none;
  background: rgba(0, 0, 0, 0.75);
  color: #fff;
  font-size: 16px;
  line-height: 1;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  pointer-events: auto;
}
#pip-close:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}

#pip-restore {
  position: fixed;
  right: 16px;
  bottom: 16px;
  padding: 8px 14px;
  border-radius: 999px;
  border: 2px solid #00DC82;
  background: #111;
  color: #fff;
  font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
  font-size: 14px;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  z-index: calc(var(--z-base) + 2);
  cursor: grab;
}
#pip-restore:focus-visible {
  outline: 2px solid #00DC82;
  outline-offset: 2px;
}
:host(.dragging-restore) #pip-restore {
  cursor: grabbing;
}

#frame[hidden],
#toggle[hidden],
#preview[hidden],
#pip-restore[hidden],
#pip-close[hidden] {
  display: none !important;
}

@media (prefers-reduced-motion: reduce) {
  #toggle {
    transition: none;
  }
}
`;
function webComponentScript(base64HTML, startMinimized) {
	return `
(function () {
  try {
    // =========================
    // Host + Shadow
    // =========================
    const host = document.querySelector('nuxt-error-overlay');
    if (!host)
      return;
    const shadow = host.attachShadow({ mode: 'open' });

    // =========================
    // DOM helpers
    // =========================
    const el = (tag) => document.createElement(tag);
    const on = (node, type, fn, opts) => node.addEventListener(type, fn, opts);
    const hide = (node, v) => node.toggleAttribute('hidden', !!v);
    const setVar = (name, value) => host.style.setProperty(name, value);
    const unsetVar = (name) => host.style.removeProperty(name);

    // =========================
    // Create DOM
    // =========================
    const style = el('style');
    style.textContent = ${JSON.stringify(errorCSS)};

    const iframe = el('iframe');
    iframe.id = 'frame';
    iframe.src = 'data:text/html;base64,${base64HTML}';
    iframe.title = 'Detailed error stack trace';
    iframe.setAttribute('sandbox', 'allow-scripts allow-same-origin allow-top-navigation-by-user-activation');

    const preview = el('div');
    preview.id = 'preview';

    const toggle = el('div');
    toggle.id = 'toggle';
    toggle.setAttribute('aria-expanded', 'true');
    toggle.setAttribute('role', 'button');
    toggle.setAttribute('tabindex', '0');
    toggle.innerHTML = '<span class="sr-only">Toggle detailed error view</span>';

    const liveRegion = el('div');
    liveRegion.setAttribute('role', 'status');
    liveRegion.setAttribute('aria-live', 'polite');
    liveRegion.className = 'sr-only';

    const pipCloseButton = el('button');
    pipCloseButton.id = 'pip-close';
    pipCloseButton.setAttribute('type', 'button');
    pipCloseButton.setAttribute('aria-label', 'Hide error preview overlay');
    pipCloseButton.innerHTML = '&times;';
    pipCloseButton.hidden = true;
    toggle.appendChild(pipCloseButton);

    const pipRestoreButton = el('button');
    pipRestoreButton.id = 'pip-restore';
    pipRestoreButton.setAttribute('type', 'button');
    pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
    pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
    pipRestoreButton.hidden = true;

    // Order matters: #frame + #preview adjacency
    shadow.appendChild(style);
    shadow.appendChild(liveRegion);
    shadow.appendChild(iframe);
    shadow.appendChild(preview);
    shadow.appendChild(toggle);
    shadow.appendChild(pipRestoreButton);

    // =========================
    // Constants / keys
    // =========================
    const POS_KEYS = {
      position: 'nuxt-error-overlay:position',
      hiddenPretty: 'nuxt-error-overlay:error-pip:hidden',
      hiddenPreview: 'nuxt-error-overlay:app-preview:hidden'
    };

    const CSS_VARS = {
      pip: {
        left: '--error-pip-left',
        top: '--error-pip-top',
        right: '--error-pip-right',
        bottom: '--error-pip-bottom'
      },
      preview: {
        left: '--app-preview-left',
        top: '--app-preview-top',
        right: '--app-preview-right',
        bottom: '--app-preview-bottom'
      }
    };

    const MIN_GAP = 5;
    const DRAG_THRESHOLD = 2;

    // =========================
    // Local storage safe access + state
    // =========================
    let storageReady = true;
    let isPrettyHidden = false;
    let isPreviewHidden = false;

    const safeGet = (k) => {
      try {
        return localStorage.getItem(k);
      } catch {
        return null;
      }
    };

    const safeSet = (k, v) => {
      if (!storageReady) 
        return;
      try {
        localStorage.setItem(k, v);
      } catch {}
    };

    // =========================
    // Sizing helpers
    // =========================
    const vvSize = () => {
      const v = window.visualViewport;
      return v ? { w: v.width, h: v.height } : { w: window.innerWidth, h: window.innerHeight };
    };

    const previewSize = () => {
      const styles = getComputedStyle(host);
      const w = parseFloat(styles.getPropertyValue('--preview-width')) || 240;
      const h = parseFloat(styles.getPropertyValue('--preview-height')) || 180;
      return { w, h };
    };

    const sizeForTarget = (target) => {
      if (!target)
        return previewSize();
      const rect = target.getBoundingClientRect();
      if (rect.width && rect.height)
        return { w: rect.width, h: rect.height };
      return previewSize();
    };

    // =========================
    // Dock model + offset/alignment calculations
    // =========================
    const dock = { edge: null, offset: null, align: null, gap: null };

    const maxOffsetFor = (edge, size) => {
      const vv = vvSize();
      if (edge === 'left' || edge === 'right')
        return Math.max(MIN_GAP, vv.h - size.h - MIN_GAP);
      return Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
    };

    const clampOffset = (edge, value, size) => {
      const max = maxOffsetFor(edge, size);
      return Math.min(Math.max(value, MIN_GAP), max);
    };

    const updateDockAlignment = (size) => {
      if (!dock.edge || dock.offset == null)
        return;
      const max = maxOffsetFor(dock.edge, size);
      if (dock.offset <= max / 2) {
        dock.align = 'start';
        dock.gap = dock.offset;
      } else {
        dock.align = 'end';
        dock.gap = Math.max(0, max - dock.offset);
      }
    };

    const appliedOffsetFor = (size) => {
      if (!dock.edge || dock.offset == null)
        return null;
      const max = maxOffsetFor(dock.edge, size);

      if (dock.align === 'end' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, max - dock.gap, size);
      }
      if (dock.align === 'start' && typeof dock.gap === 'number') {
        return clampOffset(dock.edge, dock.gap, size);
      }
      return clampOffset(dock.edge, dock.offset, size);
    };

    const nearestEdgeAt = (x, y) => {
      const { w, h } = vvSize();
      const d = { left: x, right: w - x, top: y, bottom: h - y };
      return Object.keys(d).reduce((a, b) => (d[a] < d[b] ? a : b));
    };

    const cornerDefaultDock = () => {
      const vv = vvSize();
      const size = previewSize();
      const offset = Math.max(MIN_GAP, vv.w - size.w - MIN_GAP);
      return { edge: 'bottom', offset };
    };

    const currentTransformOrigin = () => {
      if (!dock.edge) return null;
      if (dock.edge === 'left' || dock.edge === 'top')
        return 'top left';
      if (dock.edge === 'right')
        return 'top right';
      return 'bottom left';
    };

    // =========================
    // Persist / load dock
    // =========================
    const loadDock = () => {
      const raw = safeGet(POS_KEYS.position);
      if (!raw)
        return;
      try {
        const parsed = JSON.parse(raw);
        const { edge, offset, align, gap } = parsed || {};
        if (!['left', 'right', 'top', 'bottom'].includes(edge))
          return;
        if (typeof offset !== 'number')
          return;

        dock.edge = edge;
        dock.offset = clampOffset(edge, offset, previewSize());
        dock.align = align === 'start' || align === 'end' ? align : null;
        dock.gap = typeof gap === 'number' ? gap : null;

        if (!dock.align || dock.gap == null)
          updateDockAlignment(previewSize());
      } catch {}
    };

    const persistDock = () => {
      if (!dock.edge || dock.offset == null)
        return; 
      safeSet(POS_KEYS.position, JSON.stringify({
        edge: dock.edge,
        offset: dock.offset,
        align: dock.align,
        gap: dock.gap
      }));
    };

    // =========================
    // Apply dock
    // =========================
    const dockToVars = (vars) => ({
      set: (side, v) => host.style.setProperty(vars[side], v),
      clear: (side) => host.style.removeProperty(vars[side])
    });

    const dockToEl = (node) => ({
      set: (side, v) => { node.style[side] = v; },
      clear: (side) => { node.style[side] = ''; }
    });

    const applyDock = (target, size, opts) => {
      if (!dock.edge || dock.offset == null) {
        target.clear('left');
        target.clear('top');
        target.clear('right');
        target.clear('bottom');
        return;
      }

      target.set('left', 'auto');
      target.set('top', 'auto');
      target.set('right', 'auto');
      target.set('bottom', 'auto');

      const applied = appliedOffsetFor(size);

      if (dock.edge === 'left') {
        target.set('left', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'right') {
        target.set('right', MIN_GAP + 'px');
        target.set('top', applied + 'px');
      } else if (dock.edge === 'top') {
        target.set('top', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      } else {
        target.set('bottom', MIN_GAP + 'px');
        target.set('left', applied + 'px');
      }

      if (!opts || opts.persist !== false)
        persistDock();
    };

    const applyDockAll = (opts) => {
      applyDock(dockToVars(CSS_VARS.pip), previewSize(), opts);
      applyDock(dockToVars(CSS_VARS.preview), previewSize(), opts);
      applyDock(dockToEl(pipRestoreButton), sizeForTarget(pipRestoreButton), opts);
    };

    const repaintToDock = () => {
      if (!dock.edge || dock.offset == null)
        return;
      const origin = currentTransformOrigin();
      if (origin)
        setVar('--error-pip-origin', origin);
      else 
        unsetVar('--error-pip-origin');
      applyDockAll({ persist: false });
    };

    // =========================
    // Hidden state + UI
    // =========================
    const loadHidden = () => {
      const rawPretty = safeGet(POS_KEYS.hiddenPretty);
      if (rawPretty != null)
        isPrettyHidden = rawPretty === '1' || rawPretty === 'true';
      const rawPreview = safeGet(POS_KEYS.hiddenPreview);
      if (rawPreview != null)
        isPreviewHidden = rawPreview === '1' || rawPreview === 'true';
    };

    const setPrettyHidden = (v) => {
      isPrettyHidden = !!v;
      safeSet(POS_KEYS.hiddenPretty, isPrettyHidden ? '1' : '0');
      updateUI();
    };

    const setPreviewHidden = (v) => {
      isPreviewHidden = !!v;
      safeSet(POS_KEYS.hiddenPreview, isPreviewHidden ? '1' : '0');
      updateUI();
    };

    const isMinimized = () => iframe.hasAttribute('inert');

    const setMinimized = (v) => {
      if (v) {
        iframe.setAttribute('inert', '');
        toggle.setAttribute('aria-expanded', 'false');
      } else {
        iframe.removeAttribute('inert');
        toggle.setAttribute('aria-expanded', 'true');
      }
    };

    const setRestoreLabel = (kind) => {
      if (kind === 'pretty') {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error overlay</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error overlay');
      } else {
        pipRestoreButton.innerHTML = '<span aria-hidden="true">⟲</span><span>Show error page</span>';
        pipRestoreButton.setAttribute('aria-label', 'Show error page');
      }
    };

    const updateUI = () => {
      const minimized = isMinimized();
      const showPiP = minimized && !isPrettyHidden;
      const showPreview = !minimized && !isPreviewHidden;
      const pipHiddenByUser = minimized && isPrettyHidden;
      const previewHiddenByUser = !minimized && isPreviewHidden;
      const showToggle = minimized ? showPiP : showPreview;
      const showRestore = pipHiddenByUser || previewHiddenByUser;

      hide(iframe, pipHiddenByUser);
      hide(preview, !showPreview);
      hide(toggle, !showToggle);
      hide(pipCloseButton, !showToggle);
      hide(pipRestoreButton, !showRestore);

      pipCloseButton.setAttribute('aria-label', minimized ? 'Hide error overlay' : 'Hide error page preview');

      if (pipHiddenByUser)
        setRestoreLabel('pretty');
      else if (previewHiddenByUser)
        setRestoreLabel('preview');

      host.classList.toggle('pip-hidden', isPrettyHidden);
      host.classList.toggle('preview-hidden', isPreviewHidden);
    };

    // =========================
    // Preview snapshot
    // =========================
    const updatePreview = () => {
      try {
        let previewIframe = preview.querySelector('iframe');
        if (!previewIframe) {
          previewIframe = el('iframe');
          previewIframe.style.cssText = 'width: 1200px; height: 900px; transform: scale(0.2); transform-origin: top left; border: none;';
          previewIframe.setAttribute('sandbox', 'allow-scripts allow-same-origin');
          preview.appendChild(previewIframe);
        }

        const doctype = document.doctype ? '<!DOCTYPE ' + document.doctype.name + '>' : '';
        const cleanedHTML = document.documentElement.outerHTML
          .replace(/<nuxt-error-overlay[^>]*>.*?<\\/nuxt-error-overlay>/gs, '')
          .replace(/<script[^>]*>.*?<\\/script>/gs, '');

        const iframeDoc = previewIframe.contentDocument || previewIframe.contentWindow.document;
        iframeDoc.open();
        iframeDoc.write(doctype + cleanedHTML);
        iframeDoc.close();
      } catch (err) {
        console.error('Failed to update preview:', err);
      }
    };

    // =========================
    // View toggling
    // =========================
    const toggleView = () => {
      if (isMinimized()) {
        updatePreview();
        setMinimized(false);
        liveRegion.textContent = 'Showing detailed error view';
        setTimeout(() => { 
          try { 
            iframe.contentWindow.focus();
          } catch {}
        }, 100);
      } else {
        setMinimized(true);
        liveRegion.textContent = 'Showing error page';
        repaintToDock();
        void iframe.offsetWidth;
      }
      updateUI();
    };

    // =========================
    // Dragging (unified, rAF throttled)
    // =========================
    let drag = null;
    let rafId = null;
    let suppressToggleClick = false;
    let suppressRestoreClick = false;

    const beginDrag = (e) => {
      if (drag) 
        return;

      if (!dock.edge || dock.offset == null) {
        const def = cornerDefaultDock();
        dock.edge = def.edge;
        dock.offset = def.offset;
        updateDockAlignment(previewSize());
      }

      const isRestoreTarget = e.currentTarget === pipRestoreButton;

      drag = {
        kind: isRestoreTarget ? 'restore' : (isMinimized() ? 'pip' : 'preview'),
        pointerId: e.pointerId,
        startX: e.clientX,
        startY: e.clientY,
        lastX: e.clientX,
        lastY: e.clientY,
        moved: false,
        target: e.currentTarget
      };

      drag.target.setPointerCapture(e.pointerId);

      if (drag.kind === 'restore')
        host.classList.add('dragging-restore');
      else 
        host.classList.add(drag.kind === 'pip' ? 'dragging' : 'dragging-preview');

      e.preventDefault();
    };

    const moveDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      drag.lastX = e.clientX;
      drag.lastY = e.clientY;
      
      const dx = drag.lastX - drag.startX;
      const dy = drag.lastY - drag.startY;

      if (!drag.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
        drag.moved = true;
      }

      if (!drag.moved)
        return;
      if (rafId)
        return;

      rafId = requestAnimationFrame(() => {
        rafId = null;

        const edge = nearestEdgeAt(drag.lastX, drag.lastY);
        const size = sizeForTarget(drag.target);

        let offset;
        if (edge === 'left' || edge === 'right') {
          const top = drag.lastY - (size.h / 2);
          offset = clampOffset(edge, Math.round(top), size);
        } else {
          const left = drag.lastX - (size.w / 2);
          offset = clampOffset(edge, Math.round(left), size);
        }

        dock.edge = edge;
        dock.offset = offset;
        updateDockAlignment(size);

        const origin = currentTransformOrigin();
        setVar('--error-pip-origin', origin || 'bottom right');

        applyDockAll({ persist: false });
      });
    };

    const endDrag = (e) => {
      if (!drag || drag.pointerId !== e.pointerId)
        return;

      const endedKind = drag.kind;
      drag.target.releasePointerCapture(e.pointerId);

      if (endedKind === 'restore')
        host.classList.remove('dragging-restore');
      else 
        host.classList.remove(endedKind === 'pip' ? 'dragging' : 'dragging-preview');

      const didMove = drag.moved;
      drag = null;

      if (didMove) {
        persistDock();
        if (endedKind === 'restore')
          suppressRestoreClick = true;
        else 
          suppressToggleClick = true;
        e.preventDefault();
        e.stopPropagation();
      }
    };

    const bindDragTarget = (node) => {
      on(node, 'pointerdown', beginDrag);
      on(node, 'pointermove', moveDrag);
      on(node, 'pointerup', endDrag);
      on(node, 'pointercancel', endDrag);
    };

    bindDragTarget(toggle);
    bindDragTarget(pipRestoreButton);

    // =========================
    // Events (toggle / close / restore)
    // =========================
    on(toggle, 'click', (e) => {
      if (suppressToggleClick) {
        e.preventDefault();
        suppressToggleClick = false;
        return;
      }
      toggleView();
    });

    on(toggle, 'keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        toggleView();
      }
    });

    on(pipCloseButton, 'click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized())
        setPrettyHidden(true);
      else
        setPreviewHidden(true);
    });

    on(pipCloseButton, 'pointerdown', (e) => {
      e.stopPropagation();
    });

    on(pipRestoreButton, 'click', (e) => {
      if (suppressRestoreClick) {
        e.preventDefault();
        suppressRestoreClick = false;
        return;
      }
      e.preventDefault();
      e.stopPropagation();
      if (isMinimized()) 
        setPrettyHidden(false);
      else 
        setPreviewHidden(false);
    });

    // =========================
    // Lifecycle: load / sync / repaint
    // =========================
    const loadState = () => {
      loadDock();
      loadHidden();

      if (isPrettyHidden && !isMinimized())
        setMinimized(true);

      updateUI();
      repaintToDock();
    };

    loadState();

    on(window, 'storage-ready', () => {
      storageReady = true;
      loadState();
    });

    const onViewportChange = () => repaintToDock();

    on(window, 'resize', onViewportChange);

    if (window.visualViewport) {
      on(window.visualViewport, 'resize', onViewportChange);
      on(window.visualViewport, 'scroll', onViewportChange);
    }

    // initial preview
    setTimeout(updatePreview, 100);

    // initial minimized option
    if (${startMinimized}) {
      setMinimized(true);
      repaintToDock();
      void iframe.offsetWidth;
      updateUI();
    }
  } catch (err) {
    console.error('Failed to initialize Nuxt error overlay:', err);
  }
})();
`;
}
function generateErrorOverlayHTML(html, options) {
	const nonce = Array.from(crypto.getRandomValues(new Uint8Array(16)), (b) => b.toString(16).padStart(2, "0")).join("");
	const errorPage = html.replace("<head>", `<head><script>${iframeStorageBridge(nonce)}<\/script>`);
	const base64HTML = Buffer.from(errorPage, "utf8").toString("base64");
	return `
    <script>${parentStorageBridge(nonce)}<\/script>
    <nuxt-error-overlay></nuxt-error-overlay>
    <script>${webComponentScript(base64HTML, options?.startMinimized ?? false)}<\/script>
  `;
}

const errorHandler$0 = (async function errorhandler(error, event, { defaultHandler }) {
	if (event.handled || isJsonRequest(event)) {
		// let Nitro handle JSON errors
		return;
	}
	// invoke default Nitro error handler (which will log appropriately if required)
	const defaultRes = await defaultHandler(error, event, { json: true });
	// let Nitro handle redirect if appropriate
	const status = error.status || error.statusCode || 500;
	if (status === 404 && defaultRes.status === 302) {
		setResponseHeaders(event, defaultRes.headers);
		setResponseStatus(event, defaultRes.status, defaultRes.statusText);
		return send(event, JSON.stringify(defaultRes.body, null, 2));
	}
	if (typeof defaultRes.body !== "string" && Array.isArray(defaultRes.body.stack)) {
		// normalize to string format expected by nuxt `error.vue`
		defaultRes.body.stack = defaultRes.body.stack.join("\n");
	}
	const errorObject = defaultRes.body;
	// remove proto/hostname/port from URL
	const url = new URL(errorObject.url);
	errorObject.url = withoutBase(url.pathname, useRuntimeConfig(event).app.baseURL) + url.search + url.hash;
	// add default server message (keep sanitized for unhandled errors)
	errorObject.message = error.unhandled ? errorObject.message || "Server Error" : error.message || errorObject.message || "Server Error";
	// we will be rendering this error internally so we can pass along the error.data safely
	errorObject.data ||= error.data;
	errorObject.statusText ||= error.statusText || error.statusMessage;
	delete defaultRes.headers["content-type"];
	delete defaultRes.headers["content-security-policy"];
	setResponseHeaders(event, defaultRes.headers);
	// Access request headers
	const reqHeaders = getRequestHeaders(event);
	// Detect to avoid recursion in SSR rendering of errors
	const isRenderingError = event.path.startsWith("/__nuxt_error") || !!reqHeaders["x-nuxt-error"];
	// HTML response (via SSR)
	const res = isRenderingError ? null : await useNitroApp().localFetch(withQuery(joinURL(useRuntimeConfig(event).app.baseURL, "/__nuxt_error"), errorObject), {
		headers: {
			...reqHeaders,
			"x-nuxt-error": "true"
		},
		redirect: "manual"
	}).catch(() => null);
	if (event.handled) {
		return;
	}
	// Fallback to static rendered error page
	if (!res) {
		const { template } = await Promise.resolve().then(function () { return error500; });
		{
			// TODO: Support `message` in template
			errorObject.description = errorObject.message;
		}
		setResponseHeader(event, "Content-Type", "text/html;charset=UTF-8");
		return send(event, template(errorObject));
	}
	const html = await res.text();
	for (const [header, value] of res.headers.entries()) {
		if (header === "set-cookie") {
			appendResponseHeader(event, header, value);
			continue;
		}
		setResponseHeader(event, header, value);
	}
	setResponseStatus(event, res.status && res.status !== 200 ? res.status : defaultRes.status, res.statusText || defaultRes.statusText);
	if (!globalThis._importMeta_.test && typeof html === "string") {
		const prettyResponse = await defaultHandler(error, event, { json: false });
		if (typeof prettyResponse.body === "string") {
			return send(event, html.replace("</body>", `${generateErrorOverlayHTML(prettyResponse.body, { startMinimized: 300 <= status && status < 500 })}</body>`));
		}
	}
	return send(event, html);
});

function defineNitroErrorHandler(handler) {
  return handler;
}

const errorHandler$1 = defineNitroErrorHandler(
  async function defaultNitroErrorHandler(error, event) {
    const res = await defaultHandler(error, event);
    if (!event.node?.res.headersSent) {
      setResponseHeaders(event, res.headers);
    }
    setResponseStatus(event, res.status, res.statusText);
    return send(
      event,
      typeof res.body === "string" ? res.body : JSON.stringify(res.body, null, 2)
    );
  }
);
async function defaultHandler(error, event, opts) {
  const isSensitive = error.unhandled || error.fatal;
  const statusCode = error.statusCode || 500;
  const statusMessage = error.statusMessage || "Server Error";
  const url = getRequestURL(event, { xForwardedHost: true, xForwardedProto: true });
  if (statusCode === 404) {
    const baseURL = "/";
    if (/^\/[^/]/.test(baseURL) && !url.pathname.startsWith(baseURL)) {
      const redirectTo = `${baseURL}${url.pathname.slice(1)}${url.search}`;
      return {
        status: 302,
        statusText: "Found",
        headers: { location: redirectTo },
        body: `Redirecting...`
      };
    }
  }
  await loadStackTrace(error).catch(consola.error);
  const youch = new Youch();
  if (isSensitive && !opts?.silent) {
    const tags = [error.unhandled && "[unhandled]", error.fatal && "[fatal]"].filter(Boolean).join(" ");
    const ansiError = await (await youch.toANSI(error)).replaceAll(process.cwd(), ".");
    consola.error(
      `[request error] ${tags} [${event.method}] ${url}

`,
      ansiError
    );
  }
  const useJSON = opts?.json ?? !getRequestHeader(event, "accept")?.includes("text/html");
  const headers = {
    "content-type": useJSON ? "application/json" : "text/html",
    // Prevent browser from guessing the MIME types of resources.
    "x-content-type-options": "nosniff",
    // Prevent error page from being embedded in an iframe
    "x-frame-options": "DENY",
    // Prevent browsers from sending the Referer header
    "referrer-policy": "no-referrer",
    // Disable the execution of any js
    "content-security-policy": "script-src 'self' 'unsafe-inline'; object-src 'none'; base-uri 'self';"
  };
  if (statusCode === 404 || !getResponseHeader(event, "cache-control")) {
    headers["cache-control"] = "no-cache";
  }
  const body = useJSON ? {
    error: true,
    url,
    statusCode,
    statusMessage,
    message: error.message,
    data: error.data,
    stack: error.stack?.split("\n").map((line) => line.trim())
  } : await youch.toHTML(error, {
    request: {
      url: url.href,
      method: event.method,
      headers: getRequestHeaders(event)
    }
  });
  return {
    status: statusCode,
    statusText: statusMessage,
    headers,
    body
  };
}
async function loadStackTrace(error) {
  if (!(error instanceof Error)) {
    return;
  }
  const parsed = await new ErrorParser().defineSourceLoader(sourceLoader).parse(error);
  const stack = error.message + "\n" + parsed.frames.map((frame) => fmtFrame(frame)).join("\n");
  Object.defineProperty(error, "stack", { value: stack });
  if (error.cause) {
    await loadStackTrace(error.cause).catch(consola.error);
  }
}
async function sourceLoader(frame) {
  if (!frame.fileName || frame.fileType !== "fs" || frame.type === "native") {
    return;
  }
  if (frame.type === "app") {
    const rawSourceMap = await readFile(`${frame.fileName}.map`, "utf8").catch(() => {
    });
    if (rawSourceMap) {
      const consumer = await new SourceMapConsumer(rawSourceMap);
      const originalPosition = consumer.originalPositionFor({ line: frame.lineNumber, column: frame.columnNumber });
      if (originalPosition.source && originalPosition.line) {
        frame.fileName = resolve(dirname(frame.fileName), originalPosition.source);
        frame.lineNumber = originalPosition.line;
        frame.columnNumber = originalPosition.column || 0;
      }
    }
  }
  const contents = await readFile(frame.fileName, "utf8").catch(() => {
  });
  return contents ? { contents } : void 0;
}
function fmtFrame(frame) {
  if (frame.type === "native") {
    return frame.raw;
  }
  const src = `${frame.fileName || ""}:${frame.lineNumber}:${frame.columnNumber})`;
  return frame.functionName ? `at ${frame.functionName} (${src}` : `at ${src}`;
}

const errorHandlers = [errorHandler$0, errorHandler$1];

async function errorHandler(error, event) {
  for (const handler of errorHandlers) {
    try {
      await handler(error, event, { defaultHandler });
      if (event.handled) {
        return; // Response handled
      }
    } catch(error) {
      // Handler itself thrown, log and continue
      console.error(error);
    }
  }
  // H3 will handle fallback
}

const script = `
if (!window.__NUXT_DEVTOOLS_TIME_METRIC__) {
  Object.defineProperty(window, '__NUXT_DEVTOOLS_TIME_METRIC__', {
    value: {},
    enumerable: false,
    configurable: true,
  })
}
window.__NUXT_DEVTOOLS_TIME_METRIC__.appInit = Date.now()
`;

const _0BEsQ4Fv4XocZ1uCY56uQhAkO8KI5rMOw5byaWHtw = (function(nitro) {
  nitro.hooks.hook("render:html", (htmlContext) => {
    htmlContext.head.push(`<script>${script}<\/script>`);
  });
});

const rootDir = "/Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed";

const appHead = {"meta":[{"name":"viewport","content":"width=device-width, initial-scale=1"},{"charset":"utf-8"}],"link":[],"style":[],"script":[],"noscript":[]};

const appRootTag = "div";

const appRootAttrs = {"id":"__nuxt"};

const appTeleportTag = "div";

const appTeleportAttrs = {"id":"teleports"};

const appSpaLoaderTag = "div";

const appSpaLoaderAttrs = {"id":"__nuxt-loader"};

const appId = "nuxt-app";

const devReducers = {
	VNode: (data) => isVNode(data) ? {
		type: data.type,
		props: data.props
	} : undefined,
	URL: (data) => data instanceof URL ? data.toString() : undefined
};
const asyncContext = getContext("nuxt-dev", {
	asyncContext: true,
	AsyncLocalStorage
});
const _eseZhqReVR4kuQoTcHxmE8SKXG4ufZRCkuu32o4Fs = (nitroApp) => {
	const handler = nitroApp.h3App.handler;
	nitroApp.h3App.handler = (event) => {
		return asyncContext.callAsync({
			logs: [],
			event
		}, () => handler(event));
	};
	onConsoleLog((_log) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		const rawStack = captureRawStackTrace();
		if (!rawStack || rawStack.includes("runtime/vite-node.mjs")) {
			return;
		}
		const trace = [];
		let filename = "";
		for (const entry of parseRawStackTrace(rawStack)) {
			if (entry.source === globalThis._importMeta_.url) {
				continue;
			}
			if (EXCLUDE_TRACE_RE.test(entry.source)) {
				continue;
			}
			filename ||= entry.source.replace(withTrailingSlash(rootDir), "");
			trace.push({
				...entry,
				source: entry.source.startsWith("file://") ? entry.source.replace("file://", "") : entry.source
			});
		}
		const log = {
			..._log,
			filename,
			stack: trace
		};
		// retain log to be include in the next render
		ctx.logs.push(log);
	});
	nitroApp.hooks.hook("afterResponse", () => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		return nitroApp.hooks.callHook("dev:ssr-logs", {
			logs: ctx.logs,
			path: ctx.event.path
		});
	});
	// Pass any logs to the client
	nitroApp.hooks.hook("render:html", (htmlContext) => {
		const ctx = asyncContext.tryUse();
		if (!ctx) {
			return;
		}
		try {
			const reducers = Object.assign(Object.create(null), devReducers, ctx.event.context["~payloadReducers"]);
			htmlContext.bodyAppend.unshift(`<script type="application/json" data-nuxt-logs="${appId}">${stringify(ctx.logs, reducers)}<\/script>`);
		} catch (e) {
			const shortError = e instanceof Error && "toString" in e ? ` Received \`${e.toString()}\`.` : "";
			console.warn(`[nuxt] Failed to stringify dev server logs.${shortError} You can define your own reducer/reviver for rich types following the instructions in https://nuxt.com/docs/4.x/api/composables/use-nuxt-app#payload.`);
		}
	});
};
const EXCLUDE_TRACE_RE = /\/node_modules\/(?:.*\/)?(?:nuxt|nuxt-nightly|nuxt-edge|nuxt3|consola|@vue)\/|core\/runtime\/nitro/;
function onConsoleLog(callback) {
	consola$1.addReporter({ log(logObj) {
		callback(logObj);
	} });
	consola$1.wrapConsole();
}

const plugins = [
  _0BEsQ4Fv4XocZ1uCY56uQhAkO8KI5rMOw5byaWHtw,
_eseZhqReVR4kuQoTcHxmE8SKXG4ufZRCkuu32o4Fs,
_wH6JrtIxmaSoA8lCPWFnE9z4lQeXW6H5z3l5aymEQw
];

const assets = {
  "/index.mjs": {
    "type": "text/javascript; charset=utf-8",
    "etag": "\"4e7c4-kjtiOojFMLGIJblhNMShhRFRKIk\"",
    "mtime": "2026-03-19T17:36:28.034Z",
    "size": 321476,
    "path": "index.mjs"
  },
  "/index.mjs.map": {
    "type": "application/json",
    "etag": "\"146ab0-KB1aHtvXNLiDPGN+Ig6kiTQxPlM\"",
    "mtime": "2026-03-19T17:36:28.034Z",
    "size": 1338032,
    "path": "index.mjs.map"
  }
};

function readAsset (id) {
  const serverDir = dirname$1(fileURLToPath(globalThis._importMeta_.url));
  return promises.readFile(resolve$1(serverDir, assets[id].path))
}

const publicAssetBases = {"/_nuxt/builds/meta/":{"maxAge":31536000},"/_nuxt/builds/":{"maxAge":1}};

function isPublicAssetURL(id = '') {
  if (assets[id]) {
    return true
  }
  for (const base in publicAssetBases) {
    if (id.startsWith(base)) { return true }
  }
  return false
}

function getAsset (id) {
  return assets[id]
}

const METHODS = /* @__PURE__ */ new Set(["HEAD", "GET"]);
const EncodingMap = { gzip: ".gz", br: ".br" };
const _fKbPNG = eventHandler((event) => {
  if (event.method && !METHODS.has(event.method)) {
    return;
  }
  let id = decodePath(
    withLeadingSlash(withoutTrailingSlash(parseURL(event.path).pathname))
  );
  let asset;
  const encodingHeader = String(
    getRequestHeader(event, "accept-encoding") || ""
  );
  const encodings = [
    ...encodingHeader.split(",").map((e) => EncodingMap[e.trim()]).filter(Boolean).sort(),
    ""
  ];
  for (const encoding of encodings) {
    for (const _id of [id + encoding, joinURL(id, "index.html" + encoding)]) {
      const _asset = getAsset(_id);
      if (_asset) {
        asset = _asset;
        id = _id;
        break;
      }
    }
  }
  if (!asset) {
    if (isPublicAssetURL(id)) {
      removeResponseHeader(event, "Cache-Control");
      throw createError({ statusCode: 404 });
    }
    return;
  }
  if (asset.encoding !== void 0) {
    appendResponseHeader(event, "Vary", "Accept-Encoding");
  }
  const ifNotMatch = getRequestHeader(event, "if-none-match") === asset.etag;
  if (ifNotMatch) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  const ifModifiedSinceH = getRequestHeader(event, "if-modified-since");
  const mtimeDate = new Date(asset.mtime);
  if (ifModifiedSinceH && asset.mtime && new Date(ifModifiedSinceH) >= mtimeDate) {
    setResponseStatus(event, 304, "Not Modified");
    return "";
  }
  if (asset.type && !getResponseHeader(event, "Content-Type")) {
    setResponseHeader(event, "Content-Type", asset.type);
  }
  if (asset.etag && !getResponseHeader(event, "ETag")) {
    setResponseHeader(event, "ETag", asset.etag);
  }
  if (asset.mtime && !getResponseHeader(event, "Last-Modified")) {
    setResponseHeader(event, "Last-Modified", mtimeDate.toUTCString());
  }
  if (asset.encoding && !getResponseHeader(event, "Content-Encoding")) {
    setResponseHeader(event, "Content-Encoding", asset.encoding);
  }
  if (asset.size > 0 && !getResponseHeader(event, "Content-Length")) {
    setResponseHeader(event, "Content-Length", asset.size);
  }
  return readAsset(id);
});

var _a$1;
const globalForPrisma = globalThis;
const prisma$1 = (_a$1 = globalForPrisma.prisma) != null ? _a$1 : new PrismaClient({
  log: ["warn", "error"]
});
globalForPrisma.prisma = prisma$1;

var __defProp = Object.defineProperty;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);
class AppError extends Error {
  constructor(code, message, statusCode = 400, details) {
    super(message);
    __publicField(this, "statusCode");
    __publicField(this, "code");
    __publicField(this, "details");
    this.code = code;
    this.statusCode = statusCode;
    this.details = details;
  }
}

function generateApiKeySecret(bytes = 24) {
  return randomBytes(bytes).toString("base64url");
}
function hashApiKeySecret(secret) {
  return createHash("sha256").update(secret).digest("hex");
}
function verifyApiKeySecret(secret, secretHash) {
  const hashed = hashApiKeySecret(secret);
  const a = Buffer.from(hashed);
  const b = Buffer.from(secretHash);
  if (a.length !== b.length) return false;
  return timingSafeEqual$1(a, b);
}
function generateKeyPrefix(environment = "test") {
  const rand = randomBytes(6).toString("hex");
  return environment === "live" ? `pk_live_${rand}` : `pk_test_${rand}`;
}
function buildFullApiKey(keyPrefix, secret) {
  return `${keyPrefix}.${secret}`;
}
function splitFullApiKey(fullKey) {
  const parts = fullKey.split(".");
  if (parts.length !== 2) return null;
  const [keyPrefix, secret] = parts;
  if (!keyPrefix || !secret) return null;
  return { keyPrefix, secret };
}

async function resolveApiKey(fullApiKey) {
  var _a, _b;
  if (!fullApiKey) {
    throw new AppError("UNAUTHORIZED", "Missing API key", 401);
  }
  const parsed = splitFullApiKey(fullApiKey);
  if (!parsed) {
    throw new AppError("UNAUTHORIZED", "Malformed API key", 401);
  }
  const record = await prisma$1.apiKey.findFirst({
    where: {
      keyPrefix: parsed.keyPrefix,
      status: "ACTIVE",
      revokedAt: null
    },
    include: {
      tenant: true,
      merchantAccount: true
    }
  });
  if (!record) {
    throw new AppError("UNAUTHORIZED", "Invalid API key", 401);
  }
  const valid = verifyApiKeySecret(parsed.secret, record.secretHash);
  if (!valid) {
    throw new AppError("UNAUTHORIZED", "Invalid API key", 401);
  }
  if (record.expiresAt && record.expiresAt.getTime() < Date.now()) {
    throw new AppError("UNAUTHORIZED", "API key expired", 401);
  }
  if (record.tenant.status !== "ACTIVE") {
    throw new AppError("FORBIDDEN", "Tenant is inactive", 403);
  }
  if (record.merchantAccountId && ((_a = record.merchantAccount) == null ? void 0 : _a.status) !== "ACTIVE") {
    throw new AppError("FORBIDDEN", "Merchant is inactive", 403);
  }
  await prisma$1.apiKey.update({
    where: { id: record.id },
    data: { lastUsedAt: /* @__PURE__ */ new Date() }
  });
  return {
    apiKeyId: record.id,
    tenantId: record.tenantId,
    tenantCode: record.tenant.code,
    merchantAccountId: record.merchantAccountId || null,
    merchantCode: ((_b = record.merchantAccount) == null ? void 0 : _b.code) || null,
    scopes: record.scopes
  };
}

async function requireApiKeyAuth(event) {
  var _a;
  const apiKey = getHeader(event, "x-api-key") || ((_a = getHeader(event, "authorization")) == null ? void 0 : _a.replace(/^Bearer\s+/i, "")) || "";
  const auth = await resolveApiKey(apiKey);
  event.context.auth = auth;
  return auth;
}

function sha256$1(input) {
  return createHash("sha256").update(input).digest("hex");
}
function getClientIp(event) {
  return getRequestIP(event, { xForwardedFor: true }) || "unknown";
}
function getClientIpHash(event) {
  return sha256$1(getClientIp(event));
}

var _a;
const globalForRedis = globalThis;
const redis = (_a = globalForRedis.redis) != null ? _a : new IORedis(process.env.REDIS_URL || "redis://localhost:6379", {
  maxRetriesPerRequest: null,
  enableReadyCheck: true
});
globalForRedis.redis = redis;

function buildRateLimitKey(scope, identifier, routeGroup) {
  return `rl:tb:v2:${scope}:${identifier}:${routeGroup}`;
}
function buildPaymentSpamKey(...parts) {
  return `abuse:pay:v1:${parts.join(":")}`;
}
function buildTempBlockKey(subject, identifier) {
  return `block:v1:${subject}:${identifier}`;
}

const TOKEN_BUCKET_LUA = `
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

let tokenBucketSha = null;
async function getTokenBucketSha() {
  if (tokenBucketSha) return tokenBucketSha;
  tokenBucketSha = await redis.script("LOAD", TOKEN_BUCKET_LUA);
  return tokenBucketSha;
}
class RateLimitService {
  async check(policy) {
    const key = buildRateLimitKey(
      policy.scope,
      policy.identifier,
      policy.routeGroup
    );
    const nowMs = Date.now();
    const sha = await getTokenBucketSha();
    let raw;
    try {
      raw = await redis.evalsha(
        sha,
        1,
        key,
        nowMs,
        policy.capacity,
        policy.refillRatePerSec,
        policy.cost,
        policy.ttlSec,
        policy.blockDurationSec
      );
    } catch {
      raw = await redis.eval(
        TOKEN_BUCKET_LUA,
        1,
        key,
        nowMs,
        policy.capacity,
        policy.refillRatePerSec,
        policy.cost,
        policy.ttlSec,
        policy.blockDurationSec
      );
    }
    return {
      allowed: Number(raw[0]) === 1,
      remaining: Number(raw[1]),
      retryAfterSec: Number(raw[2]),
      resetAfterSec: Number(raw[3]),
      blocked: Number(raw[4]) === 1,
      blockRemainingSec: Number(raw[5])
    };
  }
  async setTempBlock(subject, identifier, ttlSec) {
    await redis.set(buildTempBlockKey(subject, identifier), "1", "EX", ttlSec);
  }
  async getTempBlockTtl(subject, identifier) {
    const ttl = await redis.ttl(buildTempBlockKey(subject, identifier));
    return ttl > 0 ? ttl : 0;
  }
}
const rateLimitService = new RateLimitService();

const ROUTE_LIMITS = {
  "payments:create": {
    capacity: 20,
    refillRatePerSec: 5,
    cost: 1,
    ttlSec: 300,
    blockDurationSec: 2
  },
  "payments:read": {
    capacity: 120,
    refillRatePerSec: 30,
    cost: 1,
    ttlSec: 120,
    blockDurationSec: 0
  },
  "apiKeys:manage": {
    capacity: 10,
    refillRatePerSec: 0.2,
    cost: 1,
    ttlSec: 3600,
    blockDurationSec: 30
  },
  "auth:malformed": {
    capacity: 8,
    refillRatePerSec: 0.2,
    cost: 1,
    ttlSec: 3600,
    blockDurationSec: 300
  },
  "auth:unknown": {
    capacity: 12,
    refillRatePerSec: 0.25,
    cost: 1,
    ttlSec: 3600,
    blockDurationSec: 300
  },
  "auth:failed": {
    capacity: 10,
    refillRatePerSec: 0.2,
    cost: 1,
    ttlSec: 3600,
    blockDurationSec: 300
  }
};
const MERCHANT_LIMITS = {
  "payments:create": {
    capacity: 60,
    refillRatePerSec: 10,
    cost: 1,
    ttlSec: 300,
    blockDurationSec: 3
  }
};
const PAYMENT_SPAM_LIMITS = {
  duplicateReference: {
    ttlSec: 30,
    threshold: 10,
    blockSec: 30
  },
  amountVelocity: {
    ttlSec: 10,
    threshold: 25,
    blockSec: 15
  }
};

function isProtectedPath(path) {
  if (path === "/api/v1/health") return false;
  return path.startsWith("/api/v1/");
}
function buildAuthPolicy(routeGroup, ipHash) {
  var _a, _b, _c;
  const base = ROUTE_LIMITS[routeGroup];
  return {
    scope: "ip",
    identifier: ipHash,
    routeGroup,
    capacity: base.capacity,
    refillRatePerSec: base.refillRatePerSec,
    cost: (_a = base.cost) != null ? _a : 1,
    ttlSec: (_b = base.ttlSec) != null ? _b : 3600,
    blockDurationSec: (_c = base.blockDurationSec) != null ? _c : 0
  };
}
async function denyWithAbuseControl(event, routeGroup, message) {
  const ipHash = getClientIpHash(event);
  const decision = await rateLimitService.check(buildAuthPolicy(routeGroup, ipHash));
  if (!decision.allowed) {
    setResponseHeader(event, "Retry-After", String(decision.retryAfterSec));
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "AUTH_RATE_LIMITED",
        routeGroup,
        retryAfterSec: decision.retryAfterSec
      }
    });
  }
  throw createError({
    statusCode: 401,
    statusMessage: "Unauthorized",
    data: {
      code: message
    }
  });
}
const _MUo9ZW = defineEventHandler(async (event) => {
  if (!isProtectedPath(event.path)) return;
  try {
    await requireApiKeyAuth(event);
  } catch (error) {
    const message = String((error == null ? void 0 : error.message) || "");
    if (message.includes("Malformed API key")) {
      await denyWithAbuseControl(event, "auth:malformed", "MALFORMED_API_KEY");
    }
    if (message.includes("Invalid API key prefix") || message.includes("API key not found") || message.includes("Unknown API key")) {
      await denyWithAbuseControl(event, "auth:unknown", "INVALID_API_KEY");
    }
    if (message.includes("Invalid API key secret") || message.includes("Invalid API key") || message.includes("Unauthorized")) {
      await denyWithAbuseControl(event, "auth:failed", "INVALID_API_KEY");
    }
    throw error;
  }
});

function detectRouteGroup(event) {
  const method = event.method.toUpperCase();
  const path = event.path;
  if (method === "POST" && path.startsWith("/api/v1/payment-intents")) {
    return "payments:create";
  }
  if (method === "GET" && path.startsWith("/api/v1/payment-intents/")) {
    return "payments:read";
  }
  if (path.startsWith("/api/v1/api-keys")) {
    return "apiKeys:manage";
  }
  return null;
}
function resolveRateLimitPolicies(event, input) {
  var _a, _b, _c;
  const routeGroup = detectRouteGroup(event);
  if (!routeGroup) return [];
  const base = ROUTE_LIMITS[routeGroup];
  const policies = [
    {
      scope: "apiKey",
      identifier: input.apiKeyId,
      routeGroup,
      capacity: base.capacity,
      refillRatePerSec: base.refillRatePerSec,
      cost: (_a = base.cost) != null ? _a : 1,
      ttlSec: (_b = base.ttlSec) != null ? _b : 300,
      blockDurationSec: (_c = base.blockDurationSec) != null ? _c : 0
    }
  ];
  if (routeGroup === "payments:create" && input.merchantAccountId && MERCHANT_LIMITS["payments:create"]) {
    const merchantBase = MERCHANT_LIMITS["payments:create"];
    policies.push({
      scope: "merchant",
      identifier: input.merchantAccountId,
      routeGroup,
      capacity: merchantBase.capacity,
      refillRatePerSec: merchantBase.refillRatePerSec,
      cost: merchantBase.cost,
      ttlSec: merchantBase.ttlSec,
      blockDurationSec: merchantBase.blockDurationSec
    });
  }
  return policies;
}

const _LujxJG = defineEventHandler(async (event) => {
  const auth = event.context.auth;
  if (!auth) return;
  const policies = resolveRateLimitPolicies(event, {
    apiKeyId: auth.apiKeyId,
    merchantAccountId: auth.merchantAccountId
  });
  if (!policies.length) return;
  let apiKeyLimit = 0;
  let apiKeyRemaining = Number.MAX_SAFE_INTEGER;
  let apiKeyReset = 0;
  for (const policy of policies) {
    const decision = await rateLimitService.check(policy);
    if (policy.scope === "apiKey") {
      apiKeyLimit = policy.capacity;
      apiKeyRemaining = Math.min(apiKeyRemaining, decision.remaining);
      apiKeyReset = Math.max(apiKeyReset, decision.resetAfterSec);
    }
    if (!decision.allowed) {
      if (apiKeyLimit > 0) {
        setResponseHeader(event, "X-RateLimit-Limit", String(apiKeyLimit));
        setResponseHeader(
          event,
          "X-RateLimit-Remaining",
          policy.scope === "apiKey" ? "0" : String(Math.max(0, apiKeyRemaining))
        );
        setResponseHeader(
          event,
          "X-RateLimit-Reset",
          String(Math.max(apiKeyReset, decision.resetAfterSec))
        );
      }
      setResponseHeader(event, "Retry-After", decision.retryAfterSec);
      console.warn("[rate-limit-deny]", {
        apiKeyId: auth.apiKeyId,
        merchantAccountId: auth.merchantAccountId,
        routeGroup: policy.routeGroup,
        scope: policy.scope,
        retryAfterSec: decision.retryAfterSec
      });
      throw createError({
        statusCode: 429,
        statusMessage: "Too Many Requests",
        data: {
          code: "RATE_LIMIT_EXCEEDED",
          routeGroup: policy.routeGroup,
          scope: policy.scope,
          retryAfterSec: decision.retryAfterSec
        }
      });
    }
  }
  if (apiKeyLimit > 0) {
    setResponseHeader(event, "X-RateLimit-Limit", String(apiKeyLimit));
    setResponseHeader(event, "X-RateLimit-Remaining", String(apiKeyRemaining));
    setResponseHeader(event, "X-RateLimit-Reset", String(apiKeyReset));
  }
});

const VueResolver = (_, value) => {
  return isRef(value) ? toValue(value) : value;
};

const headSymbol = "usehead";
// @__NO_SIDE_EFFECTS__
function vueInstall(head) {
  const plugin = {
    install(app) {
      app.config.globalProperties.$unhead = head;
      app.config.globalProperties.$head = head;
      app.provide(headSymbol, head);
    }
  };
  return plugin.install;
}

// @__NO_SIDE_EFFECTS__
function resolveUnrefHeadInput(input) {
  return walkResolver(input, VueResolver);
}

const NUXT_PAYLOAD_INLINE = false;
const NUXT_RUNTIME_PAYLOAD_EXTRACTION = false;

// @__NO_SIDE_EFFECTS__
function createHead(options = {}) {
  const head = createHead$1({
    ...options,
    propResolvers: [VueResolver]
  });
  head.install = vueInstall(head);
  return head;
}

const unheadOptions = {
  disableDefaults: true,
};

function createSSRContext(event) {
	const ssrContext = {
		url: event.path,
		event,
		runtimeConfig: useRuntimeConfig(event),
		noSSR: event.context.nuxt?.noSSR || (false),
		head: createHead(unheadOptions),
		error: false,
		nuxt: undefined,
		payload: {},
		["~payloadReducers"]: Object.create(null),
		modules: new Set()
	};
	return ssrContext;
}
function setSSRError(ssrContext, error) {
	ssrContext.error = true;
	ssrContext.payload = { error };
	ssrContext.url = error.url;
}

function buildAssetsDir() {
	// TODO: support passing event to `useRuntimeConfig`
	return useRuntimeConfig().app.buildAssetsDir;
}
function buildAssetsURL(...path) {
	return joinRelativeURL(publicAssetsURL(), buildAssetsDir(), ...path);
}
function publicAssetsURL(...path) {
	// TODO: support passing event to `useRuntimeConfig`
	const app = useRuntimeConfig().app;
	const publicBase = app.cdnURL || app.baseURL;
	return path.length ? joinRelativeURL(publicBase, ...path) : publicBase;
}

const APP_ROOT_OPEN_TAG = `<${appRootTag}${propsToString(appRootAttrs)}>`;
const APP_ROOT_CLOSE_TAG = `</${appRootTag}>`;
// @ts-expect-error file will be produced after app build
const getServerEntry = () => import('file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/.nuxt//dist/server/server.mjs').then((r) => r.default || r);
// @ts-expect-error file will be produced after app build
const getClientManifest = () => import('file:///Users/teerin/Documents/MyDev/Nuxt4/payiq-starter-fixed/.nuxt//dist/server/client.manifest.mjs').then((r) => r.default || r).then((r) => typeof r === "function" ? r() : r);
// -- SSR Renderer --
const getSSRRenderer = lazyCachedFunction(async () => {
	// Load server bundle
	const createSSRApp = await getServerEntry();
	if (!createSSRApp) {
		throw new Error("Server bundle is not available");
	}
	// Load precomputed dependencies
	const precomputed = undefined ;
	// Create renderer
	const renderer = createRenderer(createSSRApp, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: renderToString$1,
		buildAssetsURL
	});
	async function renderToString$1(input, context) {
		const html = await renderToString(input, context);
		// In development with vite-node, the manifest is on-demand and will be available after rendering
		// eslint-disable-next-line no-restricted-globals
		if (process.env.NUXT_VITE_NODE_OPTIONS) {
			renderer.rendererContext.updateManifest(await getClientManifest());
		}
		return APP_ROOT_OPEN_TAG + html + APP_ROOT_CLOSE_TAG;
	}
	return renderer;
});
// -- SPA Renderer --
const getSPARenderer = lazyCachedFunction(async () => {
	const precomputed = undefined ;
	// @ts-expect-error virtual file
	const spaTemplate = await Promise.resolve().then(function () { return _virtual__spaTemplate; }).then((r) => r.template).catch(() => "").then((r) => {
		{
			const APP_SPA_LOADER_OPEN_TAG = `<${appSpaLoaderTag}${propsToString(appSpaLoaderAttrs)}>`;
			const APP_SPA_LOADER_CLOSE_TAG = `</${appSpaLoaderTag}>`;
			const appTemplate = APP_ROOT_OPEN_TAG + APP_ROOT_CLOSE_TAG;
			const loaderTemplate = r ? APP_SPA_LOADER_OPEN_TAG + r + APP_SPA_LOADER_CLOSE_TAG : "";
			return appTemplate + loaderTemplate;
		}
	});
	// Create SPA renderer and cache the result for all requests
	const renderer = createRenderer(() => () => {}, {
		precomputed,
		manifest: await getClientManifest() ,
		renderToString: () => spaTemplate,
		buildAssetsURL
	});
	const result = await renderer.renderToString({});
	const renderToString = (ssrContext) => {
		const config = useRuntimeConfig(ssrContext.event);
		ssrContext.modules ||= new Set();
		ssrContext.payload.serverRendered = false;
		ssrContext.config = {
			public: config.public,
			app: config.app
		};
		return Promise.resolve(result);
	};
	return {
		rendererContext: renderer.rendererContext,
		renderToString
	};
});
function lazyCachedFunction(fn) {
	let res = null;
	return () => {
		if (res === null) {
			res = fn().catch((err) => {
				res = null;
				throw err;
			});
		}
		return res;
	};
}
function getRenderer(ssrContext) {
	return ssrContext.noSSR ? getSPARenderer() : getSSRRenderer();
}
// @ts-expect-error file will be produced after app build
const getSSRStyles = lazyCachedFunction(() => Promise.resolve().then(function () { return styles$1; }).then((r) => r.default || r));

async function renderInlineStyles(usedModules) {
	const styleMap = await getSSRStyles();
	const inlinedStyles = new Set();
	for (const mod of usedModules) {
		if (mod in styleMap && styleMap[mod]) {
			for (const style of await styleMap[mod]()) {
				inlinedStyles.add(style);
			}
		}
	}
	return Array.from(inlinedStyles).map((style) => ({ innerHTML: style }));
}

// @ts-expect-error virtual file
const ROOT_NODE_REGEX = new RegExp(`^<${appRootTag}[^>]*>([\\s\\S]*)<\\/${appRootTag}>$`);
/**
* remove the root node from the html body
*/
function getServerComponentHTML(body) {
	const match = body.match(ROOT_NODE_REGEX);
	return match?.[1] || body;
}
const SSR_SLOT_TELEPORT_MARKER = /^uid=([^;]*);slot=(.*)$/;
const SSR_CLIENT_TELEPORT_MARKER = /^uid=([^;]*);client=(.*)$/;
const SSR_CLIENT_SLOT_MARKER = /^island-slot=([^;]*);(.*)$/;
function getSlotIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.slots).length) {
		return undefined;
	}
	const response = {};
	for (const [name, slot] of Object.entries(ssrContext.islandContext.slots)) {
		response[name] = {
			...slot,
			fallback: ssrContext.teleports?.[`island-fallback=${name}`]
		};
	}
	return response;
}
function getClientIslandResponse(ssrContext) {
	if (!ssrContext.islandContext || !Object.keys(ssrContext.islandContext.components).length) {
		return undefined;
	}
	const response = {};
	for (const [clientUid, component] of Object.entries(ssrContext.islandContext.components)) {
		// remove teleport anchor to avoid hydration issues
		const html = ssrContext.teleports?.[clientUid]?.replaceAll("<!--teleport start anchor-->", "") || "";
		response[clientUid] = {
			...component,
			html,
			slots: getComponentSlotTeleport(clientUid, ssrContext.teleports ?? {})
		};
	}
	return response;
}
function getComponentSlotTeleport(clientUid, teleports) {
	const entries = Object.entries(teleports);
	const slots = {};
	for (const [key, value] of entries) {
		const match = key.match(SSR_CLIENT_SLOT_MARKER);
		if (match) {
			const [, id, slot] = match;
			if (!slot || clientUid !== id) {
				continue;
			}
			slots[slot] = value;
		}
	}
	return slots;
}
function replaceIslandTeleports(ssrContext, html) {
	const { teleports, islandContext } = ssrContext;
	if (islandContext || !teleports) {
		return html;
	}
	for (const key in teleports) {
		const matchClientComp = key.match(SSR_CLIENT_TELEPORT_MARKER);
		if (matchClientComp) {
			const [, uid, clientId] = matchClientComp;
			if (!uid || !clientId) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-component="${clientId}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
			continue;
		}
		const matchSlot = key.match(SSR_SLOT_TELEPORT_MARKER);
		if (matchSlot) {
			const [, uid, slot] = matchSlot;
			if (!uid || !slot) {
				continue;
			}
			html = html.replace(new RegExp(` data-island-uid="${uid}" data-island-slot="${slot}"[^>]*>`), (full) => {
				return full + teleports[key];
			});
		}
	}
	return html;
}

const ISLAND_SUFFIX_RE = /\.json(?:\?.*)?$/;
const handler$1 = defineEventHandler(async (event) => {
	const nitroApp = useNitroApp();
	setResponseHeaders(event, {
		"content-type": "application/json;charset=utf-8",
		"x-powered-by": "Nuxt"
	});
	const islandContext = await getIslandContext(event);
	const ssrContext = {
		...createSSRContext(event),
		islandContext,
		noSSR: false,
		url: islandContext.url
	};
	// Render app
	const renderer = await getSSRRenderer();
	const renderResult = await renderer.renderToString(ssrContext).catch(async (err) => {
		await ssrContext.nuxt?.hooks.callHook("app:error", err);
		throw err;
	});
	// Handle errors
	if (ssrContext.payload?.error) {
		throw ssrContext.payload.error;
	}
	const inlinedStyles = await renderInlineStyles(ssrContext.modules ?? []);
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult
	});
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	{
		const { styles } = getRequestDependencies(ssrContext, renderer.rendererContext);
		const link = [];
		for (const resource of Object.values(styles)) {
			// Do not add links to resources that are inlined (vite v5+)
			if ("inline" in getQuery(resource.file)) {
				continue;
			}
			// Add CSS links in <head> for CSS files
			// - in dev mode when rendering an island and the file has scoped styles and is not a page
			if (resource.file.includes("scoped") && !resource.file.includes("pages/")) {
				link.push({
					rel: "stylesheet",
					href: renderer.rendererContext.buildAssetsURL(resource.file),
					crossorigin: ""
				});
			}
		}
		if (link.length) {
			ssrContext.head.push({ link }, { mode: "server" });
		}
	}
	const islandHead = {};
	for (const entry of ssrContext.head.entries.values()) {
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		for (const [key, value] of Object.entries(resolveUnrefHeadInput(entry.input))) {
			const currentValue = islandHead[key];
			if (Array.isArray(currentValue)) {
				currentValue.push(...value);
			} else {
				islandHead[key] = value;
			}
		}
	}
	const islandResponse = {
		id: islandContext.id,
		head: islandHead,
		html: getServerComponentHTML(renderResult.html),
		components: getClientIslandResponse(ssrContext),
		slots: getSlotIslandResponse(ssrContext)
	};
	await nitroApp.hooks.callHook("render:island", islandResponse, {
		event,
		islandContext
	});
	return islandResponse;
});
const ISLAND_PATH_PREFIX = "/__nuxt_island/";
const VALID_COMPONENT_NAME_RE = /^[a-z][\w.-]*$/i;
async function getIslandContext(event) {
	let url = event.path || "";
	if (!url.startsWith(ISLAND_PATH_PREFIX)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island request path"
		});
	}
	const componentParts = url.substring(ISLAND_PATH_PREFIX.length).replace(ISLAND_SUFFIX_RE, "").split("_");
	const hashId = componentParts.length > 1 ? componentParts.pop() : undefined;
	const componentName = componentParts.join("_");
	if (!componentName || !VALID_COMPONENT_NAME_RE.test(componentName)) {
		throw createError({
			statusCode: 400,
			statusMessage: "Invalid island component name"
		});
	}
	const context = event.method === "GET" ? getQuery$1(event) : await readBody(event);
	// Only extract known context fields to prevent arbitrary data injection
	return {
		url: typeof context?.url === "string" ? context.url : "/",
		id: hashId,
		name: componentName,
		props: destr$1(context.props) || {},
		slots: {},
		components: {}
	};
}

const _lazy_rIzJky = () => Promise.resolve().then(function () { return metrics_get$1; });
const _lazy_2l_ilF = () => Promise.resolve().then(function () { return revoke_post$1; });
const _lazy_aPYBb1 = () => Promise.resolve().then(function () { return rotate_post$1; });
const _lazy_QhphVR = () => Promise.resolve().then(function () { return index_get$1; });
const _lazy_VWH6VU = () => Promise.resolve().then(function () { return index_post$3; });
const _lazy_xd1lT3 = () => Promise.resolve().then(function () { return _publicId__get$1; });
const _lazy_h_fty2 = () => Promise.resolve().then(function () { return index_post$1; });
const _lazy_XPHOpF = () => Promise.resolve().then(function () { return callback_post$1; });
const _lazy_N5KQgW = () => Promise.resolve().then(function () { return _provider__post$1; });
const _lazy_SOhBIt = () => Promise.resolve().then(function () { return renderer; });

const handlers = [
  { route: '', handler: _fKbPNG, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _MUo9ZW, lazy: false, middleware: true, method: undefined },
  { route: '', handler: _LujxJG, lazy: false, middleware: true, method: undefined },
  { route: '/api/internal/metrics', handler: _lazy_rIzJky, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/api-keys/:id/revoke', handler: _lazy_2l_ilF, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/api-keys/:id/rotate', handler: _lazy_aPYBb1, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/api-keys', handler: _lazy_QhphVR, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/api-keys', handler: _lazy_VWH6VU, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/payment-intents/:publicId', handler: _lazy_xd1lT3, lazy: true, middleware: false, method: "get" },
  { route: '/api/v1/payment-intents', handler: _lazy_h_fty2, lazy: true, middleware: false, method: "post" },
  { route: '/api/v1/providers/scb/callback', handler: _lazy_XPHOpF, lazy: true, middleware: false, method: "post" },
  { route: '/api/webhooks/:provider', handler: _lazy_N5KQgW, lazy: true, middleware: false, method: "post" },
  { route: '/__nuxt_error', handler: _lazy_SOhBIt, lazy: true, middleware: false, method: undefined },
  { route: '/__nuxt_island/**', handler: handler$1, lazy: false, middleware: false, method: undefined },
  { route: '/**', handler: _lazy_SOhBIt, lazy: true, middleware: false, method: undefined }
];

function createNitroApp() {
  const config = useRuntimeConfig();
  const hooks = createHooks();
  const captureError = (error, context = {}) => {
    const promise = hooks.callHookParallel("error", error, context).catch((error_) => {
      console.error("Error while capturing another error", error_);
    });
    if (context.event && isEvent(context.event)) {
      const errors = context.event.context.nitro?.errors;
      if (errors) {
        errors.push({ error, context });
      }
      if (context.event.waitUntil) {
        context.event.waitUntil(promise);
      }
    }
  };
  const h3App = createApp({
    debug: destr(true),
    onError: (error, event) => {
      captureError(error, { event, tags: ["request"] });
      return errorHandler(error, event);
    },
    onRequest: async (event) => {
      event.context.nitro = event.context.nitro || { errors: [] };
      const fetchContext = event.node.req?.__unenv__;
      if (fetchContext?._platform) {
        event.context = {
          _platform: fetchContext?._platform,
          // #3335
          ...fetchContext._platform,
          ...event.context
        };
      }
      if (!event.context.waitUntil && fetchContext?.waitUntil) {
        event.context.waitUntil = fetchContext.waitUntil;
      }
      event.fetch = (req, init) => fetchWithEvent(event, req, init, { fetch: localFetch });
      event.$fetch = (req, init) => fetchWithEvent(event, req, init, {
        fetch: $fetch
      });
      event.waitUntil = (promise) => {
        if (!event.context.nitro._waitUntilPromises) {
          event.context.nitro._waitUntilPromises = [];
        }
        event.context.nitro._waitUntilPromises.push(promise);
        if (event.context.waitUntil) {
          event.context.waitUntil(promise);
        }
      };
      event.captureError = (error, context) => {
        captureError(error, { event, ...context });
      };
      await nitroApp$1.hooks.callHook("request", event).catch((error) => {
        captureError(error, { event, tags: ["request"] });
      });
    },
    onBeforeResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("beforeResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    },
    onAfterResponse: async (event, response) => {
      await nitroApp$1.hooks.callHook("afterResponse", event, response).catch((error) => {
        captureError(error, { event, tags: ["request", "response"] });
      });
    }
  });
  const router = createRouter$1({
    preemptive: true
  });
  const nodeHandler = toNodeListener(h3App);
  const localCall = (aRequest) => callNodeRequestHandler(
    nodeHandler,
    aRequest
  );
  const localFetch = (input, init) => {
    if (!input.toString().startsWith("/")) {
      return globalThis.fetch(input, init);
    }
    return fetchNodeRequestHandler(
      nodeHandler,
      input,
      init
    ).then((response) => normalizeFetchResponse(response));
  };
  const $fetch = createFetch({
    fetch: localFetch,
    Headers: Headers$1,
    defaults: { baseURL: config.app.baseURL }
  });
  globalThis.$fetch = $fetch;
  h3App.use(createRouteRulesHandler({ localFetch }));
  for (const h of handlers) {
    let handler = h.lazy ? lazyEventHandler(h.handler) : h.handler;
    if (h.middleware || !h.route) {
      const middlewareBase = (config.app.baseURL + (h.route || "/")).replace(
        /\/+/g,
        "/"
      );
      h3App.use(middlewareBase, handler);
    } else {
      const routeRules = getRouteRulesForPath(
        h.route.replace(/:\w+|\*\*/g, "_")
      );
      if (routeRules.cache) {
        handler = cachedEventHandler(handler, {
          group: "nitro/routes",
          ...routeRules.cache
        });
      }
      router.use(h.route, handler, h.method);
    }
  }
  h3App.use(config.app.baseURL, router.handler);
  const app = {
    hooks,
    h3App,
    router,
    localCall,
    localFetch,
    captureError
  };
  return app;
}
function runNitroPlugins(nitroApp2) {
  for (const plugin of plugins) {
    try {
      plugin(nitroApp2);
    } catch (error) {
      nitroApp2.captureError(error, { tags: ["plugin"] });
      throw error;
    }
  }
}
const nitroApp$1 = createNitroApp();
function useNitroApp() {
  return nitroApp$1;
}
runNitroPlugins(nitroApp$1);

function defineRenderHandler(render) {
  const runtimeConfig = useRuntimeConfig();
  return eventHandler(async (event) => {
    const nitroApp = useNitroApp();
    const ctx = { event, render, response: void 0 };
    await nitroApp.hooks.callHook("render:before", ctx);
    if (!ctx.response) {
      if (event.path === `${runtimeConfig.app.baseURL}favicon.ico`) {
        setResponseHeader(event, "Content-Type", "image/x-icon");
        return send(
          event,
          "data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7"
        );
      }
      ctx.response = await ctx.render(event);
      if (!ctx.response) {
        const _currentStatus = getResponseStatus(event);
        setResponseStatus(event, _currentStatus === 200 ? 500 : _currentStatus);
        return send(
          event,
          "No response returned from render handler: " + event.path
        );
      }
    }
    await nitroApp.hooks.callHook("render:response", ctx.response, ctx);
    if (ctx.response.headers) {
      setResponseHeaders(event, ctx.response.headers);
    }
    if (ctx.response.statusCode || ctx.response.statusMessage) {
      setResponseStatus(
        event,
        ctx.response.statusCode,
        ctx.response.statusMessage
      );
    }
    return ctx.response.body;
  });
}

const scheduledTasks = false;

const tasks = {
  
};

const __runningTasks__ = {};
async function runTask(name, {
  payload = {},
  context = {}
} = {}) {
  if (__runningTasks__[name]) {
    return __runningTasks__[name];
  }
  if (!(name in tasks)) {
    throw createError({
      message: `Task \`${name}\` is not available!`,
      statusCode: 404
    });
  }
  if (!tasks[name].resolve) {
    throw createError({
      message: `Task \`${name}\` is not implemented!`,
      statusCode: 501
    });
  }
  const handler = await tasks[name].resolve();
  const taskEvent = { name, payload, context };
  __runningTasks__[name] = handler.run(taskEvent);
  try {
    const res = await __runningTasks__[name];
    return res;
  } finally {
    delete __runningTasks__[name];
  }
}

if (!globalThis.crypto) {
  globalThis.crypto = crypto$1.webcrypto;
}
const { NITRO_NO_UNIX_SOCKET, NITRO_DEV_WORKER_ID } = process.env;
trapUnhandledNodeErrors();
parentPort?.on("message", (msg) => {
  if (msg && msg.event === "shutdown") {
    shutdown();
  }
});
const nitroApp = useNitroApp();
const server = new Server(toNodeListener(nitroApp.h3App));
let listener;
listen().catch(() => listen(
  true
  /* use random port */
)).catch((error) => {
  console.error("Dev worker failed to listen:", error);
  return shutdown();
});
nitroApp.router.get(
  "/_nitro/tasks",
  defineEventHandler(async (event) => {
    const _tasks = await Promise.all(
      Object.entries(tasks).map(async ([name, task]) => {
        const _task = await task.resolve?.();
        return [name, { description: _task?.meta?.description }];
      })
    );
    return {
      tasks: Object.fromEntries(_tasks),
      scheduledTasks
    };
  })
);
nitroApp.router.use(
  "/_nitro/tasks/:name",
  defineEventHandler(async (event) => {
    const name = getRouterParam(event, "name");
    const payload = {
      ...getQuery$1(event),
      ...await readBody(event).then((r) => r?.payload).catch(() => ({}))
    };
    return await runTask(name, { payload });
  })
);
function listen(useRandomPort = Boolean(
  NITRO_NO_UNIX_SOCKET || process.versions.webcontainer || "Bun" in globalThis && process.platform === "win32"
)) {
  return new Promise((resolve, reject) => {
    try {
      listener = server.listen(useRandomPort ? 0 : getSocketAddress(), () => {
        const address = server.address();
        parentPort?.postMessage({
          event: "listen",
          address: typeof address === "string" ? { socketPath: address } : { host: "localhost", port: address?.port }
        });
        resolve();
      });
    } catch (error) {
      reject(error);
    }
  });
}
function getSocketAddress() {
  const socketName = `nitro-worker-${process.pid}-${threadId}-${NITRO_DEV_WORKER_ID}-${Math.round(Math.random() * 1e4)}.sock`;
  if (process.platform === "win32") {
    return join(String.raw`\\.\pipe`, socketName);
  }
  if (process.platform === "linux") {
    const nodeMajor = Number.parseInt(process.versions.node.split(".")[0], 10);
    if (nodeMajor >= 20) {
      return `\0${socketName}`;
    }
  }
  return join(tmpdir(), socketName);
}
async function shutdown() {
  server.closeAllConnections?.();
  await Promise.all([
    new Promise((resolve) => listener?.close(resolve)),
    nitroApp.hooks.callHook("close").catch(console.error)
  ]);
  parentPort?.postMessage({ event: "exit" });
}

const _messages = {
	"appName": "Nuxt",
	"status": 500,
	"statusText": "Internal server error",
	"description": "This page is temporarily unavailable.",
	"refresh": "Refresh this page"
};
const template$1 = (messages) => {
	messages = {
		..._messages,
		...messages
	};
	return "<!DOCTYPE html><html lang=\"en\"><head><title>" + escapeHtml(messages.status) + " - " + escapeHtml(messages.statusText) + " | " + escapeHtml(messages.appName) + "</title><meta charset=\"utf-8\"><meta content=\"width=device-width,initial-scale=1.0,minimum-scale=1.0\" name=\"viewport\"><script>!function(){const e=document.createElement(\"link\").relList;if(!(e&&e.supports&&e.supports(\"modulepreload\"))){for(const e of document.querySelectorAll('link[rel=\"modulepreload\"]'))r(e);new MutationObserver(e=>{for(const o of e)if(\"childList\"===o.type)for(const e of o.addedNodes)\"LINK\"===e.tagName&&\"modulepreload\"===e.rel&&r(e)}).observe(document,{childList:!0,subtree:!0})}function r(e){if(e.ep)return;e.ep=!0;const r=function(e){const r={};return e.integrity&&(r.integrity=e.integrity),e.referrerPolicy&&(r.referrerPolicy=e.referrerPolicy),\"use-credentials\"===e.crossOrigin?r.credentials=\"include\":\"anonymous\"===e.crossOrigin?r.credentials=\"omit\":r.credentials=\"same-origin\",r}(e);fetch(e.href,r)}}();<\/script><style>*,:after,:before{border-color:var(--un-default-border-color,#e5e7eb);border-style:solid;border-width:0;box-sizing:border-box}:after,:before{--un-content:\"\"}html{line-height:1.5;-webkit-text-size-adjust:100%;font-family:ui-sans-serif,system-ui,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji;font-feature-settings:normal;font-variation-settings:normal;-moz-tab-size:4;tab-size:4;-webkit-tap-highlight-color:transparent}body{line-height:inherit;margin:0}h1,h2{font-size:inherit;font-weight:inherit}h1,h2,p{margin:0}*,:after,:before{--un-rotate:0;--un-rotate-x:0;--un-rotate-y:0;--un-rotate-z:0;--un-scale-x:1;--un-scale-y:1;--un-scale-z:1;--un-skew-x:0;--un-skew-y:0;--un-translate-x:0;--un-translate-y:0;--un-translate-z:0;--un-pan-x: ;--un-pan-y: ;--un-pinch-zoom: ;--un-scroll-snap-strictness:proximity;--un-ordinal: ;--un-slashed-zero: ;--un-numeric-figure: ;--un-numeric-spacing: ;--un-numeric-fraction: ;--un-border-spacing-x:0;--un-border-spacing-y:0;--un-ring-offset-shadow:0 0 transparent;--un-ring-shadow:0 0 transparent;--un-shadow-inset: ;--un-shadow:0 0 transparent;--un-ring-inset: ;--un-ring-offset-width:0px;--un-ring-offset-color:#fff;--un-ring-width:0px;--un-ring-color:rgba(147,197,253,.5);--un-blur: ;--un-brightness: ;--un-contrast: ;--un-drop-shadow: ;--un-grayscale: ;--un-hue-rotate: ;--un-invert: ;--un-saturate: ;--un-sepia: ;--un-backdrop-blur: ;--un-backdrop-brightness: ;--un-backdrop-contrast: ;--un-backdrop-grayscale: ;--un-backdrop-hue-rotate: ;--un-backdrop-invert: ;--un-backdrop-opacity: ;--un-backdrop-saturate: ;--un-backdrop-sepia: }.grid{display:grid}.mb-2{margin-bottom:.5rem}.mb-4{margin-bottom:1rem}.max-w-520px{max-width:520px}.min-h-screen{min-height:100vh}.place-content-center{place-content:center}.overflow-hidden{overflow:hidden}.bg-white{--un-bg-opacity:1;background-color:rgb(255 255 255/var(--un-bg-opacity))}.px-2{padding-left:.5rem;padding-right:.5rem}.text-center{text-align:center}.text-\\[80px\\]{font-size:80px}.text-2xl{font-size:1.5rem;line-height:2rem}.text-\\[\\#020420\\]{--un-text-opacity:1;color:rgb(2 4 32/var(--un-text-opacity))}.text-\\[\\#64748B\\]{--un-text-opacity:1;color:rgb(100 116 139/var(--un-text-opacity))}.font-semibold{font-weight:600}.leading-none{line-height:1}.tracking-wide{letter-spacing:.025em}.font-sans{font-family:ui-sans-serif,system-ui,-apple-system,BlinkMacSystemFont,Segoe UI,Roboto,Helvetica Neue,Arial,Noto Sans,sans-serif,Apple Color Emoji,Segoe UI Emoji,Segoe UI Symbol,Noto Color Emoji}.tabular-nums{--un-numeric-spacing:tabular-nums;font-variant-numeric:var(--un-ordinal) var(--un-slashed-zero) var(--un-numeric-figure) var(--un-numeric-spacing) var(--un-numeric-fraction)}.antialiased{-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale}@media(prefers-color-scheme:dark){.dark\\:bg-\\[\\#020420\\]{--un-bg-opacity:1;background-color:rgb(2 4 32/var(--un-bg-opacity))}.dark\\:text-white{--un-text-opacity:1;color:rgb(255 255 255/var(--un-text-opacity))}}@media(min-width:640px){.sm\\:text-\\[110px\\]{font-size:110px}.sm\\:text-3xl{font-size:1.875rem;line-height:2.25rem}}</style></head><body class=\"antialiased bg-white dark:bg-[#020420] dark:text-white font-sans grid min-h-screen overflow-hidden place-content-center text-[#020420] tracking-wide\"><div class=\"max-w-520px text-center\"><h1 class=\"font-semibold leading-none mb-4 sm:text-[110px] tabular-nums text-[80px]\">" + escapeHtml(messages.status) + "</h1><h2 class=\"font-semibold mb-2 sm:text-3xl text-2xl\">" + escapeHtml(messages.statusText) + "</h2><p class=\"mb-4 px-2 text-[#64748B] text-md\">" + escapeHtml(messages.description) + "</p></div></body></html>";
};

const error500 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template$1
}, Symbol.toStringTag, { value: 'Module' }));

const template = "";

const _virtual__spaTemplate = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  template: template
}, Symbol.toStringTag, { value: 'Module' }));

const styles = {};

const styles$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: styles
}, Symbol.toStringTag, { value: 'Module' }));

function getDefaultExportFromCjs (x) {
	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
}

function getDefaultExportFromNamespaceIfNotNamed (n) {
	return n && Object.prototype.hasOwnProperty.call(n, 'default') && Object.keys(n).length === 1 ? n['default'] : n;
}

var promClient = {};

var registry = {exports: {}};

var util$5 = {};

util$5.getValueAsString = function getValueString(value) {
	if (Number.isNaN(value)) {
		return 'Nan';
	} else if (!Number.isFinite(value)) {
		if (value < 0) {
			return '-Inf';
		} else {
			return '+Inf';
		}
	} else {
		return `${value}`;
	}
};

util$5.removeLabels = function removeLabels(
	hashMap,
	labels,
	sortedLabelNames,
) {
	const hash = hashObject$5(labels, sortedLabelNames);
	delete hashMap[hash];
};

util$5.setValue = function setValue(hashMap, value, labels) {
	const hash = hashObject$5(labels);
	hashMap[hash] = {
		value: typeof value === 'number' ? value : 0,
		labels: labels || {},
	};
	return hashMap;
};

util$5.setValueDelta = function setValueDelta(
	hashMap,
	deltaValue,
	labels,
	hash = '',
) {
	const value = typeof deltaValue === 'number' ? deltaValue : 0;
	if (hashMap[hash]) {
		hashMap[hash].value += value;
	} else {
		hashMap[hash] = { value, labels };
	}
	return hashMap;
};

util$5.getLabels = function (labelNames, args) {
	if (typeof args[0] === 'object') {
		return args[0];
	}

	if (labelNames.length !== args.length) {
		throw new Error(
			`Invalid number of arguments (${args.length}): "${args.join(
				', ',
			)}" for label names (${labelNames.length}): "${labelNames.join(', ')}".`,
		);
	}

	const acc = {};
	for (let i = 0; i < labelNames.length; i++) {
		acc[labelNames[i]] = args[i];
	}
	return acc;
};

function fastHashObject(keys, labels) {
	if (keys.length === 0) {
		return '';
	}

	let hash = '';

	for (let i = 0; i < keys.length; i++) {
		const key = keys[i];
		const value = labels[key];
		if (value === undefined) continue;

		hash += `${key}:${value},`;
	}

	return hash;
}

function hashObject$5(labels, labelNames) {
	// We don't actually need a hash here. We just need a string that
	// is unique for each possible labels object and consistent across
	// calls with equivalent labels objects.

	if (labelNames) {
		return fastHashObject(labelNames, labels);
	}

	const keys = Object.keys(labels);
	if (keys.length > 1) {
		keys.sort(); // need consistency across calls
	}

	return fastHashObject(keys, labels);
}
util$5.hashObject = hashObject$5;

util$5.isObject = function isObject(obj) {
	return obj !== null && typeof obj === 'object';
};

util$5.nowTimestamp = function nowTimestamp() {
	return Date.now() / 1000;
};

let Grouper$2 = class Grouper extends Map {
	/**
	 * Adds the `value` to the `key`'s array of values.
	 * @param {*} key Key to set.
	 * @param {*} value Value to add to `key`'s array.
	 * @returns {undefined} undefined.
	 */
	add(key, value) {
		if (this.has(key)) {
			this.get(key).push(value);
		} else {
			this.set(key, [value]);
		}
	}
};

util$5.Grouper = Grouper$2;

const { getValueAsString } = util$5;

let Registry$2 = class Registry {
	static get PROMETHEUS_CONTENT_TYPE() {
		return 'text/plain; version=0.0.4; charset=utf-8';
	}

	static get OPENMETRICS_CONTENT_TYPE() {
		return 'application/openmetrics-text; version=1.0.0; charset=utf-8';
	}

	constructor(regContentType = Registry.PROMETHEUS_CONTENT_TYPE) {
		this._metrics = {};
		this._collectors = [];
		this._defaultLabels = {};
		if (
			regContentType !== Registry.PROMETHEUS_CONTENT_TYPE &&
			regContentType !== Registry.OPENMETRICS_CONTENT_TYPE
		) {
			throw new TypeError(`Content type ${regContentType} is unsupported`);
		}
		this._contentType = regContentType;
	}

	getMetricsAsArray() {
		return Object.values(this._metrics);
	}

	async getMetricsAsString(metrics) {
		const metric =
			typeof metrics.getForPromString === 'function'
				? await metrics.getForPromString()
				: await metrics.get();

		const name = escapeString(metric.name);
		const help = `# HELP ${name} ${escapeString(metric.help)}`;
		const type = `# TYPE ${name} ${metric.type}`;
		const values = [help, type];

		const defaultLabels =
			Object.keys(this._defaultLabels).length > 0 ? this._defaultLabels : null;

		const isOpenMetrics =
			this.contentType === Registry.OPENMETRICS_CONTENT_TYPE;

		for (const val of metric.values || []) {
			let { metricName = name, labels = {} } = val;
			const { sharedLabels = {} } = val;
			if (isOpenMetrics && metric.type === 'counter') {
				metricName = `${metricName}_total`;
			}

			if (defaultLabels) {
				labels = { ...labels, ...defaultLabels, ...labels };
			}

			// We have to flatten these separately to avoid duplicate labels appearing
			// between the base labels and the shared labels
			const formattedLabels = formatLabels(labels, sharedLabels);

			const flattenedShared = flattenSharedLabels(sharedLabels);
			const labelParts = [...formattedLabels, flattenedShared].filter(Boolean);
			const labelsString = labelParts.length ? `{${labelParts.join(',')}}` : '';
			let fullMetricLine = `${metricName}${labelsString} ${getValueAsString(
				val.value,
			)}`;

			const { exemplar } = val;
			if (exemplar && isOpenMetrics) {
				const formattedExemplars = formatLabels(exemplar.labelSet);
				fullMetricLine += ` # {${formattedExemplars.join(
					',',
				)}} ${getValueAsString(exemplar.value)} ${exemplar.timestamp}`;
			}
			values.push(fullMetricLine);
		}

		return values.join('\n');
	}

	async metrics() {
		const isOpenMetrics =
			this.contentType === Registry.OPENMETRICS_CONTENT_TYPE;

		const promises = this.getMetricsAsArray().map(metric => {
			if (isOpenMetrics && metric.type === 'counter') {
				metric.name = standardizeCounterName(metric.name);
			}
			return this.getMetricsAsString(metric);
		});

		const resolves = await Promise.all(promises);

		return isOpenMetrics
			? `${resolves.join('\n')}\n# EOF\n`
			: `${resolves.join('\n\n')}\n`;
	}

	registerMetric(metric) {
		if (this._metrics[metric.name] && this._metrics[metric.name] !== metric) {
			throw new Error(
				`A metric with the name ${metric.name} has already been registered.`,
			);
		}

		this._metrics[metric.name] = metric;
	}

	clear() {
		this._metrics = {};
		this._defaultLabels = {};
	}

	async getMetricsAsJSON() {
		const metrics = [];
		const defaultLabelNames = Object.keys(this._defaultLabels);

		const promises = [];

		for (const metric of this.getMetricsAsArray()) {
			promises.push(metric.get());
		}

		const resolves = await Promise.all(promises);

		for (const item of resolves) {
			if (item.values && defaultLabelNames.length > 0) {
				for (const val of item.values) {
					// Make a copy before mutating
					val.labels = Object.assign({}, val.labels);

					for (const labelName of defaultLabelNames) {
						val.labels[labelName] =
							val.labels[labelName] || this._defaultLabels[labelName];
					}
				}
			}

			metrics.push(item);
		}

		return metrics;
	}

	removeSingleMetric(name) {
		delete this._metrics[name];
	}

	getSingleMetricAsString(name) {
		return this.getMetricsAsString(this._metrics[name]);
	}

	getSingleMetric(name) {
		return this._metrics[name];
	}

	setDefaultLabels(labels) {
		this._defaultLabels = labels;
	}

	resetMetrics() {
		for (const metric in this._metrics) {
			this._metrics[metric].reset();
		}
	}

	get contentType() {
		return this._contentType;
	}

	setContentType(metricsContentType) {
		if (
			metricsContentType === Registry.OPENMETRICS_CONTENT_TYPE ||
			metricsContentType === Registry.PROMETHEUS_CONTENT_TYPE
		) {
			this._contentType = metricsContentType;
		} else {
			throw new Error(`Content type ${metricsContentType} is unsupported`);
		}
	}

	static merge(registers) {
		const regType = registers[0].contentType;
		for (const reg of registers) {
			if (reg.contentType !== regType) {
				throw new Error(
					'Registers can only be merged if they have the same content type',
				);
			}
		}
		const mergedRegistry = new Registry(regType);

		const metricsToMerge = registers.reduce(
			(acc, reg) => acc.concat(reg.getMetricsAsArray()),
			[],
		);

		metricsToMerge.forEach(mergedRegistry.registerMetric, mergedRegistry);
		return mergedRegistry;
	}
};

function formatLabels(labels, exclude) {
	const { hasOwnProperty } = Object.prototype;
	const formatted = [];
	for (const [name, value] of Object.entries(labels)) {
		if (!exclude || !hasOwnProperty.call(exclude, name)) {
			formatted.push(`${name}="${escapeLabelValue(value)}"`);
		}
	}
	return formatted;
}

const sharedLabelCache = new WeakMap();
function flattenSharedLabels(labels) {
	const cached = sharedLabelCache.get(labels);
	if (cached) {
		return cached;
	}

	const formattedLabels = formatLabels(labels);
	const flattened = formattedLabels.join(',');
	sharedLabelCache.set(labels, flattened);
	return flattened;
}
function escapeLabelValue(str) {
	if (typeof str !== 'string') {
		return str;
	}
	return escapeString(str).replace(/"/g, '\\"');
}
function escapeString(str) {
	return str.replace(/\\/g, '\\\\').replace(/\n/g, '\\n');
}
function standardizeCounterName(name) {
	return name.replace(/_total$/, '');
}

registry.exports = Registry$2;
registry.exports.globalRegistry = new Registry$2();

var registryExports = registry.exports;

var validation = {};

const require$$0$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_util);

const util$4 = require$$0$2;

// These are from https://prometheus.io/docs/concepts/data_model/#metric-names-and-labels
const metricRegexp = /^[a-zA-Z_:][a-zA-Z0-9_:]*$/;
const labelRegexp = /^[a-zA-Z_][a-zA-Z0-9_]*$/;

validation.validateMetricName = function (name) {
	return metricRegexp.test(name);
};

validation.validateLabelName = function (names = []) {
	return names.every(name => labelRegexp.test(name));
};

validation.validateLabel = function validateLabel(savedLabels, labels) {
	for (const label in labels) {
		if (!savedLabels.includes(label)) {
			throw new Error(
				`Added label "${label}" is not included in initial labelset: ${util$4.inspect(
					savedLabels,
				)}`,
			);
		}
	}
};

const Registry$1 = registryExports;
const { isObject: isObject$4 } = util$5;
const { validateMetricName, validateLabelName } = validation;

/**
 * @abstract
 */
let Metric$4 = class Metric {
	constructor(config, defaults = {}) {
		if (!isObject$4(config)) {
			throw new TypeError('constructor expected a config object');
		}
		Object.assign(
			this,
			{
				labelNames: [],
				registers: [Registry$1.globalRegistry],
				aggregator: 'sum',
				enableExemplars: false,
			},
			defaults,
			config,
		);
		if (!this.registers) {
			// in case config.registers is `undefined`
			this.registers = [Registry$1.globalRegistry];
		}
		if (!this.help) {
			throw new Error('Missing mandatory help parameter');
		}
		if (!this.name) {
			throw new Error('Missing mandatory name parameter');
		}
		if (!validateMetricName(this.name)) {
			throw new Error('Invalid metric name');
		}
		if (!validateLabelName(this.labelNames)) {
			throw new Error('Invalid label name');
		}

		if (this.collect && typeof this.collect !== 'function') {
			throw new Error('Optional "collect" parameter must be a function');
		}

		if (this.labelNames) {
			this.sortedLabelNames = [...this.labelNames].sort();
		} else {
			this.sortedLabelNames = [];
		}

		this.reset();

		for (const register of this.registers) {
			if (
				this.enableExemplars &&
				register.contentType === Registry$1.PROMETHEUS_CONTENT_TYPE
			) {
				throw new TypeError(
					'Exemplars are supported only on OpenMetrics registries',
				);
			}
			register.registerMetric(this);
		}
	}

	reset() {
		/* abstract */
	}
};

var metric = { Metric: Metric$4 };

/**
 * Class representing an OpenMetrics exemplar.
 *
 * @property {object} labelSet
 * @property {number} value
 * @property {number} [timestamp]
 * */
let Exemplar$2 = class Exemplar {
	constructor(labelSet = {}, value = null) {
		this.labelSet = labelSet;
		this.value = value;
	}

	/**
	 * Validation for the label set format.
	 * https://github.com/OpenObservability/OpenMetrics/blob/d99b705f611b75fec8f450b05e344e02eea6921d/specification/OpenMetrics.md#exemplars
	 *
	 * @param {object} labelSet - Exemplar labels.
	 * @throws {RangeError}
	 * @return {void}
	 */
	validateExemplarLabelSet(labelSet) {
		let res = '';
		for (const [labelName, labelValue] of Object.entries(labelSet)) {
			res += `${labelName}${labelValue}`;
		}
		if (res.length > 128) {
			throw new RangeError(
				'Label set size must be smaller than 128 UTF-8 chars',
			);
		}
	}
};

var exemplar = Exemplar$2;

/**
 * Counter metric
 */

const util$3 = require$$0$2;
const {
	hashObject: hashObject$4,
	isObject: isObject$3,
	getLabels: getLabels$3,
	removeLabels: removeLabels$3,
	nowTimestamp: nowTimestamp$1,
} = util$5;
const { validateLabel: validateLabel$3 } = validation;
const { Metric: Metric$3 } = metric;
const Exemplar$1 = exemplar;

let Counter$1 = class Counter extends Metric$3 {
	constructor(config) {
		super(config);
		this.type = 'counter';
		this.defaultLabels = {};
		this.defaultValue = 1;
		this.defaultExemplarLabelSet = {};
		if (config.enableExemplars) {
			this.enableExemplars = true;
			this.inc = this.incWithExemplar;
		} else {
			this.inc = this.incWithoutExemplar;
		}
	}

	/**
	 * Increment counter
	 * @param {object} labels - What label you want to be incremented
	 * @param {Number} value - Value to increment, if omitted increment with 1
	 * @returns {object} results - object with information about the inc operation
	 * @returns {string} results.labelHash - hash representation of the labels
	 */
	incWithoutExemplar(labels, value) {
		let hash = '';
		if (isObject$3(labels)) {
			hash = hashObject$4(labels, this.sortedLabelNames);
			validateLabel$3(this.labelNames, labels);
		} else {
			value = labels;
			labels = {};
		}

		if (value && !Number.isFinite(value)) {
			throw new TypeError(`Value is not a valid number: ${util$3.format(value)}`);
		}
		if (value < 0) {
			throw new Error('It is not possible to decrease a counter');
		}

		if (value === null || value === undefined) value = 1;

		setValue$1(this.hashMap, value, labels, hash);

		return { labelHash: hash };
	}

	/**
	 * Increment counter with exemplar, same as inc but accepts labels for an
	 * exemplar.
	 * If no label is provided the current exemplar labels are kept unchanged
	 * (defaults to empty set).
	 *
	 * @param {object} incOpts - Object with options about what metric to increase
	 * @param {object} incOpts.labels - What label you want to be incremented,
	 *                                  defaults to null (metric with no labels)
	 * @param {Number} incOpts.value - Value to increment, defaults to 1
	 * @param {object} incOpts.exemplarLabels - Key-value  labels for the
	 *                                          exemplar, defaults to empty set {}
	 * @returns {void}
	 */
	incWithExemplar({
		labels = this.defaultLabels,
		value = this.defaultValue,
		exemplarLabels = this.defaultExemplarLabelSet,
	} = {}) {
		const res = this.incWithoutExemplar(labels, value);
		this.updateExemplar(exemplarLabels, value, res.labelHash);
	}

	updateExemplar(exemplarLabels, value, hash) {
		if (exemplarLabels === this.defaultExemplarLabelSet) return;
		if (!isObject$3(this.hashMap[hash].exemplar)) {
			this.hashMap[hash].exemplar = new Exemplar$1();
		}
		this.hashMap[hash].exemplar.validateExemplarLabelSet(exemplarLabels);
		this.hashMap[hash].exemplar.labelSet = exemplarLabels;
		this.hashMap[hash].exemplar.value = value ? value : 1;
		this.hashMap[hash].exemplar.timestamp = nowTimestamp$1();
	}

	/**
	 * Reset counter
	 * @returns {void}
	 */
	reset() {
		this.hashMap = {};
		if (this.labelNames.length === 0) {
			setValue$1(this.hashMap, 0);
		}
	}

	async get() {
		if (this.collect) {
			const v = this.collect();
			if (v instanceof Promise) await v;
		}

		return {
			help: this.help,
			name: this.name,
			type: this.type,
			values: Object.values(this.hashMap),
			aggregator: this.aggregator,
		};
	}

	labels(...args) {
		const labels = getLabels$3(this.labelNames, args) || {};
		return {
			inc: this.inc.bind(this, labels),
		};
	}

	remove(...args) {
		const labels = getLabels$3(this.labelNames, args) || {};
		validateLabel$3(this.labelNames, labels);
		return removeLabels$3.call(this, this.hashMap, labels, this.sortedLabelNames);
	}
};

function setValue$1(hashMap, value, labels = {}, hash = '') {
	if (hashMap[hash]) {
		hashMap[hash].value += value;
	} else {
		hashMap[hash] = { value, labels };
	}
	return hashMap;
}

var counter = Counter$1;

/**
 * Gauge metric
 */

const util$2 = require$$0$2;

const {
	setValue,
	setValueDelta,
	getLabels: getLabels$2,
	hashObject: hashObject$3,
	isObject: isObject$2,
	removeLabels: removeLabels$2,
} = util$5;
const { validateLabel: validateLabel$2 } = validation;
const { Metric: Metric$2 } = metric;

let Gauge$c = class Gauge extends Metric$2 {
	constructor(config) {
		super(config);
		this.type = 'gauge';
	}

	/**
	 * Set a gauge to a value
	 * @param {object} labels - Object with labels and their values
	 * @param {Number} value - Value to set the gauge to, must be positive
	 * @returns {void}
	 */
	set(labels, value) {
		value = getValueArg(labels, value);
		labels = getLabelArg(labels);
		set(this, labels, value);
	}

	/**
	 * Reset gauge
	 * @returns {void}
	 */
	reset() {
		this.hashMap = {};
		if (this.labelNames.length === 0) {
			setValue(this.hashMap, 0, {});
		}
	}

	/**
	 * Increment a gauge value
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @param {Number} value - Value to increment - if omitted, increment with 1
	 * @returns {void}
	 */
	inc(labels, value) {
		value = getValueArg(labels, value);
		labels = getLabelArg(labels);
		if (value === undefined) value = 1;
		setDelta(this, labels, value);
	}

	/**
	 * Decrement a gauge value
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @param {Number} value - Value to decrement - if omitted, decrement with 1
	 * @returns {void}
	 */
	dec(labels, value) {
		value = getValueArg(labels, value);
		labels = getLabelArg(labels);
		if (value === undefined) value = 1;
		setDelta(this, labels, -value);
	}

	/**
	 * Set the gauge to current unix epoch
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @returns {void}
	 */
	setToCurrentTime(labels) {
		const now = Date.now() / 1000;
		if (labels === undefined) {
			this.set(now);
		} else {
			this.set(labels, now);
		}
	}

	/**
	 * Start a timer
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @returns {function} - Invoke this function to set the duration in seconds since you started the timer.
	 * @example
	 * var done = gauge.startTimer();
	 * makeXHRRequest(function(err, response) {
	 *	done(); //Duration of the request will be saved
	 * });
	 */
	startTimer(labels) {
		const start = process.hrtime();
		return endLabels => {
			const delta = process.hrtime(start);
			const value = delta[0] + delta[1] / 1e9;
			this.set(Object.assign({}, labels, endLabels), value);
			return value;
		};
	}

	async get() {
		if (this.collect) {
			const v = this.collect();
			if (v instanceof Promise) await v;
		}
		return {
			help: this.help,
			name: this.name,
			type: this.type,
			values: Object.values(this.hashMap),
			aggregator: this.aggregator,
		};
	}

	_getValue(labels) {
		const hash = hashObject$3(labels || {}, this.sortedLabelNames);
		return this.hashMap[hash] ? this.hashMap[hash].value : 0;
	}

	labels(...args) {
		const labels = getLabels$2(this.labelNames, args);
		validateLabel$2(this.labelNames, labels);
		return {
			inc: this.inc.bind(this, labels),
			dec: this.dec.bind(this, labels),
			set: this.set.bind(this, labels),
			setToCurrentTime: this.setToCurrentTime.bind(this, labels),
			startTimer: this.startTimer.bind(this, labels),
		};
	}

	remove(...args) {
		const labels = getLabels$2(this.labelNames, args);
		validateLabel$2(this.labelNames, labels);
		removeLabels$2.call(this, this.hashMap, labels, this.sortedLabelNames);
	}
};

function set(gauge, labels, value) {
	if (typeof value !== 'number') {
		throw new TypeError(`Value is not a valid number: ${util$2.format(value)}`);
	}

	validateLabel$2(gauge.labelNames, labels);
	setValue(gauge.hashMap, value, labels);
}

function setDelta(gauge, labels, delta) {
	if (typeof delta !== 'number') {
		throw new TypeError(`Delta is not a valid number: ${util$2.format(delta)}`);
	}

	validateLabel$2(gauge.labelNames, labels);
	const hash = hashObject$3(labels, gauge.sortedLabelNames);
	setValueDelta(gauge.hashMap, delta, labels, hash);
}

function getLabelArg(labels) {
	return isObject$2(labels) ? labels : {};
}

function getValueArg(labels, value) {
	return isObject$2(labels) ? value : labels;
}

var gauge = Gauge$c;

/**
 * Histogram
 */

const util$1 = require$$0$2;
const {
	getLabels: getLabels$1,
	hashObject: hashObject$2,
	isObject: isObject$1,
	removeLabels: removeLabels$1,
	nowTimestamp,
} = util$5;
const { validateLabel: validateLabel$1 } = validation;
const { Metric: Metric$1 } = metric;
const Exemplar = exemplar;

let Histogram$1 = class Histogram extends Metric$1 {
	constructor(config) {
		super(config, {
			buckets: [0.005, 0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2.5, 5, 10],
		});

		this.type = 'histogram';
		this.defaultLabels = {};
		this.defaultExemplarLabelSet = {};
		this.enableExemplars = false;

		for (const label of this.labelNames) {
			if (label === 'le') {
				throw new Error('le is a reserved label keyword');
			}
		}

		this.upperBounds = this.buckets;
		this.bucketValues = this.upperBounds.reduce((acc, upperBound) => {
			acc[upperBound] = 0;
			return acc;
		}, {});

		if (config.enableExemplars) {
			this.enableExemplars = true;
			this.bucketExemplars = this.upperBounds.reduce((acc, upperBound) => {
				acc[upperBound] = null;
				return acc;
			}, {});
			Object.freeze(this.bucketExemplars);
			this.observe = this.observeWithExemplar;
		} else {
			this.observe = this.observeWithoutExemplar;
		}

		Object.freeze(this.bucketValues);
		Object.freeze(this.upperBounds);

		if (this.labelNames.length === 0) {
			this.hashMap = {
				[hashObject$2({})]: createBaseValues(
					{},
					this.bucketValues,
					this.bucketExemplars,
				),
			};
		}
	}

	/**
	 * Observe a value in histogram
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @param {Number} value - Value to observe in the histogram
	 * @returns {void}
	 */
	observeWithoutExemplar(labels, value) {
		observe$1.call(this, labels === 0 ? 0 : labels || {})(value);
	}

	observeWithExemplar({
		labels = this.defaultLabels,
		value,
		exemplarLabels = this.defaultExemplarLabelSet,
	} = {}) {
		observe$1.call(this, labels === 0 ? 0 : labels || {})(value);
		this.updateExemplar(labels, value, exemplarLabels);
	}

	updateExemplar(labels, value, exemplarLabels) {
		if (Object.keys(exemplarLabels).length === 0) return;
		const hash = hashObject$2(labels, this.sortedLabelNames);
		const bound = findBound(this.upperBounds, value);
		const { bucketExemplars } = this.hashMap[hash];
		let exemplar = bucketExemplars[bound];
		if (!isObject$1(exemplar)) {
			exemplar = new Exemplar();
			bucketExemplars[bound] = exemplar;
		}
		exemplar.validateExemplarLabelSet(exemplarLabels);
		exemplar.labelSet = exemplarLabels;
		exemplar.value = value;
		exemplar.timestamp = nowTimestamp();
	}

	async get() {
		const data = await this.getForPromString();
		data.values = data.values.map(splayLabels);
		return data;
	}

	async getForPromString() {
		if (this.collect) {
			const v = this.collect();
			if (v instanceof Promise) await v;
		}
		const data = Object.values(this.hashMap);
		const values = data
			.map(extractBucketValuesForExport(this))
			.reduce(addSumAndCountForExport(this), []);

		return {
			name: this.name,
			help: this.help,
			type: this.type,
			values,
			aggregator: this.aggregator,
		};
	}

	reset() {
		this.hashMap = {};
	}

	/**
	 * Initialize the metrics for the given combination of labels to zero
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @returns {void}
	 */
	zero(labels) {
		const hash = hashObject$2(labels, this.sortedLabelNames);
		this.hashMap[hash] = createBaseValues(
			labels,
			this.bucketValues,
			this.bucketExemplars,
		);
	}

	/**
	 * Start a timer that could be used to logging durations
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @param {object} exemplarLabels - Object with labels for exemplar where key is the label key and value is label value. Can only be one level deep
	 * @returns {function} - Function to invoke when you want to stop the timer and observe the duration in seconds
	 * @example
	 * var end = histogram.startTimer();
	 * makeExpensiveXHRRequest(function(err, res) {
	 * 	const duration = end(); //Observe the duration of expensiveXHRRequest and returns duration in seconds
	 * 	console.log('Duration', duration);
	 * });
	 */
	startTimer(labels, exemplarLabels) {
		return this.enableExemplars
			? startTimerWithExemplar.call(this, labels, exemplarLabels)()
			: startTimer$1.call(this, labels)();
	}

	labels(...args) {
		const labels = getLabels$1(this.labelNames, args);
		validateLabel$1(this.labelNames, labels);
		return {
			observe: observe$1.call(this, labels),
			startTimer: startTimer$1.call(this, labels),
		};
	}

	remove(...args) {
		const labels = getLabels$1(this.labelNames, args);
		validateLabel$1(this.labelNames, labels);
		removeLabels$1.call(this, this.hashMap, labels, this.sortedLabelNames);
	}
};

function startTimer$1(startLabels) {
	return () => {
		const start = process.hrtime();
		return endLabels => {
			const delta = process.hrtime(start);
			const value = delta[0] + delta[1] / 1e9;
			this.observe(Object.assign({}, startLabels, endLabels), value);
			return value;
		};
	};
}

function startTimerWithExemplar(startLabels, startExemplarLabels) {
	return () => {
		const start = process.hrtime();
		return (endLabels, endExemplarLabels) => {
			const delta = process.hrtime(start);
			const value = delta[0] + delta[1] / 1e9;
			this.observe({
				labels: Object.assign({}, startLabels, endLabels),
				value,
				exemplarLabels: Object.assign(
					{},
					startExemplarLabels,
					endExemplarLabels,
				),
			});
			return value;
		};
	};
}

function setValuePair(labels, value, metricName, exemplar, sharedLabels = {}) {
	return {
		labels,
		sharedLabels,
		value,
		metricName,
		exemplar,
	};
}

function findBound(upperBounds, value) {
	for (let i = 0; i < upperBounds.length; i++) {
		const bound = upperBounds[i];
		if (value <= bound) {
			return bound;
		}
	}
	return -1;
}

function observe$1(labels) {
	return value => {
		const labelValuePair = convertLabelsAndValues$1(labels, value);

		validateLabel$1(this.labelNames, labelValuePair.labels);
		if (!Number.isFinite(labelValuePair.value)) {
			throw new TypeError(
				`Value is not a valid number: ${util$1.format(labelValuePair.value)}`,
			);
		}

		const hash = hashObject$2(labelValuePair.labels, this.sortedLabelNames);
		let valueFromMap = this.hashMap[hash];
		if (!valueFromMap) {
			valueFromMap = createBaseValues(
				labelValuePair.labels,
				this.bucketValues,
				this.bucketExemplars,
			);
		}

		const b = findBound(this.upperBounds, labelValuePair.value);

		valueFromMap.sum += labelValuePair.value;
		valueFromMap.count += 1;

		if (Object.prototype.hasOwnProperty.call(valueFromMap.bucketValues, b)) {
			valueFromMap.bucketValues[b] += 1;
		}

		this.hashMap[hash] = valueFromMap;
	};
}

function createBaseValues(labels, bucketValues, bucketExemplars) {
	const result = {
		labels,
		bucketValues: { ...bucketValues },
		sum: 0,
		count: 0,
	};
	if (bucketExemplars) {
		result.bucketExemplars = { ...bucketExemplars };
	}
	return result;
}

function convertLabelsAndValues$1(labels, value) {
	return isObject$1(labels)
		? {
				labels,
				value,
			}
		: {
				value: labels,
				labels: {},
			};
}

function extractBucketValuesForExport(histogram) {
	const name = `${histogram.name}_bucket`;
	return bucketData => {
		let acc = 0;
		const buckets = histogram.upperBounds.map(upperBound => {
			acc += bucketData.bucketValues[upperBound];
			return setValuePair(
				{ le: upperBound },
				acc,
				name,
				bucketData.bucketExemplars
					? bucketData.bucketExemplars[upperBound]
					: null,
				bucketData.labels,
			);
		});
		return { buckets, data: bucketData };
	};
}

function addSumAndCountForExport(histogram) {
	return (acc, d) => {
		acc.push(...d.buckets);

		const infLabel = { le: '+Inf' };
		acc.push(
			setValuePair(
				infLabel,
				d.data.count,
				`${histogram.name}_bucket`,
				d.data.bucketExemplars ? d.data.bucketExemplars['-1'] : null,
				d.data.labels,
			),
			setValuePair(
				{},
				d.data.sum,
				`${histogram.name}_sum`,
				undefined,
				d.data.labels,
			),
			setValuePair(
				{},
				d.data.count,
				`${histogram.name}_count`,
				undefined,
				d.data.labels,
			),
		);
		return acc;
	};
}

function splayLabels(bucket) {
	const { sharedLabels, labels, ...newBucket } = bucket;
	for (const label of Object.keys(sharedLabels)) {
		labels[label] = sharedLabels[label];
	}
	newBucket.labels = labels;
	return newBucket;
}

var histogram = Histogram$1;

const require$$0$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(tdigest);

const { TDigest } = require$$0$1;

class TimeWindowQuantiles {
	constructor(maxAgeSeconds, ageBuckets) {
		this.maxAgeSeconds = maxAgeSeconds || 0;
		this.ageBuckets = ageBuckets || 0;

		this.shouldRotate = maxAgeSeconds && ageBuckets;

		this.ringBuffer = Array(ageBuckets).fill(new TDigest());
		this.currentBuffer = 0;

		this.lastRotateTimestampMillis = Date.now();
		this.durationBetweenRotatesMillis =
			(maxAgeSeconds * 1000) / ageBuckets || Infinity;
	}

	size() {
		const bucket = rotate.call(this);
		return bucket.size();
	}

	percentile(quantile) {
		const bucket = rotate.call(this);
		return bucket.percentile(quantile);
	}

	push(value) {
		rotate.call(this);
		this.ringBuffer.forEach(bucket => {
			bucket.push(value);
		});
	}

	reset() {
		this.ringBuffer.forEach(bucket => {
			bucket.reset();
		});
	}

	compress() {
		this.ringBuffer.forEach(bucket => {
			bucket.compress();
		});
	}
}

function rotate() {
	let timeSinceLastRotateMillis = Date.now() - this.lastRotateTimestampMillis;
	while (
		timeSinceLastRotateMillis > this.durationBetweenRotatesMillis &&
		this.shouldRotate
	) {
		this.ringBuffer[this.currentBuffer] = new TDigest();

		if (++this.currentBuffer >= this.ringBuffer.length) {
			this.currentBuffer = 0;
		}
		timeSinceLastRotateMillis -= this.durationBetweenRotatesMillis;
		this.lastRotateTimestampMillis += this.durationBetweenRotatesMillis;
	}
	return this.ringBuffer[this.currentBuffer];
}

var timeWindowQuantiles$1 = TimeWindowQuantiles;

/**
 * Summary
 */

const util = require$$0$2;
const { getLabels, hashObject: hashObject$1, removeLabels } = util$5;
const { validateLabel } = validation;
const { Metric } = metric;
const timeWindowQuantiles = timeWindowQuantiles$1;

const DEFAULT_COMPRESS_COUNT = 1000; // every 1000 measurements

class Summary extends Metric {
	constructor(config) {
		super(config, {
			percentiles: [0.01, 0.05, 0.5, 0.9, 0.95, 0.99, 0.999],
			compressCount: DEFAULT_COMPRESS_COUNT,
			hashMap: {},
		});

		this.type = 'summary';

		for (const label of this.labelNames) {
			if (label === 'quantile')
				throw new Error('quantile is a reserved label keyword');
		}

		if (this.labelNames.length === 0) {
			this.hashMap = {
				[hashObject$1({})]: {
					labels: {},
					td: new timeWindowQuantiles(this.maxAgeSeconds, this.ageBuckets),
					count: 0,
					sum: 0,
				},
			};
		}
	}

	/**
	 * Observe a value
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @param {Number} value - Value to observe
	 * @returns {void}
	 */
	observe(labels, value) {
		observe.call(this, labels === 0 ? 0 : labels || {})(value);
	}

	async get() {
		if (this.collect) {
			const v = this.collect();
			if (v instanceof Promise) await v;
		}
		const hashKeys = Object.keys(this.hashMap);
		const values = [];

		hashKeys.forEach(hashKey => {
			const s = this.hashMap[hashKey];
			if (s) {
				if (this.pruneAgedBuckets && s.td.size() === 0) {
					delete this.hashMap[hashKey];
				} else {
					extractSummariesForExport(s, this.percentiles).forEach(v => {
						values.push(v);
					});
					values.push(getSumForExport(s, this));
					values.push(getCountForExport(s, this));
				}
			}
		});

		return {
			name: this.name,
			help: this.help,
			type: this.type,
			values,
			aggregator: this.aggregator,
		};
	}

	reset() {
		const data = Object.values(this.hashMap);
		data.forEach(s => {
			s.td.reset();
			s.count = 0;
			s.sum = 0;
		});
	}

	/**
	 * Start a timer that could be used to logging durations
	 * @param {object} labels - Object with labels where key is the label key and value is label value. Can only be one level deep
	 * @returns {function} - Function to invoke when you want to stop the timer and observe the duration in seconds
	 * @example
	 * var end = summary.startTimer();
	 * makeExpensiveXHRRequest(function(err, res) {
	 *	end(); //Observe the duration of expensiveXHRRequest
	 * });
	 */
	startTimer(labels) {
		return startTimer.call(this, labels)();
	}

	labels(...args) {
		const labels = getLabels(this.labelNames, args);
		validateLabel(this.labelNames, labels);
		return {
			observe: observe.call(this, labels),
			startTimer: startTimer.call(this, labels),
		};
	}

	remove(...args) {
		const labels = getLabels(this.labelNames, args);
		validateLabel(this.labelNames, labels);
		removeLabels.call(this, this.hashMap, labels, this.sortedLabelNames);
	}
}

function extractSummariesForExport(summaryOfLabels, percentiles) {
	summaryOfLabels.td.compress();

	return percentiles.map(percentile => {
		const percentileValue = summaryOfLabels.td.percentile(percentile);
		return {
			labels: Object.assign({ quantile: percentile }, summaryOfLabels.labels),
			value: percentileValue ? percentileValue : 0,
		};
	});
}

function getCountForExport(value, summary) {
	return {
		metricName: `${summary.name}_count`,
		labels: value.labels,
		value: value.count,
	};
}

function getSumForExport(value, summary) {
	return {
		metricName: `${summary.name}_sum`,
		labels: value.labels,
		value: value.sum,
	};
}

function startTimer(startLabels) {
	return () => {
		const start = process.hrtime();
		return endLabels => {
			const delta = process.hrtime(start);
			const value = delta[0] + delta[1] / 1e9;
			this.observe(Object.assign({}, startLabels, endLabels), value);
			return value;
		};
	};
}

function observe(labels) {
	return value => {
		const labelValuePair = convertLabelsAndValues(labels, value);

		validateLabel(this.labelNames, labels);
		if (!Number.isFinite(labelValuePair.value)) {
			throw new TypeError(
				`Value is not a valid number: ${util.format(labelValuePair.value)}`,
			);
		}

		const hash = hashObject$1(labelValuePair.labels, this.sortedLabelNames);
		let summaryOfLabel = this.hashMap[hash];
		if (!summaryOfLabel) {
			summaryOfLabel = {
				labels: labelValuePair.labels,
				td: new timeWindowQuantiles(this.maxAgeSeconds, this.ageBuckets),
				count: 0,
				sum: 0,
			};
		}

		summaryOfLabel.td.push(labelValuePair.value);
		summaryOfLabel.count++;
		if (summaryOfLabel.count % this.compressCount === 0) {
			summaryOfLabel.td.compress();
		}
		summaryOfLabel.sum += labelValuePair.value;
		this.hashMap[hash] = summaryOfLabel;
	};
}

function convertLabelsAndValues(labels, value) {
	if (value === undefined) {
		return {
			value: labels,
			labels: {},
		};
	}

	return {
		labels,
		value,
	};
}

var summary = Summary;

const require$$0 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_url);

const require$$1$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(http$1);

const require$$2$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_https);

const require$$3$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_zlib);

const url = require$$0;
const http = require$$1$2;
const https = require$$2$1;
const { gzipSync } = require$$3$1;
const { globalRegistry } = registryExports;

class Pushgateway {
	constructor(gatewayUrl, options, registry) {
		if (!registry) {
			registry = globalRegistry;
		}
		this.registry = registry;
		this.gatewayUrl = gatewayUrl;
		const { requireJobName, ...requestOptions } = {
			requireJobName: true,
			...options,
		};
		this.requireJobName = requireJobName;
		this.requestOptions = requestOptions;
	}

	pushAdd(params = {}) {
		if (this.requireJobName && !params.jobName) {
			throw new Error('Missing jobName parameter');
		}

		return useGateway.call(this, 'POST', params.jobName, params.groupings);
	}

	push(params = {}) {
		if (this.requireJobName && !params.jobName) {
			throw new Error('Missing jobName parameter');
		}

		return useGateway.call(this, 'PUT', params.jobName, params.groupings);
	}

	delete(params = {}) {
		if (this.requireJobName && !params.jobName) {
			throw new Error('Missing jobName parameter');
		}

		return useGateway.call(this, 'DELETE', params.jobName, params.groupings);
	}
}
async function useGateway(method, job, groupings) {
	// `URL` first added in v6.13.0
	// eslint-disable-next-line n/no-deprecated-api
	const gatewayUrlParsed = url.parse(this.gatewayUrl);
	const gatewayUrlPath =
		gatewayUrlParsed.pathname && gatewayUrlParsed.pathname !== '/'
			? gatewayUrlParsed.pathname
			: '';
	const jobPath = job
		? `/job/${encodeURIComponent(job)}${generateGroupings(groupings)}`
		: '';
	const path = `${gatewayUrlPath}/metrics${jobPath}`;

	// eslint-disable-next-line n/no-deprecated-api
	const target = url.resolve(this.gatewayUrl, path);
	// eslint-disable-next-line n/no-deprecated-api
	const requestParams = url.parse(target);
	const httpModule = isHttps(requestParams.href) ? https : http;
	const options = Object.assign(requestParams, this.requestOptions, {
		method,
	});

	return new Promise((resolve, reject) => {
		if (method === 'DELETE' && options.headers) {
			delete options.headers['Content-Encoding'];
		}
		const req = httpModule.request(options, resp => {
			let body = '';
			resp.setEncoding('utf8');
			resp.on('data', chunk => {
				body += chunk;
			});
			resp.on('end', () => {
				if (resp.statusCode >= 400) {
					reject(
						new Error(`push failed with status ${resp.statusCode}, ${body}`),
					);
				} else {
					resolve({ resp, body });
				}
			});
		});
		req.on('error', err => {
			reject(err);
		});

		req.on('timeout', () => {
			req.destroy(new Error('Pushgateway request timed out'));
		});

		if (method !== 'DELETE') {
			this.registry
				.metrics()
				.then(metrics => {
					if (
						options.headers &&
						options.headers['Content-Encoding'] === 'gzip'
					) {
						metrics = gzipSync(metrics);
					}
					req.write(metrics);
					req.end();
				})
				.catch(err => {
					reject(err);
				});
		} else {
			req.end();
		}
	});
}

function generateGroupings(groupings) {
	if (!groupings) {
		return '';
	}
	return Object.keys(groupings)
		.map(
			key =>
				`/${encodeURIComponent(key)}/${encodeURIComponent(groupings[key])}`,
		)
		.join('');
}

function isHttps(href) {
	return href.search(/^https/) !== -1;
}

var pushgateway = Pushgateway;

var bucketGenerators = {};

bucketGenerators.linearBuckets = (start, width, count) => {
	if (count < 1) {
		throw new Error('Linear buckets needs a positive count');
	}

	const buckets = new Array(count);
	for (let i = 0; i < count; i++) {
		buckets[i] = start + i * width;
	}
	return buckets;
};

bucketGenerators.exponentialBuckets = (start, factor, count) => {
	if (start <= 0) {
		throw new Error('Exponential buckets needs a positive start');
	}
	if (count < 1) {
		throw new Error('Exponential buckets needs a positive count');
	}
	if (factor <= 1) {
		throw new Error('Exponential buckets needs a factor greater than 1');
	}
	const buckets = new Array(count);
	for (let i = 0; i < count; i++) {
		buckets[i] = start;
		start *= factor;
	}
	return buckets;
};

var defaultMetrics = {exports: {}};

var processCpuTotal$1 = {exports: {}};

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** only globals that common to node and browsers are allowed */
// eslint-disable-next-line node/no-unsupported-features/es-builtins
var _globalThis = typeof globalThis === 'object' ? globalThis : global;

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// this is autogenerated file, see scripts/version-update.js
var VERSION = '1.9.0';

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var re = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
/**
 * Create a function to test an API version to see if it is compatible with the provided ownVersion.
 *
 * The returned function has the following semantics:
 * - Exact match is always compatible
 * - Major versions must match exactly
 *    - 1.x package cannot use global 2.x package
 *    - 2.x package cannot use global 1.x package
 * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
 *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
 *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
 * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
 * - Patch and build tag differences are not considered at this time
 *
 * @param ownVersion version which should be checked against
 */
function _makeCompatibilityCheck(ownVersion) {
    var acceptedVersions = new Set([ownVersion]);
    var rejectedVersions = new Set();
    var myVersionMatch = ownVersion.match(re);
    if (!myVersionMatch) {
        // we cannot guarantee compatibility so we always return noop
        return function () { return false; };
    }
    var ownVersionParsed = {
        major: +myVersionMatch[1],
        minor: +myVersionMatch[2],
        patch: +myVersionMatch[3],
        prerelease: myVersionMatch[4],
    };
    // if ownVersion has a prerelease tag, versions must match exactly
    if (ownVersionParsed.prerelease != null) {
        return function isExactmatch(globalVersion) {
            return globalVersion === ownVersion;
        };
    }
    function _reject(v) {
        rejectedVersions.add(v);
        return false;
    }
    function _accept(v) {
        acceptedVersions.add(v);
        return true;
    }
    return function isCompatible(globalVersion) {
        if (acceptedVersions.has(globalVersion)) {
            return true;
        }
        if (rejectedVersions.has(globalVersion)) {
            return false;
        }
        var globalVersionMatch = globalVersion.match(re);
        if (!globalVersionMatch) {
            // cannot parse other version
            // we cannot guarantee compatibility so we always noop
            return _reject(globalVersion);
        }
        var globalVersionParsed = {
            major: +globalVersionMatch[1],
            minor: +globalVersionMatch[2],
            patch: +globalVersionMatch[3],
            prerelease: globalVersionMatch[4],
        };
        // if globalVersion has a prerelease tag, versions must match exactly
        if (globalVersionParsed.prerelease != null) {
            return _reject(globalVersion);
        }
        // major versions must match
        if (ownVersionParsed.major !== globalVersionParsed.major) {
            return _reject(globalVersion);
        }
        if (ownVersionParsed.major === 0) {
            if (ownVersionParsed.minor === globalVersionParsed.minor &&
                ownVersionParsed.patch <= globalVersionParsed.patch) {
                return _accept(globalVersion);
            }
            return _reject(globalVersion);
        }
        if (ownVersionParsed.minor <= globalVersionParsed.minor) {
            return _accept(globalVersion);
        }
        return _reject(globalVersion);
    };
}
/**
 * Test an API version to see if it is compatible with this API.
 *
 * - Exact match is always compatible
 * - Major versions must match exactly
 *    - 1.x package cannot use global 2.x package
 *    - 2.x package cannot use global 1.x package
 * - The minor version of the API module requesting access to the global API must be less than or equal to the minor version of this API
 *    - 1.3 package may use 1.4 global because the later global contains all functions 1.3 expects
 *    - 1.4 package may NOT use 1.3 global because it may try to call functions which don't exist on 1.3
 * - If the major version is 0, the minor version is treated as the major and the patch is treated as the minor
 * - Patch and build tag differences are not considered at this time
 *
 * @param version version of the API requesting an instance of the global API
 */
var isCompatible = _makeCompatibilityCheck(VERSION);

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var major = VERSION.split('.')[0];
var GLOBAL_OPENTELEMETRY_API_KEY = Symbol.for("opentelemetry.js.api." + major);
var _global = _globalThis;
function registerGlobal(type, instance, diag, allowOverride) {
    var _a;
    if (allowOverride === void 0) { allowOverride = false; }
    var api = (_global[GLOBAL_OPENTELEMETRY_API_KEY] = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) !== null && _a !== void 0 ? _a : {
        version: VERSION,
    });
    if (!allowOverride && api[type]) {
        // already registered an API of this type
        var err = new Error("@opentelemetry/api: Attempted duplicate registration of API: " + type);
        diag.error(err.stack || err.message);
        return false;
    }
    if (api.version !== VERSION) {
        // All registered APIs must be of the same version exactly
        var err = new Error("@opentelemetry/api: Registration of version v" + api.version + " for " + type + " does not match previously registered API v" + VERSION);
        diag.error(err.stack || err.message);
        return false;
    }
    api[type] = instance;
    diag.debug("@opentelemetry/api: Registered a global for " + type + " v" + VERSION + ".");
    return true;
}
function getGlobal(type) {
    var _a, _b;
    var globalVersion = (_a = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _a === void 0 ? void 0 : _a.version;
    if (!globalVersion || !isCompatible(globalVersion)) {
        return;
    }
    return (_b = _global[GLOBAL_OPENTELEMETRY_API_KEY]) === null || _b === void 0 ? void 0 : _b[type];
}
function unregisterGlobal(type, diag) {
    diag.debug("@opentelemetry/api: Unregistering a global for " + type + " v" + VERSION + ".");
    var api = _global[GLOBAL_OPENTELEMETRY_API_KEY];
    if (api) {
        delete api[type];
    }
}

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __read$4 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray$3 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
/**
 * Component Logger which is meant to be used as part of any component which
 * will add automatically additional namespace in front of the log message.
 * It will then forward all message to global diag logger
 * @example
 * const cLogger = diag.createComponentLogger({ namespace: '@opentelemetry/instrumentation-http' });
 * cLogger.debug('test');
 * // @opentelemetry/instrumentation-http test
 */
var DiagComponentLogger = /** @class */ (function () {
    function DiagComponentLogger(props) {
        this._namespace = props.namespace || 'DiagComponentLogger';
    }
    DiagComponentLogger.prototype.debug = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('debug', this._namespace, args);
    };
    DiagComponentLogger.prototype.error = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('error', this._namespace, args);
    };
    DiagComponentLogger.prototype.info = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('info', this._namespace, args);
    };
    DiagComponentLogger.prototype.warn = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('warn', this._namespace, args);
    };
    DiagComponentLogger.prototype.verbose = function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        return logProxy('verbose', this._namespace, args);
    };
    return DiagComponentLogger;
}());
function logProxy(funcName, namespace, args) {
    var logger = getGlobal('diag');
    // shortcut if logger not set
    if (!logger) {
        return;
    }
    args.unshift(namespace);
    return logger[funcName].apply(logger, __spreadArray$3([], __read$4(args), false));
}

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Defines the available internal logging levels for the diagnostic logger, the numeric values
 * of the levels are defined to match the original values from the initial LogLevel to avoid
 * compatibility/migration issues for any implementation that assume the numeric ordering.
 */
var DiagLogLevel;
(function (DiagLogLevel) {
    /** Diagnostic Logging level setting to disable all logging (except and forced logs) */
    DiagLogLevel[DiagLogLevel["NONE"] = 0] = "NONE";
    /** Identifies an error scenario */
    DiagLogLevel[DiagLogLevel["ERROR"] = 30] = "ERROR";
    /** Identifies a warning scenario */
    DiagLogLevel[DiagLogLevel["WARN"] = 50] = "WARN";
    /** General informational log message */
    DiagLogLevel[DiagLogLevel["INFO"] = 60] = "INFO";
    /** General debug log message */
    DiagLogLevel[DiagLogLevel["DEBUG"] = 70] = "DEBUG";
    /**
     * Detailed trace level logging should only be used for development, should only be set
     * in a development environment.
     */
    DiagLogLevel[DiagLogLevel["VERBOSE"] = 80] = "VERBOSE";
    /** Used to set the logging level to include all logging */
    DiagLogLevel[DiagLogLevel["ALL"] = 9999] = "ALL";
})(DiagLogLevel || (DiagLogLevel = {}));

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function createLogLevelDiagLogger(maxLevel, logger) {
    if (maxLevel < DiagLogLevel.NONE) {
        maxLevel = DiagLogLevel.NONE;
    }
    else if (maxLevel > DiagLogLevel.ALL) {
        maxLevel = DiagLogLevel.ALL;
    }
    // In case the logger is null or undefined
    logger = logger || {};
    function _filterFunc(funcName, theLevel) {
        var theFunc = logger[funcName];
        if (typeof theFunc === 'function' && maxLevel >= theLevel) {
            return theFunc.bind(logger);
        }
        return function () { };
    }
    return {
        error: _filterFunc('error', DiagLogLevel.ERROR),
        warn: _filterFunc('warn', DiagLogLevel.WARN),
        info: _filterFunc('info', DiagLogLevel.INFO),
        debug: _filterFunc('debug', DiagLogLevel.DEBUG),
        verbose: _filterFunc('verbose', DiagLogLevel.VERBOSE),
    };
}

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __read$3 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray$2 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME$4 = 'diag';
/**
 * Singleton object which represents the entry point to the OpenTelemetry internal
 * diagnostic API
 */
var DiagAPI = /** @class */ (function () {
    /**
     * Private internal constructor
     * @private
     */
    function DiagAPI() {
        function _logProxy(funcName) {
            return function () {
                var args = [];
                for (var _i = 0; _i < arguments.length; _i++) {
                    args[_i] = arguments[_i];
                }
                var logger = getGlobal('diag');
                // shortcut if logger not set
                if (!logger)
                    return;
                return logger[funcName].apply(logger, __spreadArray$2([], __read$3(args), false));
            };
        }
        // Using self local variable for minification purposes as 'this' cannot be minified
        var self = this;
        // DiagAPI specific functions
        var setLogger = function (logger, optionsOrLogLevel) {
            var _a, _b, _c;
            if (optionsOrLogLevel === void 0) { optionsOrLogLevel = { logLevel: DiagLogLevel.INFO }; }
            if (logger === self) {
                // There isn't much we can do here.
                // Logging to the console might break the user application.
                // Try to log to self. If a logger was previously registered it will receive the log.
                var err = new Error('Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation');
                self.error((_a = err.stack) !== null && _a !== void 0 ? _a : err.message);
                return false;
            }
            if (typeof optionsOrLogLevel === 'number') {
                optionsOrLogLevel = {
                    logLevel: optionsOrLogLevel,
                };
            }
            var oldLogger = getGlobal('diag');
            var newLogger = createLogLevelDiagLogger((_b = optionsOrLogLevel.logLevel) !== null && _b !== void 0 ? _b : DiagLogLevel.INFO, logger);
            // There already is an logger registered. We'll let it know before overwriting it.
            if (oldLogger && !optionsOrLogLevel.suppressOverrideMessage) {
                var stack = (_c = new Error().stack) !== null && _c !== void 0 ? _c : '<failed to generate stacktrace>';
                oldLogger.warn("Current logger will be overwritten from " + stack);
                newLogger.warn("Current logger will overwrite one already registered from " + stack);
            }
            return registerGlobal('diag', newLogger, self, true);
        };
        self.setLogger = setLogger;
        self.disable = function () {
            unregisterGlobal(API_NAME$4, self);
        };
        self.createComponentLogger = function (options) {
            return new DiagComponentLogger(options);
        };
        self.verbose = _logProxy('verbose');
        self.debug = _logProxy('debug');
        self.info = _logProxy('info');
        self.warn = _logProxy('warn');
        self.error = _logProxy('error');
    }
    /** Get the singleton instance of the DiagAPI API */
    DiagAPI.instance = function () {
        if (!this._instance) {
            this._instance = new DiagAPI();
        }
        return this._instance;
    };
    return DiagAPI;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __read$2 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __values = (undefined && undefined.__values) || function(o) {
    var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
    if (m) return m.call(o);
    if (o && typeof o.length === "number") return {
        next: function () {
            if (o && i >= o.length) o = void 0;
            return { value: o && o[i++], done: !o };
        }
    };
    throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
};
var BaggageImpl = /** @class */ (function () {
    function BaggageImpl(entries) {
        this._entries = entries ? new Map(entries) : new Map();
    }
    BaggageImpl.prototype.getEntry = function (key) {
        var entry = this._entries.get(key);
        if (!entry) {
            return undefined;
        }
        return Object.assign({}, entry);
    };
    BaggageImpl.prototype.getAllEntries = function () {
        return Array.from(this._entries.entries()).map(function (_a) {
            var _b = __read$2(_a, 2), k = _b[0], v = _b[1];
            return [k, v];
        });
    };
    BaggageImpl.prototype.setEntry = function (key, entry) {
        var newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.set(key, entry);
        return newBaggage;
    };
    BaggageImpl.prototype.removeEntry = function (key) {
        var newBaggage = new BaggageImpl(this._entries);
        newBaggage._entries.delete(key);
        return newBaggage;
    };
    BaggageImpl.prototype.removeEntries = function () {
        var e_1, _a;
        var keys = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            keys[_i] = arguments[_i];
        }
        var newBaggage = new BaggageImpl(this._entries);
        try {
            for (var keys_1 = __values(keys), keys_1_1 = keys_1.next(); !keys_1_1.done; keys_1_1 = keys_1.next()) {
                var key = keys_1_1.value;
                newBaggage._entries.delete(key);
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (keys_1_1 && !keys_1_1.done && (_a = keys_1.return)) _a.call(keys_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return newBaggage;
    };
    BaggageImpl.prototype.clear = function () {
        return new BaggageImpl();
    };
    return BaggageImpl;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
DiagAPI.instance();
/**
 * Create a new Baggage with optional entries
 *
 * @param entries An array of baggage entries the new baggage should contain
 */
function createBaggage(entries) {
    if (entries === void 0) { entries = {}; }
    return new BaggageImpl(new Map(Object.entries(entries)));
}

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/** Get a key to uniquely identify a context value */
function createContextKey(description) {
    // The specification states that for the same input, multiple calls should
    // return different keys. Due to the nature of the JS dependency management
    // system, this creates problems where multiple versions of some package
    // could hold different keys for the same property.
    //
    // Therefore, we use Symbol.for which returns the same key for the same input.
    return Symbol.for(description);
}
var BaseContext = /** @class */ (function () {
    /**
     * Construct a new context which inherits values from an optional parent context.
     *
     * @param parentContext a context from which to inherit values
     */
    function BaseContext(parentContext) {
        // for minification
        var self = this;
        self._currentContext = parentContext ? new Map(parentContext) : new Map();
        self.getValue = function (key) { return self._currentContext.get(key); };
        self.setValue = function (key, value) {
            var context = new BaseContext(self._currentContext);
            context._currentContext.set(key, value);
            return context;
        };
        self.deleteValue = function (key) {
            var context = new BaseContext(self._currentContext);
            context._currentContext.delete(key);
            return context;
        };
    }
    return BaseContext;
}());
/** The root context is used as the default parent context when there is no active context */
var ROOT_CONTEXT = new BaseContext();

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __extends = (undefined && undefined.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
/**
 * NoopMeter is a noop implementation of the {@link Meter} interface. It reuses
 * constant NoopMetrics for all of its methods.
 */
var NoopMeter = /** @class */ (function () {
    function NoopMeter() {
    }
    /**
     * @see {@link Meter.createGauge}
     */
    NoopMeter.prototype.createGauge = function (_name, _options) {
        return NOOP_GAUGE_METRIC;
    };
    /**
     * @see {@link Meter.createHistogram}
     */
    NoopMeter.prototype.createHistogram = function (_name, _options) {
        return NOOP_HISTOGRAM_METRIC;
    };
    /**
     * @see {@link Meter.createCounter}
     */
    NoopMeter.prototype.createCounter = function (_name, _options) {
        return NOOP_COUNTER_METRIC;
    };
    /**
     * @see {@link Meter.createUpDownCounter}
     */
    NoopMeter.prototype.createUpDownCounter = function (_name, _options) {
        return NOOP_UP_DOWN_COUNTER_METRIC;
    };
    /**
     * @see {@link Meter.createObservableGauge}
     */
    NoopMeter.prototype.createObservableGauge = function (_name, _options) {
        return NOOP_OBSERVABLE_GAUGE_METRIC;
    };
    /**
     * @see {@link Meter.createObservableCounter}
     */
    NoopMeter.prototype.createObservableCounter = function (_name, _options) {
        return NOOP_OBSERVABLE_COUNTER_METRIC;
    };
    /**
     * @see {@link Meter.createObservableUpDownCounter}
     */
    NoopMeter.prototype.createObservableUpDownCounter = function (_name, _options) {
        return NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC;
    };
    /**
     * @see {@link Meter.addBatchObservableCallback}
     */
    NoopMeter.prototype.addBatchObservableCallback = function (_callback, _observables) { };
    /**
     * @see {@link Meter.removeBatchObservableCallback}
     */
    NoopMeter.prototype.removeBatchObservableCallback = function (_callback) { };
    return NoopMeter;
}());
var NoopMetric = /** @class */ (function () {
    function NoopMetric() {
    }
    return NoopMetric;
}());
var NoopCounterMetric = /** @class */ (function (_super) {
    __extends(NoopCounterMetric, _super);
    function NoopCounterMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopCounterMetric.prototype.add = function (_value, _attributes) { };
    return NoopCounterMetric;
}(NoopMetric));
var NoopUpDownCounterMetric = /** @class */ (function (_super) {
    __extends(NoopUpDownCounterMetric, _super);
    function NoopUpDownCounterMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopUpDownCounterMetric.prototype.add = function (_value, _attributes) { };
    return NoopUpDownCounterMetric;
}(NoopMetric));
var NoopGaugeMetric = /** @class */ (function (_super) {
    __extends(NoopGaugeMetric, _super);
    function NoopGaugeMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopGaugeMetric.prototype.record = function (_value, _attributes) { };
    return NoopGaugeMetric;
}(NoopMetric));
var NoopHistogramMetric = /** @class */ (function (_super) {
    __extends(NoopHistogramMetric, _super);
    function NoopHistogramMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    NoopHistogramMetric.prototype.record = function (_value, _attributes) { };
    return NoopHistogramMetric;
}(NoopMetric));
var NoopObservableMetric = /** @class */ (function () {
    function NoopObservableMetric() {
    }
    NoopObservableMetric.prototype.addCallback = function (_callback) { };
    NoopObservableMetric.prototype.removeCallback = function (_callback) { };
    return NoopObservableMetric;
}());
var NoopObservableCounterMetric = /** @class */ (function (_super) {
    __extends(NoopObservableCounterMetric, _super);
    function NoopObservableCounterMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoopObservableCounterMetric;
}(NoopObservableMetric));
var NoopObservableGaugeMetric = /** @class */ (function (_super) {
    __extends(NoopObservableGaugeMetric, _super);
    function NoopObservableGaugeMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoopObservableGaugeMetric;
}(NoopObservableMetric));
var NoopObservableUpDownCounterMetric = /** @class */ (function (_super) {
    __extends(NoopObservableUpDownCounterMetric, _super);
    function NoopObservableUpDownCounterMetric() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    return NoopObservableUpDownCounterMetric;
}(NoopObservableMetric));
var NOOP_METER = new NoopMeter();
// Synchronous instruments
var NOOP_COUNTER_METRIC = new NoopCounterMetric();
var NOOP_GAUGE_METRIC = new NoopGaugeMetric();
var NOOP_HISTOGRAM_METRIC = new NoopHistogramMetric();
var NOOP_UP_DOWN_COUNTER_METRIC = new NoopUpDownCounterMetric();
// Asynchronous instruments
var NOOP_OBSERVABLE_COUNTER_METRIC = new NoopObservableCounterMetric();
var NOOP_OBSERVABLE_GAUGE_METRIC = new NoopObservableGaugeMetric();
var NOOP_OBSERVABLE_UP_DOWN_COUNTER_METRIC = new NoopObservableUpDownCounterMetric();

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var defaultTextMapGetter = {
    get: function (carrier, key) {
        if (carrier == null) {
            return undefined;
        }
        return carrier[key];
    },
    keys: function (carrier) {
        if (carrier == null) {
            return [];
        }
        return Object.keys(carrier);
    },
};
var defaultTextMapSetter = {
    set: function (carrier, key, value) {
        if (carrier == null) {
            return;
        }
        carrier[key] = value;
    },
};

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __read$1 = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray$1 = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var NoopContextManager = /** @class */ (function () {
    function NoopContextManager() {
    }
    NoopContextManager.prototype.active = function () {
        return ROOT_CONTEXT;
    };
    NoopContextManager.prototype.with = function (_context, fn, thisArg) {
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return fn.call.apply(fn, __spreadArray$1([thisArg], __read$1(args), false));
    };
    NoopContextManager.prototype.bind = function (_context, target) {
        return target;
    };
    NoopContextManager.prototype.enable = function () {
        return this;
    };
    NoopContextManager.prototype.disable = function () {
        return this;
    };
    return NoopContextManager;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __read = (undefined && undefined.__read) || function (o, n) {
    var m = typeof Symbol === "function" && o[Symbol.iterator];
    if (!m) return o;
    var i = m.call(o), r, ar = [], e;
    try {
        while ((n === void 0 || n-- > 0) && !(r = i.next()).done) ar.push(r.value);
    }
    catch (error) { e = { error: error }; }
    finally {
        try {
            if (r && !r.done && (m = i["return"])) m.call(i);
        }
        finally { if (e) throw e.error; }
    }
    return ar;
};
var __spreadArray = (undefined && undefined.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var API_NAME$3 = 'context';
var NOOP_CONTEXT_MANAGER = new NoopContextManager();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Context API
 */
var ContextAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function ContextAPI() {
    }
    /** Get the singleton instance of the Context API */
    ContextAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new ContextAPI();
        }
        return this._instance;
    };
    /**
     * Set the current context manager.
     *
     * @returns true if the context manager was successfully registered, else false
     */
    ContextAPI.prototype.setGlobalContextManager = function (contextManager) {
        return registerGlobal(API_NAME$3, contextManager, DiagAPI.instance());
    };
    /**
     * Get the currently active context
     */
    ContextAPI.prototype.active = function () {
        return this._getContextManager().active();
    };
    /**
     * Execute a function with an active context
     *
     * @param context context to be active during function execution
     * @param fn function to execute in a context
     * @param thisArg optional receiver to be used for calling fn
     * @param args optional arguments forwarded to fn
     */
    ContextAPI.prototype.with = function (context, fn, thisArg) {
        var _a;
        var args = [];
        for (var _i = 3; _i < arguments.length; _i++) {
            args[_i - 3] = arguments[_i];
        }
        return (_a = this._getContextManager()).with.apply(_a, __spreadArray([context, fn, thisArg], __read(args), false));
    };
    /**
     * Bind a context to a target function or event emitter
     *
     * @param context context to bind to the event emitter or function. Defaults to the currently active context
     * @param target function or event emitter to bind
     */
    ContextAPI.prototype.bind = function (context, target) {
        return this._getContextManager().bind(context, target);
    };
    ContextAPI.prototype._getContextManager = function () {
        return getGlobal(API_NAME$3) || NOOP_CONTEXT_MANAGER;
    };
    /** Disable and remove the global context manager */
    ContextAPI.prototype.disable = function () {
        this._getContextManager().disable();
        unregisterGlobal(API_NAME$3, DiagAPI.instance());
    };
    return ContextAPI;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var TraceFlags;
(function (TraceFlags) {
    /** Represents no flag set. */
    TraceFlags[TraceFlags["NONE"] = 0] = "NONE";
    /** Bit to represent whether trace is sampled in trace flags. */
    TraceFlags[TraceFlags["SAMPLED"] = 1] = "SAMPLED";
})(TraceFlags || (TraceFlags = {}));

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var INVALID_SPANID = '0000000000000000';
var INVALID_TRACEID = '00000000000000000000000000000000';
var INVALID_SPAN_CONTEXT = {
    traceId: INVALID_TRACEID,
    spanId: INVALID_SPANID,
    traceFlags: TraceFlags.NONE,
};

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * The NonRecordingSpan is the default {@link Span} that is used when no Span
 * implementation is available. All operations are no-op including context
 * propagation.
 */
var NonRecordingSpan = /** @class */ (function () {
    function NonRecordingSpan(_spanContext) {
        if (_spanContext === void 0) { _spanContext = INVALID_SPAN_CONTEXT; }
        this._spanContext = _spanContext;
    }
    // Returns a SpanContext.
    NonRecordingSpan.prototype.spanContext = function () {
        return this._spanContext;
    };
    // By default does nothing
    NonRecordingSpan.prototype.setAttribute = function (_key, _value) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.setAttributes = function (_attributes) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.addEvent = function (_name, _attributes) {
        return this;
    };
    NonRecordingSpan.prototype.addLink = function (_link) {
        return this;
    };
    NonRecordingSpan.prototype.addLinks = function (_links) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.setStatus = function (_status) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.updateName = function (_name) {
        return this;
    };
    // By default does nothing
    NonRecordingSpan.prototype.end = function (_endTime) { };
    // isRecording always returns false for NonRecordingSpan.
    NonRecordingSpan.prototype.isRecording = function () {
        return false;
    };
    // By default does nothing
    NonRecordingSpan.prototype.recordException = function (_exception, _time) { };
    return NonRecordingSpan;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * span key
 */
var SPAN_KEY = createContextKey('OpenTelemetry Context Key SPAN');
/**
 * Return the span if one exists
 *
 * @param context context to get span from
 */
function getSpan(context) {
    return context.getValue(SPAN_KEY) || undefined;
}
/**
 * Gets the span from the current context, if one exists.
 */
function getActiveSpan() {
    return getSpan(ContextAPI.getInstance().active());
}
/**
 * Set the span on a context
 *
 * @param context context to use as parent
 * @param span span to set active
 */
function setSpan(context, span) {
    return context.setValue(SPAN_KEY, span);
}
/**
 * Remove current span stored in the context
 *
 * @param context context to delete span from
 */
function deleteSpan(context) {
    return context.deleteValue(SPAN_KEY);
}
/**
 * Wrap span context in a NoopSpan and set as span in a new
 * context
 *
 * @param context context to set active span on
 * @param spanContext span context to be wrapped
 */
function setSpanContext(context, spanContext) {
    return setSpan(context, new NonRecordingSpan(spanContext));
}
/**
 * Get the span context of the span if it exists.
 *
 * @param context context to get values from
 */
function getSpanContext(context) {
    var _a;
    return (_a = getSpan(context)) === null || _a === void 0 ? void 0 : _a.spanContext();
}

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var VALID_TRACEID_REGEX = /^([0-9a-f]{32})$/i;
var VALID_SPANID_REGEX = /^[0-9a-f]{16}$/i;
function isValidTraceId(traceId) {
    return VALID_TRACEID_REGEX.test(traceId) && traceId !== INVALID_TRACEID;
}
function isValidSpanId(spanId) {
    return VALID_SPANID_REGEX.test(spanId) && spanId !== INVALID_SPANID;
}
/**
 * Returns true if this {@link SpanContext} is valid.
 * @return true if this {@link SpanContext} is valid.
 */
function isSpanContextValid(spanContext) {
    return (isValidTraceId(spanContext.traceId) && isValidSpanId(spanContext.spanId));
}
/**
 * Wrap the given {@link SpanContext} in a new non-recording {@link Span}
 *
 * @param spanContext span context to be wrapped
 * @returns a new non-recording {@link Span} with the provided context
 */
function wrapSpanContext(spanContext) {
    return new NonRecordingSpan(spanContext);
}

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var contextApi = ContextAPI.getInstance();
/**
 * No-op implementations of {@link Tracer}.
 */
var NoopTracer = /** @class */ (function () {
    function NoopTracer() {
    }
    // startSpan starts a noop span.
    NoopTracer.prototype.startSpan = function (name, options, context) {
        if (context === void 0) { context = contextApi.active(); }
        var root = Boolean(options === null || options === void 0 ? void 0 : options.root);
        if (root) {
            return new NonRecordingSpan();
        }
        var parentFromContext = context && getSpanContext(context);
        if (isSpanContext(parentFromContext) &&
            isSpanContextValid(parentFromContext)) {
            return new NonRecordingSpan(parentFromContext);
        }
        else {
            return new NonRecordingSpan();
        }
    };
    NoopTracer.prototype.startActiveSpan = function (name, arg2, arg3, arg4) {
        var opts;
        var ctx;
        var fn;
        if (arguments.length < 2) {
            return;
        }
        else if (arguments.length === 2) {
            fn = arg2;
        }
        else if (arguments.length === 3) {
            opts = arg2;
            fn = arg3;
        }
        else {
            opts = arg2;
            ctx = arg3;
            fn = arg4;
        }
        var parentContext = ctx !== null && ctx !== void 0 ? ctx : contextApi.active();
        var span = this.startSpan(name, opts, parentContext);
        var contextWithSpanSet = setSpan(parentContext, span);
        return contextApi.with(contextWithSpanSet, fn, undefined, span);
    };
    return NoopTracer;
}());
function isSpanContext(spanContext) {
    return (typeof spanContext === 'object' &&
        typeof spanContext['spanId'] === 'string' &&
        typeof spanContext['traceId'] === 'string' &&
        typeof spanContext['traceFlags'] === 'number');
}

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var NOOP_TRACER = new NoopTracer();
/**
 * Proxy tracer provided by the proxy tracer provider
 */
var ProxyTracer = /** @class */ (function () {
    function ProxyTracer(_provider, name, version, options) {
        this._provider = _provider;
        this.name = name;
        this.version = version;
        this.options = options;
    }
    ProxyTracer.prototype.startSpan = function (name, options, context) {
        return this._getTracer().startSpan(name, options, context);
    };
    ProxyTracer.prototype.startActiveSpan = function (_name, _options, _context, _fn) {
        var tracer = this._getTracer();
        return Reflect.apply(tracer.startActiveSpan, tracer, arguments);
    };
    /**
     * Try to get a tracer from the proxy tracer provider.
     * If the proxy tracer provider has no delegate, return a noop tracer.
     */
    ProxyTracer.prototype._getTracer = function () {
        if (this._delegate) {
            return this._delegate;
        }
        var tracer = this._provider.getDelegateTracer(this.name, this.version, this.options);
        if (!tracer) {
            return NOOP_TRACER;
        }
        this._delegate = tracer;
        return this._delegate;
    };
    return ProxyTracer;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An implementation of the {@link TracerProvider} which returns an impotent
 * Tracer for all calls to `getTracer`.
 *
 * All operations are no-op.
 */
var NoopTracerProvider = /** @class */ (function () {
    function NoopTracerProvider() {
    }
    NoopTracerProvider.prototype.getTracer = function (_name, _version, _options) {
        return new NoopTracer();
    };
    return NoopTracerProvider;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var NOOP_TRACER_PROVIDER = new NoopTracerProvider();
/**
 * Tracer provider which provides {@link ProxyTracer}s.
 *
 * Before a delegate is set, tracers provided are NoOp.
 *   When a delegate is set, traces are provided from the delegate.
 *   When a delegate is set after tracers have already been provided,
 *   all tracers already provided will use the provided delegate implementation.
 */
var ProxyTracerProvider = /** @class */ (function () {
    function ProxyTracerProvider() {
    }
    /**
     * Get a {@link ProxyTracer}
     */
    ProxyTracerProvider.prototype.getTracer = function (name, version, options) {
        var _a;
        return ((_a = this.getDelegateTracer(name, version, options)) !== null && _a !== void 0 ? _a : new ProxyTracer(this, name, version, options));
    };
    ProxyTracerProvider.prototype.getDelegate = function () {
        var _a;
        return (_a = this._delegate) !== null && _a !== void 0 ? _a : NOOP_TRACER_PROVIDER;
    };
    /**
     * Set the delegate tracer provider
     */
    ProxyTracerProvider.prototype.setDelegate = function (delegate) {
        this._delegate = delegate;
    };
    ProxyTracerProvider.prototype.getDelegateTracer = function (name, version, options) {
        var _a;
        return (_a = this._delegate) === null || _a === void 0 ? void 0 : _a.getTracer(name, version, options);
    };
    return ProxyTracerProvider;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Split module-level variable definition into separate files to allow
// tree-shaking on each api instance.
/** Entrypoint for context API */
var context = ContextAPI.getInstance();

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Split module-level variable definition into separate files to allow
// tree-shaking on each api instance.
/**
 * Entrypoint for Diag API.
 * Defines Diagnostic handler used for internal diagnostic logging operations.
 * The default provides a Noop DiagLogger implementation which may be changed via the
 * diag.setLogger(logger: DiagLogger) function.
 */
DiagAPI.instance();

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * An implementation of the {@link MeterProvider} which returns an impotent Meter
 * for all calls to `getMeter`
 */
var NoopMeterProvider = /** @class */ (function () {
    function NoopMeterProvider() {
    }
    NoopMeterProvider.prototype.getMeter = function (_name, _version, _options) {
        return NOOP_METER;
    };
    return NoopMeterProvider;
}());
var NOOP_METER_PROVIDER = new NoopMeterProvider();

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var API_NAME$2 = 'metrics';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Metrics API
 */
var MetricsAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function MetricsAPI() {
    }
    /** Get the singleton instance of the Metrics API */
    MetricsAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new MetricsAPI();
        }
        return this._instance;
    };
    /**
     * Set the current global meter provider.
     * Returns true if the meter provider was successfully registered, else false.
     */
    MetricsAPI.prototype.setGlobalMeterProvider = function (provider) {
        return registerGlobal(API_NAME$2, provider, DiagAPI.instance());
    };
    /**
     * Returns the global meter provider.
     */
    MetricsAPI.prototype.getMeterProvider = function () {
        return getGlobal(API_NAME$2) || NOOP_METER_PROVIDER;
    };
    /**
     * Returns a meter from the global meter provider.
     */
    MetricsAPI.prototype.getMeter = function (name, version, options) {
        return this.getMeterProvider().getMeter(name, version, options);
    };
    /** Remove the global meter provider */
    MetricsAPI.prototype.disable = function () {
        unregisterGlobal(API_NAME$2, DiagAPI.instance());
    };
    return MetricsAPI;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Split module-level variable definition into separate files to allow
// tree-shaking on each api instance.
/** Entrypoint for metrics API */
MetricsAPI.getInstance();

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * No-op implementations of {@link TextMapPropagator}.
 */
var NoopTextMapPropagator = /** @class */ (function () {
    function NoopTextMapPropagator() {
    }
    /** Noop inject function does nothing */
    NoopTextMapPropagator.prototype.inject = function (_context, _carrier) { };
    /** Noop extract function does nothing and returns the input context */
    NoopTextMapPropagator.prototype.extract = function (context, _carrier) {
        return context;
    };
    NoopTextMapPropagator.prototype.fields = function () {
        return [];
    };
    return NoopTextMapPropagator;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Baggage key
 */
var BAGGAGE_KEY = createContextKey('OpenTelemetry Baggage Key');
/**
 * Retrieve the current baggage from the given context
 *
 * @param {Context} Context that manage all context values
 * @returns {Baggage} Extracted baggage from the context
 */
function getBaggage(context) {
    return context.getValue(BAGGAGE_KEY) || undefined;
}
/**
 * Retrieve the current baggage from the active/current context
 *
 * @returns {Baggage} Extracted baggage from the context
 */
function getActiveBaggage() {
    return getBaggage(ContextAPI.getInstance().active());
}
/**
 * Store a baggage in the given context
 *
 * @param {Context} Context that manage all context values
 * @param {Baggage} baggage that will be set in the actual context
 */
function setBaggage(context, baggage) {
    return context.setValue(BAGGAGE_KEY, baggage);
}
/**
 * Delete the baggage stored in the given context
 *
 * @param {Context} Context that manage all context values
 */
function deleteBaggage(context) {
    return context.deleteValue(BAGGAGE_KEY);
}

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var API_NAME$1 = 'propagation';
var NOOP_TEXT_MAP_PROPAGATOR = new NoopTextMapPropagator();
/**
 * Singleton object which represents the entry point to the OpenTelemetry Propagation API
 */
var PropagationAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function PropagationAPI() {
        this.createBaggage = createBaggage;
        this.getBaggage = getBaggage;
        this.getActiveBaggage = getActiveBaggage;
        this.setBaggage = setBaggage;
        this.deleteBaggage = deleteBaggage;
    }
    /** Get the singleton instance of the Propagator API */
    PropagationAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new PropagationAPI();
        }
        return this._instance;
    };
    /**
     * Set the current propagator.
     *
     * @returns true if the propagator was successfully registered, else false
     */
    PropagationAPI.prototype.setGlobalPropagator = function (propagator) {
        return registerGlobal(API_NAME$1, propagator, DiagAPI.instance());
    };
    /**
     * Inject context into a carrier to be propagated inter-process
     *
     * @param context Context carrying tracing data to inject
     * @param carrier carrier to inject context into
     * @param setter Function used to set values on the carrier
     */
    PropagationAPI.prototype.inject = function (context, carrier, setter) {
        if (setter === void 0) { setter = defaultTextMapSetter; }
        return this._getGlobalPropagator().inject(context, carrier, setter);
    };
    /**
     * Extract context from a carrier
     *
     * @param context Context which the newly created context will inherit from
     * @param carrier Carrier to extract context from
     * @param getter Function used to extract keys from a carrier
     */
    PropagationAPI.prototype.extract = function (context, carrier, getter) {
        if (getter === void 0) { getter = defaultTextMapGetter; }
        return this._getGlobalPropagator().extract(context, carrier, getter);
    };
    /**
     * Return a list of all fields which may be used by the propagator.
     */
    PropagationAPI.prototype.fields = function () {
        return this._getGlobalPropagator().fields();
    };
    /** Remove the global propagator */
    PropagationAPI.prototype.disable = function () {
        unregisterGlobal(API_NAME$1, DiagAPI.instance());
    };
    PropagationAPI.prototype._getGlobalPropagator = function () {
        return getGlobal(API_NAME$1) || NOOP_TEXT_MAP_PROPAGATOR;
    };
    return PropagationAPI;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Split module-level variable definition into separate files to allow
// tree-shaking on each api instance.
/** Entrypoint for propagation API */
PropagationAPI.getInstance();

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var API_NAME = 'trace';
/**
 * Singleton object which represents the entry point to the OpenTelemetry Tracing API
 */
var TraceAPI = /** @class */ (function () {
    /** Empty private constructor prevents end users from constructing a new instance of the API */
    function TraceAPI() {
        this._proxyTracerProvider = new ProxyTracerProvider();
        this.wrapSpanContext = wrapSpanContext;
        this.isSpanContextValid = isSpanContextValid;
        this.deleteSpan = deleteSpan;
        this.getSpan = getSpan;
        this.getActiveSpan = getActiveSpan;
        this.getSpanContext = getSpanContext;
        this.setSpan = setSpan;
        this.setSpanContext = setSpanContext;
    }
    /** Get the singleton instance of the Trace API */
    TraceAPI.getInstance = function () {
        if (!this._instance) {
            this._instance = new TraceAPI();
        }
        return this._instance;
    };
    /**
     * Set the current global tracer.
     *
     * @returns true if the tracer provider was successfully registered, else false
     */
    TraceAPI.prototype.setGlobalTracerProvider = function (provider) {
        var success = registerGlobal(API_NAME, this._proxyTracerProvider, DiagAPI.instance());
        if (success) {
            this._proxyTracerProvider.setDelegate(provider);
        }
        return success;
    };
    /**
     * Returns the global tracer provider.
     */
    TraceAPI.prototype.getTracerProvider = function () {
        return getGlobal(API_NAME) || this._proxyTracerProvider;
    };
    /**
     * Returns a tracer from the global tracer provider.
     */
    TraceAPI.prototype.getTracer = function (name, version) {
        return this.getTracerProvider().getTracer(name, version);
    };
    /** Remove the global tracer provider */
    TraceAPI.prototype.disable = function () {
        unregisterGlobal(API_NAME, DiagAPI.instance());
        this._proxyTracerProvider = new ProxyTracerProvider();
    };
    return TraceAPI;
}());

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
// Split module-level variable definition into separate files to allow
// tree-shaking on each api instance.
/** Entrypoint for trace API */
var trace = TraceAPI.getInstance();

/*
 * Copyright The OpenTelemetry Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const esm = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  get DiagLogLevel () { return DiagLogLevel; },
  INVALID_SPANID: INVALID_SPANID,
  INVALID_SPAN_CONTEXT: INVALID_SPAN_CONTEXT,
  INVALID_TRACEID: INVALID_TRACEID,
  ProxyTracer: ProxyTracer,
  ProxyTracerProvider: ProxyTracerProvider,
  ROOT_CONTEXT: ROOT_CONTEXT,
  get TraceFlags () { return TraceFlags; },
  context: context,
  createContextKey: createContextKey,
  defaultTextMapGetter: defaultTextMapGetter,
  defaultTextMapSetter: defaultTextMapSetter,
  isSpanContextValid: isSpanContextValid,
  isValidSpanId: isValidSpanId,
  isValidTraceId: isValidTraceId,
  trace: trace
}, Symbol.toStringTag, { value: 'Module' }));

const OtelApi = esm;
const Counter = counter;

const PROCESS_CPU_USER_SECONDS = 'process_cpu_user_seconds_total';
const PROCESS_CPU_SYSTEM_SECONDS = 'process_cpu_system_seconds_total';
const PROCESS_CPU_SECONDS = 'process_cpu_seconds_total';

processCpuTotal$1.exports = (registry, config = {}) => {
	const registers = registry ? [registry] : undefined;
	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const exemplars = config.enableExemplars ? config.enableExemplars : false;
	const labelNames = Object.keys(labels);

	let lastCpuUsage = process.cpuUsage();

	const cpuUserUsageCounter = new Counter({
		name: namePrefix + PROCESS_CPU_USER_SECONDS,
		help: 'Total user CPU time spent in seconds.',
		enableExemplars: exemplars,
		registers,
		labelNames,
		// Use this one metric's `collect` to set all metrics' values.
		collect() {
			const cpuUsage = process.cpuUsage();

			const userUsageMicros = cpuUsage.user - lastCpuUsage.user;
			const systemUsageMicros = cpuUsage.system - lastCpuUsage.system;

			lastCpuUsage = cpuUsage;

			if (this.enableExemplars) {
				let exemplarLabels = {};
				const currentSpan = OtelApi.trace.getSpan(OtelApi.context.active());
				if (currentSpan) {
					exemplarLabels = {
						traceId: currentSpan.spanContext().traceId,
						spanId: currentSpan.spanContext().spanId,
					};
				}
				cpuUserUsageCounter.inc({
					labels,
					value: userUsageMicros / 1e6,
					exemplarLabels,
				});
				cpuSystemUsageCounter.inc({
					labels,
					value: systemUsageMicros / 1e6,
					exemplarLabels,
				});
				cpuUsageCounter.inc({
					labels,
					value: (userUsageMicros + systemUsageMicros) / 1e6,
					exemplarLabels,
				});
			} else {
				cpuUserUsageCounter.inc(labels, userUsageMicros / 1e6);
				cpuSystemUsageCounter.inc(labels, systemUsageMicros / 1e6);
				cpuUsageCounter.inc(
					labels,
					(userUsageMicros + systemUsageMicros) / 1e6,
				);
			}
		},
	});
	const cpuSystemUsageCounter = new Counter({
		name: namePrefix + PROCESS_CPU_SYSTEM_SECONDS,
		help: 'Total system CPU time spent in seconds.',
		enableExemplars: exemplars,
		registers,
		labelNames,
	});
	const cpuUsageCounter = new Counter({
		name: namePrefix + PROCESS_CPU_SECONDS,
		help: 'Total user and system CPU time spent in seconds.',
		enableExemplars: exemplars,
		registers,
		labelNames,
	});
};

processCpuTotal$1.exports.metricNames = [
	PROCESS_CPU_USER_SECONDS,
	PROCESS_CPU_SYSTEM_SECONDS,
	PROCESS_CPU_SECONDS,
];

var processCpuTotalExports = processCpuTotal$1.exports;

var processStartTime$1 = {exports: {}};

const Gauge$b = gauge;
const startInSeconds = Math.round(Date.now() / 1000 - process.uptime());

const PROCESS_START_TIME = 'process_start_time_seconds';

processStartTime$1.exports = (registry, config = {}) => {
	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	new Gauge$b({
		name: namePrefix + PROCESS_START_TIME,
		help: 'Start time of the process since unix epoch in seconds.',
		registers: registry ? [registry] : undefined,
		labelNames,
		aggregator: 'omit',
		collect() {
			this.set(labels, startInSeconds);
		},
	});
};

processStartTime$1.exports.metricNames = [PROCESS_START_TIME];

var processStartTimeExports = processStartTime$1.exports;

var osMemoryHeap$1 = {exports: {}};

var osMemoryHeapLinux = {exports: {}};

const require$$1$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_fs);

const Gauge$a = gauge;
const fs$2 = require$$1$1;

const values = ['VmSize', 'VmRSS', 'VmData'];

const PROCESS_RESIDENT_MEMORY$1 = 'process_resident_memory_bytes';
const PROCESS_VIRTUAL_MEMORY = 'process_virtual_memory_bytes';
const PROCESS_HEAP = 'process_heap_bytes';

function structureOutput(input) {
	return input.split('\n').reduce((acc, string) => {
		if (!values.some(value => string.startsWith(value))) {
			return acc;
		}

		const split = string.split(':');

		// Get the value
		let value = split[1].trim();
		// Remove trailing ` kb`
		value = value.substr(0, value.length - 3);
		// Make it into a number in bytes bytes
		value = Number(value) * 1024;

		acc[split[0]] = value;

		return acc;
	}, {});
}

osMemoryHeapLinux.exports = (registry, config = {}) => {
	const registers = registry ? [registry] : undefined;
	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	const residentMemGauge = new Gauge$a({
		name: namePrefix + PROCESS_RESIDENT_MEMORY$1,
		help: 'Resident memory size in bytes.',
		registers,
		labelNames,
		// Use this one metric's `collect` to set all metrics' values.
		collect() {
			try {
				// Sync I/O is often problematic, but /proc isn't really I/O, it
				// a virtual filesystem that maps directly to in-kernel data
				// structures and never blocks.
				//
				// Node.js/libuv do this already for process.memoryUsage(), see:
				// - https://github.com/libuv/libuv/blob/a629688008694ed8022269e66826d4d6ec688b83/src/unix/linux-core.c#L506-L523
				const stat = fs$2.readFileSync('/proc/self/status', 'utf8');
				const structuredOutput = structureOutput(stat);

				residentMemGauge.set(labels, structuredOutput.VmRSS);
				virtualMemGauge.set(labels, structuredOutput.VmSize);
				heapSizeMemGauge.set(labels, structuredOutput.VmData);
			} catch {
				// noop
			}
		},
	});
	const virtualMemGauge = new Gauge$a({
		name: namePrefix + PROCESS_VIRTUAL_MEMORY,
		help: 'Virtual memory size in bytes.',
		registers,
		labelNames,
	});
	const heapSizeMemGauge = new Gauge$a({
		name: namePrefix + PROCESS_HEAP,
		help: 'Process heap size in bytes.',
		registers,
		labelNames,
	});
};

osMemoryHeapLinux.exports.metricNames = [
	PROCESS_RESIDENT_MEMORY$1,
	PROCESS_VIRTUAL_MEMORY,
	PROCESS_HEAP,
];

var osMemoryHeapLinuxExports = osMemoryHeapLinux.exports;

// process.memoryUsage() can throw on some platforms, see #67
function safeMemoryUsage$2() {
	try {
		return process.memoryUsage();
	} catch {
		return;
	}
}

var safeMemoryUsage_1 = safeMemoryUsage$2;

const Gauge$9 = gauge;
const linuxVariant = osMemoryHeapLinuxExports;
const safeMemoryUsage$1 = safeMemoryUsage_1;

const PROCESS_RESIDENT_MEMORY = 'process_resident_memory_bytes';

function notLinuxVariant(registry, config = {}) {
	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	new Gauge$9({
		name: namePrefix + PROCESS_RESIDENT_MEMORY,
		help: 'Resident memory size in bytes.',
		registers: registry ? [registry] : undefined,
		labelNames,
		collect() {
			const memUsage = safeMemoryUsage$1();

			// I don't think the other things returned from `process.memoryUsage()` is relevant to a standard export
			if (memUsage) {
				this.set(labels, memUsage.rss);
			}
		},
	});
}

osMemoryHeap$1.exports = (registry, config) =>
	process.platform === 'linux'
		? linuxVariant(registry, config)
		: notLinuxVariant(registry, config);

osMemoryHeap$1.exports.metricNames =
	process.platform === 'linux'
		? linuxVariant.metricNames
		: [PROCESS_RESIDENT_MEMORY];

var osMemoryHeapExports = osMemoryHeap$1.exports;

var processOpenFileDescriptors$1 = {exports: {}};

const require$$2 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_process);

const Gauge$8 = gauge;
const fs$1 = require$$1$1;
const process$1 = require$$2;

const PROCESS_OPEN_FDS = 'process_open_fds';

processOpenFileDescriptors$1.exports = (registry, config = {}) => {
	if (process$1.platform !== 'linux') {
		return;
	}

	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	new Gauge$8({
		name: namePrefix + PROCESS_OPEN_FDS,
		help: 'Number of open file descriptors.',
		registers: registry ? [registry] : undefined,
		labelNames,
		collect() {
			try {
				const fds = fs$1.readdirSync('/proc/self/fd');
				// Minus 1 to not count the fd that was used by readdirSync(),
				// it's now closed.
				this.set(labels, fds.length - 1);
			} catch {
				// noop
			}
		},
	});
};

processOpenFileDescriptors$1.exports.metricNames = [PROCESS_OPEN_FDS];

var processOpenFileDescriptorsExports = processOpenFileDescriptors$1.exports;

var processMaxFileDescriptors$1 = {exports: {}};

const Gauge$7 = gauge;
const fs = require$$1$1;

const PROCESS_MAX_FDS = 'process_max_fds';

let maxFds;

processMaxFileDescriptors$1.exports = (registry, config = {}) => {
	if (maxFds === undefined) {
		// This will fail if a linux-like procfs is not available.
		try {
			const limits = fs.readFileSync('/proc/self/limits', 'utf8');
			const lines = limits.split('\n');
			for (const line of lines) {
				if (line.startsWith('Max open files')) {
					const parts = line.split(/  +/);
					maxFds = Number(parts[1]);
					break;
				}
			}
		} catch {
			return;
		}
	}

	if (maxFds === undefined) return;

	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	new Gauge$7({
		name: namePrefix + PROCESS_MAX_FDS,
		help: 'Maximum number of open file descriptors.',
		registers: registry ? [registry] : undefined,
		labelNames,
		collect() {
			if (maxFds !== undefined) this.set(labels, maxFds);
		},
	});
};

processMaxFileDescriptors$1.exports.metricNames = [PROCESS_MAX_FDS];

var processMaxFileDescriptorsExports = processMaxFileDescriptors$1.exports;

var eventLoopLag$1 = {exports: {}};

const Gauge$6 = gauge;

// Check if perf_hooks module is available
let perf_hooks$1;
try {
	perf_hooks$1 = require('perf_hooks');
} catch {
	// node version is too old
}

// Reported always.
const NODEJS_EVENTLOOP_LAG = 'nodejs_eventloop_lag_seconds';

// Reported only when perf_hooks is available.
const NODEJS_EVENTLOOP_LAG_MIN = 'nodejs_eventloop_lag_min_seconds';
const NODEJS_EVENTLOOP_LAG_MAX = 'nodejs_eventloop_lag_max_seconds';
const NODEJS_EVENTLOOP_LAG_MEAN = 'nodejs_eventloop_lag_mean_seconds';
const NODEJS_EVENTLOOP_LAG_STDDEV = 'nodejs_eventloop_lag_stddev_seconds';
const NODEJS_EVENTLOOP_LAG_P50 = 'nodejs_eventloop_lag_p50_seconds';
const NODEJS_EVENTLOOP_LAG_P90 = 'nodejs_eventloop_lag_p90_seconds';
const NODEJS_EVENTLOOP_LAG_P99 = 'nodejs_eventloop_lag_p99_seconds';

function reportEventloopLag(start, gauge, labels) {
	const delta = process.hrtime(start);
	const nanosec = delta[0] * 1e9 + delta[1];
	const seconds = nanosec / 1e9;

	gauge.set(labels, seconds);
}

eventLoopLag$1.exports = (registry, config = {}) => {
	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);
	const registers = registry ? [registry] : undefined;

	let collect = () => {
		const start = process.hrtime();
		setImmediate(reportEventloopLag, start, lag, labels);
	};

	if (perf_hooks$1 && perf_hooks$1.monitorEventLoopDelay) {
		try {
			const histogram = perf_hooks$1.monitorEventLoopDelay({
				resolution: config.eventLoopMonitoringPrecision,
			});
			histogram.enable();

			collect = () => {
				const start = process.hrtime();
				setImmediate(reportEventloopLag, start, lag, labels);

				lagMin.set(labels, histogram.min / 1e9);
				lagMax.set(labels, histogram.max / 1e9);
				lagMean.set(labels, histogram.mean / 1e9);
				lagStddev.set(labels, histogram.stddev / 1e9);
				lagP50.set(labels, histogram.percentile(50) / 1e9);
				lagP90.set(labels, histogram.percentile(90) / 1e9);
				lagP99.set(labels, histogram.percentile(99) / 1e9);

				histogram.reset();
			};
		} catch (e) {
			if (e.code === 'ERR_NOT_IMPLEMENTED') {
				return; // Bun
			}

			throw e;
		}
	}

	const lag = new Gauge$6({
		name: namePrefix + NODEJS_EVENTLOOP_LAG,
		help: 'Lag of event loop in seconds.',
		registers,
		labelNames,
		aggregator: 'average',
		// Use this one metric's `collect` to set all metrics' values.
		collect,
	});
	const lagMin = new Gauge$6({
		name: namePrefix + NODEJS_EVENTLOOP_LAG_MIN,
		help: 'The minimum recorded event loop delay.',
		registers,
		labelNames,
		aggregator: 'min',
	});
	const lagMax = new Gauge$6({
		name: namePrefix + NODEJS_EVENTLOOP_LAG_MAX,
		help: 'The maximum recorded event loop delay.',
		registers,
		labelNames,
		aggregator: 'max',
	});
	const lagMean = new Gauge$6({
		name: namePrefix + NODEJS_EVENTLOOP_LAG_MEAN,
		help: 'The mean of the recorded event loop delays.',
		registers,
		labelNames,
		aggregator: 'average',
	});
	const lagStddev = new Gauge$6({
		name: namePrefix + NODEJS_EVENTLOOP_LAG_STDDEV,
		help: 'The standard deviation of the recorded event loop delays.',
		registers,
		labelNames,
		aggregator: 'average',
	});
	const lagP50 = new Gauge$6({
		name: namePrefix + NODEJS_EVENTLOOP_LAG_P50,
		help: 'The 50th percentile of the recorded event loop delays.',
		registers,
		labelNames,
		aggregator: 'average',
	});
	const lagP90 = new Gauge$6({
		name: namePrefix + NODEJS_EVENTLOOP_LAG_P90,
		help: 'The 90th percentile of the recorded event loop delays.',
		registers,
		labelNames,
		aggregator: 'average',
	});
	const lagP99 = new Gauge$6({
		name: namePrefix + NODEJS_EVENTLOOP_LAG_P99,
		help: 'The 99th percentile of the recorded event loop delays.',
		registers,
		labelNames,
		aggregator: 'average',
	});
};

eventLoopLag$1.exports.metricNames = [
	NODEJS_EVENTLOOP_LAG,
	NODEJS_EVENTLOOP_LAG_MIN,
	NODEJS_EVENTLOOP_LAG_MAX,
	NODEJS_EVENTLOOP_LAG_MEAN,
	NODEJS_EVENTLOOP_LAG_STDDEV,
	NODEJS_EVENTLOOP_LAG_P50,
	NODEJS_EVENTLOOP_LAG_P90,
	NODEJS_EVENTLOOP_LAG_P99,
];

var eventLoopLagExports = eventLoopLag$1.exports;

var processHandles$1 = {exports: {}};

function aggregateByObjectName$2(list) {
	const data = {};

	for (let i = 0; i < list.length; i++) {
		const listElement = list[i];

		if (!listElement || typeof listElement.constructor === 'undefined') {
			continue;
		}

		if (Object.hasOwnProperty.call(data, listElement.constructor.name)) {
			data[listElement.constructor.name] += 1;
		} else {
			data[listElement.constructor.name] = 1;
		}
	}
	return data;
}

function updateMetrics$3(gauge, data, labels) {
	gauge.reset();
	for (const key in data) {
		gauge.set(Object.assign({ type: key }, labels || {}), data[key]);
	}
}

var processMetricsHelpers = {
	aggregateByObjectName: aggregateByObjectName$2,
	updateMetrics: updateMetrics$3,
};

const { aggregateByObjectName: aggregateByObjectName$1 } = processMetricsHelpers;
const { updateMetrics: updateMetrics$2 } = processMetricsHelpers;
const Gauge$5 = gauge;

const NODEJS_ACTIVE_HANDLES = 'nodejs_active_handles';
const NODEJS_ACTIVE_HANDLES_TOTAL = 'nodejs_active_handles_total';

processHandles$1.exports = (registry, config = {}) => {
	// Don't do anything if the function is removed in later nodes (exists in node@6-12...)
	if (typeof process._getActiveHandles !== 'function') {
		return;
	}

	const registers = registry ? [registry] : undefined;
	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	new Gauge$5({
		name: namePrefix + NODEJS_ACTIVE_HANDLES,
		help: 'Number of active libuv handles grouped by handle type. Every handle type is C++ class name.',
		labelNames: ['type', ...labelNames],
		registers,
		collect() {
			const handles = process._getActiveHandles();
			updateMetrics$2(this, aggregateByObjectName$1(handles), labels);
		},
	});
	new Gauge$5({
		name: namePrefix + NODEJS_ACTIVE_HANDLES_TOTAL,
		help: 'Total number of active handles.',
		registers,
		labelNames,
		collect() {
			const handles = process._getActiveHandles();
			this.set(labels, handles.length);
		},
	});
};

processHandles$1.exports.metricNames = [
	NODEJS_ACTIVE_HANDLES,
	NODEJS_ACTIVE_HANDLES_TOTAL,
];

var processHandlesExports = processHandles$1.exports;

var processRequests$1 = {exports: {}};

const Gauge$4 = gauge;
const { aggregateByObjectName } = processMetricsHelpers;
const { updateMetrics: updateMetrics$1 } = processMetricsHelpers;

const NODEJS_ACTIVE_REQUESTS = 'nodejs_active_requests';
const NODEJS_ACTIVE_REQUESTS_TOTAL = 'nodejs_active_requests_total';

processRequests$1.exports = (registry, config = {}) => {
	// Don't do anything if the function is removed in later nodes (exists in node@6)
	if (typeof process._getActiveRequests !== 'function') {
		return;
	}

	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	new Gauge$4({
		name: namePrefix + NODEJS_ACTIVE_REQUESTS,
		help: 'Number of active libuv requests grouped by request type. Every request type is C++ class name.',
		labelNames: ['type', ...labelNames],
		registers: registry ? [registry] : undefined,
		collect() {
			const requests = process._getActiveRequests();
			updateMetrics$1(this, aggregateByObjectName(requests), labels);
		},
	});

	new Gauge$4({
		name: namePrefix + NODEJS_ACTIVE_REQUESTS_TOTAL,
		help: 'Total number of active requests.',
		registers: registry ? [registry] : undefined,
		labelNames,
		collect() {
			const requests = process._getActiveRequests();
			this.set(labels, requests.length);
		},
	});
};

processRequests$1.exports.metricNames = [
	NODEJS_ACTIVE_REQUESTS,
	NODEJS_ACTIVE_REQUESTS_TOTAL,
];

var processRequestsExports = processRequests$1.exports;

var processResources$1 = {exports: {}};

const Gauge$3 = gauge;
const { updateMetrics } = processMetricsHelpers;

const NODEJS_ACTIVE_RESOURCES = 'nodejs_active_resources';
const NODEJS_ACTIVE_RESOURCES_TOTAL = 'nodejs_active_resources_total';

processResources$1.exports = (registry, config = {}) => {
	// Don't do anything if the function does not exist in previous nodes (exists in node@17.3.0)
	if (typeof process.getActiveResourcesInfo !== 'function') {
		return;
	}

	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	new Gauge$3({
		name: namePrefix + NODEJS_ACTIVE_RESOURCES,
		help: 'Number of active resources that are currently keeping the event loop alive, grouped by async resource type.',
		labelNames: ['type', ...labelNames],
		registers: registry ? [registry] : undefined,
		collect() {
			const resources = process.getActiveResourcesInfo();

			const data = {};

			for (let i = 0; i < resources.length; i++) {
				const resource = resources[i];

				if (Object.hasOwn(data, resource)) {
					data[resource] += 1;
				} else {
					data[resource] = 1;
				}
			}

			updateMetrics(this, data, labels);
		},
	});

	new Gauge$3({
		name: namePrefix + NODEJS_ACTIVE_RESOURCES_TOTAL,
		help: 'Total number of active resources.',
		registers: registry ? [registry] : undefined,
		labelNames,
		collect() {
			const resources = process.getActiveResourcesInfo();
			this.set(labels, resources.length);
		},
	});
};

processResources$1.exports.metricNames = [
	NODEJS_ACTIVE_RESOURCES,
	NODEJS_ACTIVE_RESOURCES_TOTAL,
];

var processResourcesExports = processResources$1.exports;

var heapSizeAndUsed$1 = {exports: {}};

const Gauge$2 = gauge;
const safeMemoryUsage = safeMemoryUsage_1;

const NODEJS_HEAP_SIZE_TOTAL = 'nodejs_heap_size_total_bytes';
const NODEJS_HEAP_SIZE_USED = 'nodejs_heap_size_used_bytes';
const NODEJS_EXTERNAL_MEMORY = 'nodejs_external_memory_bytes';

heapSizeAndUsed$1.exports = (registry, config = {}) => {
	if (typeof process.memoryUsage !== 'function') {
		return;
	}
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	const registers = registry ? [registry] : undefined;
	const namePrefix = config.prefix ? config.prefix : '';
	const collect = () => {
		const memUsage = safeMemoryUsage();
		if (memUsage) {
			heapSizeTotal.set(labels, memUsage.heapTotal);
			heapSizeUsed.set(labels, memUsage.heapUsed);
			if (memUsage.external !== undefined) {
				externalMemUsed.set(labels, memUsage.external);
			}
		}
	};

	const heapSizeTotal = new Gauge$2({
		name: namePrefix + NODEJS_HEAP_SIZE_TOTAL,
		help: 'Process heap size from Node.js in bytes.',
		registers,
		labelNames,
		// Use this one metric's `collect` to set all metrics' values.
		collect,
	});
	const heapSizeUsed = new Gauge$2({
		name: namePrefix + NODEJS_HEAP_SIZE_USED,
		help: 'Process heap size used from Node.js in bytes.',
		registers,
		labelNames,
	});
	const externalMemUsed = new Gauge$2({
		name: namePrefix + NODEJS_EXTERNAL_MEMORY,
		help: 'Node.js external memory size in bytes.',
		registers,
		labelNames,
	});
};

heapSizeAndUsed$1.exports.metricNames = [
	NODEJS_HEAP_SIZE_TOTAL,
	NODEJS_HEAP_SIZE_USED,
	NODEJS_EXTERNAL_MEMORY,
];

var heapSizeAndUsedExports = heapSizeAndUsed$1.exports;

var heapSpacesSizeAndUsed$1 = {exports: {}};

const require$$1 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_v8);

const Gauge$1 = gauge;
const v8 = require$$1;

const METRICS = ['total', 'used', 'available'];
const NODEJS_HEAP_SIZE = {};

METRICS.forEach(metricType => {
	NODEJS_HEAP_SIZE[metricType] = `nodejs_heap_space_size_${metricType}_bytes`;
});

heapSpacesSizeAndUsed$1.exports = (registry, config = {}) => {
	try {
		v8.getHeapSpaceStatistics();
	} catch (e) {
		if (e.code === 'ERR_NOT_IMPLEMENTED') {
			return; // Bun
		}
		throw e;
	}
	const registers = registry ? [registry] : undefined;
	const namePrefix = config.prefix ? config.prefix : '';

	const labels = config.labels ? config.labels : {};
	const labelNames = ['space', ...Object.keys(labels)];

	const gauges = {};

	METRICS.forEach(metricType => {
		gauges[metricType] = new Gauge$1({
			name: namePrefix + NODEJS_HEAP_SIZE[metricType],
			help: `Process heap space size ${metricType} from Node.js in bytes.`,
			labelNames,
			registers,
		});
	});

	// Use this one metric's `collect` to set all metrics' values.
	gauges.total.collect = () => {
		for (const space of v8.getHeapSpaceStatistics()) {
			const spaceName = space.space_name.substr(
				0,
				space.space_name.indexOf('_space'),
			);

			gauges.total.set({ space: spaceName, ...labels }, space.space_size);
			gauges.used.set({ space: spaceName, ...labels }, space.space_used_size);
			gauges.available.set(
				{ space: spaceName, ...labels },
				space.space_available_size,
			);
		}
	};
};

heapSpacesSizeAndUsed$1.exports.metricNames = Object.values(NODEJS_HEAP_SIZE);

var heapSpacesSizeAndUsedExports = heapSpacesSizeAndUsed$1.exports;

var version$2 = {exports: {}};

const Gauge = gauge;
const version$1 = process.version;
const versionSegments = version$1.slice(1).split('.').map(Number);

const NODE_VERSION_INFO = 'nodejs_version_info';

version$2.exports = (registry, config = {}) => {
	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);

	new Gauge({
		name: namePrefix + NODE_VERSION_INFO,
		help: 'Node.js version info.',
		labelNames: ['version', 'major', 'minor', 'patch', ...labelNames],
		registers: registry ? [registry] : undefined,
		aggregator: 'first',
		collect() {
			// Needs to be in collect() so value is present even if reg is reset
			this.labels(
				version$1,
				versionSegments[0],
				versionSegments[1],
				versionSegments[2],
				...Object.values(labels),
			).set(1);
		},
	});
};

version$2.exports.metricNames = [NODE_VERSION_INFO];

var versionExports = version$2.exports;

var gc$1 = {exports: {}};

const Histogram = histogram;

let perf_hooks;

try {
	// eslint-disable-next-line
	perf_hooks = require('perf_hooks');
} catch {
	// node version is too old
}

const NODEJS_GC_DURATION_SECONDS = 'nodejs_gc_duration_seconds';
const DEFAULT_GC_DURATION_BUCKETS = [0.001, 0.01, 0.1, 1, 2, 5];

const kinds = [];

if (perf_hooks && perf_hooks.constants) {
	kinds[perf_hooks.constants.NODE_PERFORMANCE_GC_MAJOR] = 'major';
	kinds[perf_hooks.constants.NODE_PERFORMANCE_GC_MINOR] = 'minor';
	kinds[perf_hooks.constants.NODE_PERFORMANCE_GC_INCREMENTAL] = 'incremental';
	kinds[perf_hooks.constants.NODE_PERFORMANCE_GC_WEAKCB] = 'weakcb';
}

gc$1.exports = (registry, config = {}) => {
	if (!perf_hooks) {
		return;
	}

	const namePrefix = config.prefix ? config.prefix : '';
	const labels = config.labels ? config.labels : {};
	const labelNames = Object.keys(labels);
	const buckets = config.gcDurationBuckets
		? config.gcDurationBuckets
		: DEFAULT_GC_DURATION_BUCKETS;
	const gcHistogram = new Histogram({
		name: namePrefix + NODEJS_GC_DURATION_SECONDS,
		help: 'Garbage collection duration by kind, one of major, minor, incremental or weakcb.',
		labelNames: ['kind', ...labelNames],
		enableExemplars: false,
		buckets,
		registers: registry ? [registry] : undefined,
	});

	const obs = new perf_hooks.PerformanceObserver(list => {
		const entry = list.getEntries()[0];
		// Node < 16 uses entry.kind
		// Node >= 16 uses entry.detail.kind
		// See: https://nodejs.org/docs/latest-v16.x/api/deprecations.html#deprecations_dep0152_extension_performanceentry_properties
		const kind = entry.detail ? kinds[entry.detail.kind] : kinds[entry.kind];
		// Convert duration from milliseconds to seconds
		gcHistogram.observe(Object.assign({ kind }, labels), entry.duration / 1000);
	});

	obs.observe({ entryTypes: ['gc'] });
};

gc$1.exports.metricNames = [NODEJS_GC_DURATION_SECONDS];

var gcExports = gc$1.exports;

const { isObject } = util$5;

// Default metrics.
const processCpuTotal = processCpuTotalExports;
const processStartTime = processStartTimeExports;
const osMemoryHeap = osMemoryHeapExports;
const processOpenFileDescriptors = processOpenFileDescriptorsExports;
const processMaxFileDescriptors = processMaxFileDescriptorsExports;
const eventLoopLag = eventLoopLagExports;
const processHandles = processHandlesExports;
const processRequests = processRequestsExports;
const processResources = processResourcesExports;
const heapSizeAndUsed = heapSizeAndUsedExports;
const heapSpacesSizeAndUsed = heapSpacesSizeAndUsedExports;
const version = versionExports;
const gc = gcExports;

const metrics = {
	processCpuTotal,
	processStartTime,
	osMemoryHeap,
	processOpenFileDescriptors,
	processMaxFileDescriptors,
	eventLoopLag,
	...(typeof process.getActiveResourcesInfo === 'function'
		? { processResources }
		: {}),
	processHandles,
	processRequests,
	heapSizeAndUsed,
	heapSpacesSizeAndUsed,
	version,
	gc,
};
const metricsList = Object.keys(metrics);

defaultMetrics.exports = function collectDefaultMetrics(config) {
	if (config !== null && config !== undefined && !isObject(config)) {
		throw new TypeError('config must be null, undefined, or an object');
	}

	config = { eventLoopMonitoringPrecision: 10, ...config };

	for (const metric of Object.values(metrics)) {
		metric(config.register, config);
	}
};

defaultMetrics.exports.metricsList = metricsList;

var defaultMetricsExports = defaultMetrics.exports;

var metricAggregators = {};

const { Grouper: Grouper$1, hashObject } = util$5;

/**
 * Returns a new function that applies the `aggregatorFn` to the values.
 * @param {Function} aggregatorFn function to apply to values.
 * @return {Function} aggregator function
 */
function AggregatorFactory(aggregatorFn) {
	return metrics => {
		if (metrics.length === 0) return;
		const result = {
			help: metrics[0].help,
			name: metrics[0].name,
			type: metrics[0].type,
			values: [],
			aggregator: metrics[0].aggregator,
		};
		// Gather metrics by metricName and labels.
		const byLabels = new Grouper$1();
		metrics.forEach(metric => {
			metric.values.forEach(value => {
				const key = hashObject(value.labels);
				byLabels.add(`${value.metricName}_${key}`, value);
			});
		});
		// Apply aggregator function to gathered metrics.
		byLabels.forEach(values => {
			if (values.length === 0) return;
			const valObj = {
				value: aggregatorFn(values),
				labels: values[0].labels,
			};
			if (values[0].metricName) {
				valObj.metricName = values[0].metricName;
			}
			// NB: Timestamps are omitted.
			result.values.push(valObj);
		});
		return result;
	};
}
// Export for users to define their own aggregation methods.
metricAggregators.AggregatorFactory = AggregatorFactory;

/**
 * Functions that can be used to aggregate metrics from multiple registries.
 */
metricAggregators.aggregators = {
	/**
	 * @return The sum of values.
	 */
	sum: AggregatorFactory(v => v.reduce((p, c) => p + c.value, 0)),
	/**
	 * @return The first value.
	 */
	first: AggregatorFactory(v => v[0].value),
	/**
	 * @return {undefined} Undefined; omits the metric.
	 */
	omit: () => {},
	/**
	 * @return The arithmetic mean of the values.
	 */
	average: AggregatorFactory(
		v => v.reduce((p, c) => p + c.value, 0) / v.length,
	),
	/**
	 * @return The minimum of the values.
	 */
	min: AggregatorFactory(v =>
		v.reduce((p, c) => Math.min(p, c.value), Infinity),
	),
	/**
	 * @return The maximum of the values.
	 */
	max: AggregatorFactory(v =>
		v.reduce((p, c) => Math.max(p, c.value), -Infinity),
	),
};

const require$$3 = /*@__PURE__*/getDefaultExportFromNamespaceIfNotNamed(node_cluster);

/**
 * Extends the Registry class with a `clusterMetrics` method that returns
 * aggregated metrics for all workers.
 *
 * In cluster workers, listens for and responds to requests for metrics by the
 * cluster master.
 */

const Registry = registryExports;
const { Grouper } = util$5;
const { aggregators } = metricAggregators;
// We need to lazy-load the 'cluster' module as some application servers -
// namely Passenger - crash when it is imported.
let cluster = () => {
	const data = require$$3;
	cluster = () => data;
	return data;
};

const GET_METRICS_REQ = 'prom-client:getMetricsReq';
const GET_METRICS_RES = 'prom-client:getMetricsRes';

let registries = [Registry.globalRegistry];
let requestCtr = 0; // Concurrency control
let listenersAdded = false;
const requests = new Map(); // Pending requests for workers' local metrics.

class AggregatorRegistry extends Registry {
	constructor(regContentType = Registry.PROMETHEUS_CONTENT_TYPE) {
		super(regContentType);
		addListeners();
	}

	/**
	 * Gets aggregated metrics for all workers. The optional callback and
	 * returned Promise resolve with the same value; either may be used.
	 * @return {Promise<string>} Promise that resolves with the aggregated
	 *   metrics.
	 */
	clusterMetrics() {
		const requestId = requestCtr++;

		return new Promise((resolve, reject) => {
			let settled = false;
			function done(err, result) {
				if (settled) return;
				settled = true;
				if (err) reject(err);
				else resolve(result);
			}

			const request = {
				responses: [],
				pending: 0,
				done,
				errorTimeout: setTimeout(() => {
					const err = new Error('Operation timed out.');
					request.done(err);
				}, 5000),
			};
			requests.set(requestId, request);

			const message = {
				type: GET_METRICS_REQ,
				requestId,
			};

			for (const id in cluster().workers) {
				// If the worker exits abruptly, it may still be in the workers
				// list but not able to communicate.
				if (cluster().workers[id].isConnected()) {
					cluster().workers[id].send(message);
					request.pending++;
				}
			}

			if (request.pending === 0) {
				// No workers were up
				clearTimeout(request.errorTimeout);
				process.nextTick(() => done(null, ''));
			}
		});
	}

	get contentType() {
		return super.contentType;
	}

	/**
	 * Creates a new Registry instance from an array of metrics that were
	 * created by `registry.getMetricsAsJSON()`. Metrics are aggregated using
	 * the method specified by their `aggregator` property, or by summation if
	 * `aggregator` is undefined.
	 * @param {Array} metricsArr Array of metrics, each of which created by
	 *   `registry.getMetricsAsJSON()`.
	 * @param {string} registryType content type of the new registry. Defaults
	 * to PROMETHEUS_CONTENT_TYPE.
	 * @return {Registry} aggregated registry.
	 */
	static aggregate(
		metricsArr,
		registryType = Registry.PROMETHEUS_CONTENT_TYPE,
	) {
		const aggregatedRegistry = new Registry();
		const metricsByName = new Grouper();

		aggregatedRegistry.setContentType(registryType);

		// Gather by name
		metricsArr.forEach(metrics => {
			metrics.forEach(metric => {
				metricsByName.add(metric.name, metric);
			});
		});

		// Aggregate gathered metrics.
		metricsByName.forEach(metrics => {
			const aggregatorName = metrics[0].aggregator;
			const aggregatorFn = aggregators[aggregatorName];
			if (typeof aggregatorFn !== 'function') {
				throw new Error(`'${aggregatorName}' is not a defined aggregator.`);
			}
			const aggregatedMetric = aggregatorFn(metrics);
			// NB: The 'omit' aggregator returns undefined.
			if (aggregatedMetric) {
				const aggregatedMetricWrapper = Object.assign(
					{
						get: () => aggregatedMetric,
					},
					aggregatedMetric,
				);
				aggregatedRegistry.registerMetric(aggregatedMetricWrapper);
			}
		});

		return aggregatedRegistry;
	}

	/**
	 * Sets the registry or registries to be aggregated. Call from workers to
	 * use a registry/registries other than the default global registry.
	 * @param {Array<Registry>|Registry} regs Registry or registries to be
	 *   aggregated.
	 * @return {void}
	 */
	static setRegistries(regs) {
		if (!Array.isArray(regs)) regs = [regs];
		regs.forEach(reg => {
			if (!(reg instanceof Registry)) {
				throw new TypeError(`Expected Registry, got ${typeof reg}`);
			}
		});
		registries = regs;
	}
}

/**
 * Adds event listeners for cluster aggregation. Idempotent (safe to call more
 * than once).
 * @return {void}
 */
function addListeners() {
	if (listenersAdded) return;
	listenersAdded = true;

	if (cluster().isMaster) {
		// Listen for worker responses to requests for local metrics
		cluster().on('message', (worker, message) => {
			if (message.type === GET_METRICS_RES) {
				const request = requests.get(message.requestId);

				if (message.error) {
					request.done(new Error(message.error));
					return;
				}

				message.metrics.forEach(registry => request.responses.push(registry));
				request.pending--;

				if (request.pending === 0) {
					// finalize
					requests.delete(message.requestId);
					clearTimeout(request.errorTimeout);

					const registry = AggregatorRegistry.aggregate(request.responses);
					const promString = registry.metrics();
					request.done(null, promString);
				}
			}
		});
	}

	if (cluster().isWorker) {
		// Respond to master's requests for worker's local metrics.
		process.on('message', message => {
			if (message.type === GET_METRICS_REQ) {
				Promise.all(registries.map(r => r.getMetricsAsJSON()))
					.then(metrics => {
						process.send({
							type: GET_METRICS_RES,
							requestId: message.requestId,
							metrics,
						});
					})
					.catch(error => {
						process.send({
							type: GET_METRICS_RES,
							requestId: message.requestId,
							error: error.message,
						});
					});
			}
		});
	}
}

var cluster_1 = AggregatorRegistry;

/**
 * Prometheus client
 * @module Prometheus client
 */

(function (exports$1) {

	exports$1.register = registryExports.globalRegistry;
	exports$1.Registry = registryExports;
	Object.defineProperty(exports$1, 'contentType', {
		configurable: false,
		enumerable: true,
		get() {
			return exports$1.register.contentType;
		},
		set(value) {
			exports$1.register.setContentType(value);
		},
	});
	exports$1.prometheusContentType = exports$1.Registry.PROMETHEUS_CONTENT_TYPE;
	exports$1.openMetricsContentType = exports$1.Registry.OPENMETRICS_CONTENT_TYPE;
	exports$1.validateMetricName = validation.validateMetricName;

	exports$1.Counter = counter;
	exports$1.Gauge = gauge;
	exports$1.Histogram = histogram;
	exports$1.Summary = summary;
	exports$1.Pushgateway = pushgateway;

	exports$1.linearBuckets = bucketGenerators.linearBuckets;
	exports$1.exponentialBuckets =
		bucketGenerators.exponentialBuckets;

	exports$1.collectDefaultMetrics = defaultMetricsExports;

	exports$1.aggregators = metricAggregators.aggregators;
	exports$1.AggregatorRegistry = cluster_1; 
} (promClient));

const client = /*@__PURE__*/getDefaultExportFromCjs(promClient);

const register = new client.Registry();
client.collectDefaultMetrics({ register });
const webhookMetrics = {
  processed: new client.Counter({
    name: "webhook_processed_total",
    help: "Total processed webhooks"
  }),
  failed: new client.Counter({
    name: "webhook_failed_total",
    help: "Total failed webhooks"
  }),
  completed: new client.Counter({
    name: "webhook_completed_total",
    help: "Completed jobs"
  })
};
register.registerMetric(webhookMetrics.processed);
register.registerMetric(webhookMetrics.failed);
register.registerMetric(webhookMetrics.completed);

const metrics_get = defineEventHandler(async () => {
  return register.metrics();
});

const metrics_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: metrics_get
}, Symbol.toStringTag, { value: 'Module' }));

function requireScope(auth, scope) {
  if (!auth.scopes.includes(scope) && !auth.scopes.includes("*")) {
    throw new AppError("FORBIDDEN", `Missing required scope: ${scope}`, 403);
  }
}

async function revokeApiKey(params) {
  const existing = await prisma$1.apiKey.findFirst({
    where: {
      id: params.apiKeyId,
      tenantId: params.tenantId,
      revokedAt: null
    }
  });
  if (!existing) {
    throw new AppError("API_KEY_NOT_FOUND", "API key not found", 404);
  }
  return prisma$1.apiKey.update({
    where: { id: existing.id },
    data: {
      revokedAt: /* @__PURE__ */ new Date(),
      status: "DISABLED"
    }
  });
}

const revoke_post = defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "api_keys:manage");
    const id = getRouterParam(event, "id");
    if (!id) {
      setResponseStatus(event, 400);
      return { error: "BAD_REQUEST", message: "Missing API key id" };
    }
    const revoked = await revokeApiKey({
      tenantId: auth.tenantId,
      apiKeyId: id
    });
    return {
      id: revoked.id,
      keyPrefix: revoked.keyPrefix,
      revokedAt: revoked.revokedAt,
      status: revoked.status
    };
  } catch (error) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode);
      return {
        error: error.code,
        message: error.message
      };
    }
    setResponseStatus(event, 400);
    return {
      error: "BAD_REQUEST",
      message: (error == null ? void 0 : error.message) || "Invalid request"
    };
  }
});

const revoke_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: revoke_post
}, Symbol.toStringTag, { value: 'Module' }));

async function createApiKey(params) {
  const tenant = await prisma$1.tenant.findUnique({
    where: { code: params.tenantCode }
  });
  if (!tenant) {
    throw new AppError("TENANT_NOT_FOUND", "Tenant not found", 404);
  }
  const merchant = params.merchantCode ? await prisma$1.merchantAccount.findFirst({
    where: {
      tenantId: tenant.id,
      code: params.merchantCode
    }
  }) : null;
  if (params.merchantCode && !merchant) {
    throw new AppError("MERCHANT_NOT_FOUND", "Merchant not found", 404);
  }
  const keyPrefix = generateKeyPrefix(params.environment || "test");
  const secret = generateApiKeySecret();
  const secretHash = hashApiKeySecret(secret);
  const created = await prisma$1.apiKey.create({
    data: {
      tenantId: tenant.id,
      merchantAccountId: (merchant == null ? void 0 : merchant.id) || null,
      keyPrefix,
      secretHash,
      name: params.name,
      status: "ACTIVE",
      scopes: params.scopes,
      environment: params.environment || "test",
      expiresAt: params.expiresAt || null
    }
  });
  return {
    id: created.id,
    keyPrefix: created.keyPrefix,
    fullKey: buildFullApiKey(keyPrefix, secret),
    environment: created.environment,
    scopes: created.scopes,
    expiresAt: created.expiresAt,
    createdAt: created.createdAt
  };
}

async function rotateApiKey(params) {
  var _a;
  const existing = await prisma$1.apiKey.findFirst({
    where: {
      id: params.apiKeyId,
      tenantId: params.tenantId,
      revokedAt: null
    },
    include: {
      tenant: true,
      merchantAccount: true
    }
  });
  if (!existing) {
    throw new AppError("API_KEY_NOT_FOUND", "API key not found", 404);
  }
  await revokeApiKey({
    tenantId: params.tenantId,
    apiKeyId: params.apiKeyId
  });
  const rotated = await createApiKey({
    tenantCode: existing.tenant.code,
    merchantCode: (_a = existing.merchantAccount) == null ? void 0 : _a.code,
    name: `${existing.name} (rotated)`,
    scopes: existing.scopes,
    environment: existing.environment,
    expiresAt: existing.expiresAt
  });
  return rotated;
}

const rotate_post = defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "api_keys:manage");
    const id = getRouterParam(event, "id");
    if (!id) {
      setResponseStatus(event, 400);
      return { error: "BAD_REQUEST", message: "Missing API key id" };
    }
    const rotated = await rotateApiKey({
      tenantId: auth.tenantId,
      apiKeyId: id
    });
    return rotated;
  } catch (error) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode);
      return {
        error: error.code,
        message: error.message
      };
    }
    setResponseStatus(event, 400);
    return {
      error: "BAD_REQUEST",
      message: (error == null ? void 0 : error.message) || "Invalid request"
    };
  }
});

const rotate_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: rotate_post
}, Symbol.toStringTag, { value: 'Module' }));

async function listApiKeys(params) {
  return prisma$1.apiKey.findMany({
    where: {
      tenantId: params.tenantId,
      ...params.merchantAccountId ? { merchantAccountId: params.merchantAccountId } : {}
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      keyPrefix: true,
      name: true,
      status: true,
      environment: true,
      scopes: true,
      lastUsedAt: true,
      expiresAt: true,
      revokedAt: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

const index_get = defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "api_keys:manage");
    const items = await listApiKeys({
      tenantId: auth.tenantId,
      merchantAccountId: auth.merchantAccountId
    });
    return { items };
  } catch (error) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode);
      return {
        error: error.code,
        message: error.message
      };
    }
    setResponseStatus(event, 400);
    return {
      error: "BAD_REQUEST",
      message: (error == null ? void 0 : error.message) || "Invalid request"
    };
  }
});

const index_get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_get
}, Symbol.toStringTag, { value: 'Module' }));

const schema$1 = z.object({
  name: z.string().min(1),
  scopes: z.array(z.string()).min(1),
  environment: z.enum(["test", "live"]).default("test"),
  expiresAt: z.string().datetime().optional()
});
const index_post$2 = defineEventHandler(async (event) => {
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "api_keys:manage");
    const body = schema$1.parse(await readBody(event));
    const created = await createApiKey({
      tenantCode: auth.tenantCode,
      merchantCode: auth.merchantCode || void 0,
      name: body.name,
      scopes: body.scopes,
      environment: body.environment,
      expiresAt: body.expiresAt ? new Date(body.expiresAt) : null
    });
    return created;
  } catch (error) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode);
      return {
        error: error.code,
        message: error.message
      };
    }
    setResponseStatus(event, 400);
    return {
      error: "BAD_REQUEST",
      message: (error == null ? void 0 : error.message) || "Invalid request"
    };
  }
});

const index_post$3 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post$2
}, Symbol.toStringTag, { value: 'Module' }));

async function getPaymentIntent(auth, publicId) {
  const payment = await prisma$1.paymentIntent.findFirst({
    where: {
      publicId,
      tenantId: auth.tenantId,
      ...auth.merchantAccountId ? { merchantAccountId: auth.merchantAccountId } : {}
    },
    include: {
      events: {
        orderBy: { createdAt: "asc" }
      }
    }
  });
  if (!payment) {
    throw new AppError("PAYMENT_NOT_FOUND", "Payment intent not found", 404);
  }
  return payment;
}

const _publicId__get = defineEventHandler(async (event) => {
  var _a;
  try {
    const auth = await requireApiKeyAuth(event);
    requireScope(auth, "payments:read");
    const publicId = getRouterParam(event, "publicId");
    const payment = await getPaymentIntent(auth, publicId);
    return {
      publicId: payment.publicId,
      status: payment.status,
      amount: payment.amount.toString(),
      currency: payment.currency,
      merchantOrderId: payment.merchantOrderId,
      merchantReference: payment.merchantReference,
      providerReference: payment.providerReference,
      providerTransactionId: payment.providerTransactionId,
      qrPayload: payment.qrPayload,
      deeplinkUrl: payment.deeplinkUrl,
      redirectUrl: payment.redirectUrl,
      expiresAt: ((_a = payment.expiresAt) == null ? void 0 : _a.toISOString()) || null,
      events: payment.events.map((e) => ({
        type: e.type,
        fromStatus: e.fromStatus,
        toStatus: e.toStatus,
        summary: e.summary,
        createdAt: e.createdAt.toISOString()
      }))
    };
  } catch (error) {
    if (error instanceof AppError) {
      setResponseStatus(event, error.statusCode);
      return { error: error.code, message: error.message };
    }
    setResponseStatus(event, 400);
    return { error: "BAD_REQUEST", message: (error == null ? void 0 : error.message) || "Invalid request" };
  }
});

const _publicId__get$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _publicId__get
}, Symbol.toStringTag, { value: 'Module' }));

async function resolvePaymentRoute(params) {
  const route = await prisma$1.paymentRoute.findFirst({
    where: {
      tenantId: params.tenantId,
      paymentMethodType: params.paymentMethodType,
      currency: params.currency,
      status: "ACTIVE"
    },
    include: {
      billerProfile: true
    },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }]
  });
  if (!route) throw new AppError("ROUTE_NOT_FOUND", "No active payment route found", 422);
  if (route.billerProfile.status !== "ACTIVE") throw new AppError("BILLER_INACTIVE", "Resolved biller is inactive", 422);
  return route;
}

const DEFAULT_TTL_MS = 24 * 60 * 60 * 1e3;
const DEFAULT_LOCK_TIMEOUT_MS = 30 * 1e3;
function canonicalize(value) {
  if (value === null) return null;
  if (typeof value === "string" || typeof value === "number" || typeof value === "boolean") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map(canonicalize);
  }
  if (typeof value === "object") {
    const input = value;
    const output = {};
    for (const key of Object.keys(input).sort()) {
      const v = input[key];
      if (typeof v === "undefined") continue;
      output[key] = canonicalize(v);
    }
    return output;
  }
  return String(value);
}
function hashRequestBody(body) {
  const normalized = canonicalize(body);
  const serialized = JSON.stringify(normalized);
  return createHash("sha256").update(serialized).digest("hex");
}
function nowPlus(ms) {
  return new Date(Date.now() + ms);
}
function getRetryAfterSeconds(lockedAt, lockTimeoutMs) {
  const remainingMs = lockedAt.getTime() + lockTimeoutMs - Date.now();
  return Math.max(1, Math.ceil(remainingMs / 1e3));
}
function setIdempotencyStatus(event, status) {
  if (!event) return;
  setResponseHeader(event, "Idempotency-Status", status);
}
async function reserveIdempotency(input) {
  var _a, _b;
  if (!input.key) return null;
  const ttlMs = (_a = input.ttlMs) != null ? _a : DEFAULT_TTL_MS;
  const lockTimeoutMs = (_b = input.lockTimeoutMs) != null ? _b : DEFAULT_LOCK_TIMEOUT_MS;
  const requestHash = hashRequestBody(input.requestBody);
  while (true) {
    const now = /* @__PURE__ */ new Date();
    const existing = await prisma$1.idempotencyKey.findUnique({
      where: {
        tenantId_key: {
          tenantId: input.tenantId,
          key: input.key
        }
      }
    });
    if (!existing) {
      try {
        await prisma$1.idempotencyKey.create({
          data: {
            tenantId: input.tenantId,
            key: input.key,
            requestPath: input.requestPath,
            requestMethod: input.requestMethod.toUpperCase(),
            requestHash,
            lockedAt: now,
            completedAt: null,
            responseStatusCode: null,
            responseBody: Prisma.JsonNull,
            resourceType: null,
            resourceId: null,
            expiresAt: nowPlus(ttlMs)
          }
        });
        setIdempotencyStatus(input.event, "created");
        return {
          key: input.key,
          requestHash,
          status: "STARTED"
        };
      } catch (error) {
        if ((error == null ? void 0 : error.code) === "P2002") {
          continue;
        }
        throw error;
      }
    }
    if (existing.expiresAt && existing.expiresAt.getTime() <= now.getTime()) {
      const reclaimed = await prisma$1.idempotencyKey.updateMany({
        where: {
          tenantId: input.tenantId,
          key: input.key,
          updatedAt: existing.updatedAt
        },
        data: {
          requestPath: input.requestPath,
          requestMethod: input.requestMethod.toUpperCase(),
          requestHash,
          lockedAt: now,
          completedAt: null,
          responseStatusCode: null,
          responseBody: Prisma.JsonNull,
          resourceType: null,
          resourceId: null,
          expiresAt: nowPlus(ttlMs)
        }
      });
      if (reclaimed.count === 1) {
        setIdempotencyStatus(input.event, "created");
        return {
          key: input.key,
          requestHash,
          status: "STARTED"
        };
      }
      continue;
    }
    if (existing.requestHash !== requestHash) {
      setIdempotencyStatus(input.event, "conflict");
      throw new AppError(
        "IDEMPOTENCY_KEY_CONFLICT",
        "Idempotency-Key was already used with a different request payload",
        409
      );
    }
    if (existing.completedAt) {
      setIdempotencyStatus(input.event, "replay");
      return {
        key: existing.key,
        requestHash: existing.requestHash,
        status: "REPLAY",
        responseStatusCode: existing.responseStatusCode,
        responseBody: existing.responseBody,
        resourceType: existing.resourceType,
        resourceId: existing.resourceId
      };
    }
    if (existing.lockedAt) {
      const ageMs = now.getTime() - existing.lockedAt.getTime();
      if (ageMs < lockTimeoutMs) {
        setIdempotencyStatus(input.event, "in_progress");
        throw new AppError(
          "IDEMPOTENCY_IN_PROGRESS",
          "A request with this Idempotency-Key is already in progress",
          409,
          {
            retryAfterSec: getRetryAfterSeconds(
              existing.lockedAt,
              lockTimeoutMs
            )
          }
        );
      }
    }
    const claimed = await prisma$1.idempotencyKey.updateMany({
      where: {
        tenantId: input.tenantId,
        key: input.key,
        updatedAt: existing.updatedAt
      },
      data: {
        lockedAt: now,
        expiresAt: nowPlus(ttlMs)
      }
    });
    if (claimed.count === 1) {
      setIdempotencyStatus(input.event, "created");
      return {
        key: input.key,
        requestHash,
        status: "STARTED"
      };
    }
  }
}
async function completeIdempotency(input) {
  var _a, _b;
  if (!input.key) return;
  await prisma$1.idempotencyKey.update({
    where: {
      tenantId_key: {
        tenantId: input.tenantId,
        key: input.key
      }
    },
    data: {
      completedAt: /* @__PURE__ */ new Date(),
      lockedAt: null,
      expiresAt: nowPlus(DEFAULT_TTL_MS),
      responseStatusCode: input.responseStatusCode,
      responseBody: input.responseBody,
      resourceType: (_a = input.resourceType) != null ? _a : null,
      resourceId: (_b = input.resourceId) != null ? _b : null
    }
  });
}
async function releaseIdempotencyLock(input) {
  if (!input.key) return;
  await prisma$1.idempotencyKey.update({
    where: {
      tenantId_key: {
        tenantId: input.tenantId,
        key: input.key
      }
    },
    data: {
      lockedAt: null
    }
  });
}

async function postJson(url, body, headers = {}) {
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      ...headers
    },
    body: JSON.stringify(body)
  });
  const data = await res.json().catch(() => ({}));
  return { status: res.status, data, headers: res.headers };
}

function mapScbStatusToInternal(status) {
  const v = (status || "").toUpperCase();
  if (["SUCCESS", "PAID", "COMPLETED"].includes(v)) return "SUCCEEDED";
  if (["PENDING", "PROCESSING", "WAITING"].includes(v)) return "PENDING";
  if (["EXPIRED"].includes(v)) return "EXPIRED";
  return "FAILED";
}

function getScbHeaders() {
  return {
    "x-client-id": process.env.SCB_CLIENT_ID || "",
    "x-client-secret": process.env.SCB_CLIENT_SECRET || ""
  };
}
function buildMockQr(publicId, amount) {
  return `00020101021129370016A0000006770101110113${publicId.slice(0, 13)}5303764540${amount}5802TH6304ABCD`;
}
const demoMode = process.env.PAYIQ_PROVIDER_MODE === "mock" || !process.env.SCB_API_BASE_URL || !process.env.SCB_CLIENT_ID || !process.env.SCB_CLIENT_SECRET;
const scbProvider = {
  async createPayment(input) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l, _m, _n, _o;
    if (demoMode) {
      return {
        success: true,
        providerReference: `mock-ref-${input.publicId}`,
        providerTransactionId: `mock-txn-${input.publicId}`,
        qrPayload: buildMockQr(input.publicId, input.amount),
        deeplinkUrl: null,
        redirectUrl: null,
        rawRequest: {
          mode: "mock",
          publicId: input.publicId,
          amount: input.amount
        },
        rawResponse: {
          success: true,
          mode: "mock"
        },
        errorCode: null,
        errorMessage: null
      };
    }
    const url = `${process.env.SCB_API_BASE_URL}/payments/create`;
    const requestBody = {
      partnerPaymentId: input.publicId,
      billerId: input.billerProfile.billerId,
      amount: Number(input.amount),
      currency: input.currency,
      callbackUrl: input.callbackUrl,
      merchantOrderId: input.merchantOrderId || input.publicId
    };
    try {
      const result = await postJson(url, requestBody, getScbHeaders());
      const ok = result.status >= 200 && result.status < 300;
      return {
        success: ok,
        providerReference: ((_b = (_a = result.data) == null ? void 0 : _a.data) == null ? void 0 : _b.transactionId) || ((_c = result.data) == null ? void 0 : _c.transactionId) || null,
        providerTransactionId: ((_e = (_d = result.data) == null ? void 0 : _d.data) == null ? void 0 : _e.transactionId) || ((_f = result.data) == null ? void 0 : _f.transactionId) || null,
        qrPayload: ((_h = (_g = result.data) == null ? void 0 : _g.data) == null ? void 0 : _h.qrRawData) || ((_i = result.data) == null ? void 0 : _i.qrRawData) || null,
        deeplinkUrl: ((_k = (_j = result.data) == null ? void 0 : _j.data) == null ? void 0 : _k.deeplinkUrl) || ((_l = result.data) == null ? void 0 : _l.deeplinkUrl) || null,
        redirectUrl: ((_n = (_m = result.data) == null ? void 0 : _m.data) == null ? void 0 : _n.redirectUrl) || ((_o = result.data) == null ? void 0 : _o.redirectUrl) || null,
        rawRequest: requestBody,
        rawResponse: result.data,
        errorCode: ok ? null : String(result.status),
        errorMessage: ok ? null : "SCB create payment failed"
      };
    } catch (error) {
      return {
        success: false,
        providerReference: null,
        providerTransactionId: null,
        qrPayload: null,
        deeplinkUrl: null,
        redirectUrl: null,
        rawRequest: requestBody,
        rawResponse: {
          error: (error == null ? void 0 : error.message) || "Unknown fetch error"
        },
        errorCode: "FETCH_ERROR",
        errorMessage: (error == null ? void 0 : error.message) || "SCB create payment failed"
      };
    }
  },
  async inquirePayment(input) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _i;
    if (demoMode) {
      return {
        providerReference: input.providerReference || null,
        providerTransactionId: input.providerTransactionId || null,
        status: "SUCCEEDED",
        rawResponse: {
          mode: "mock",
          status: "SUCCESS"
        }
      };
    }
    const url = `${process.env.SCB_API_BASE_URL}/payments/inquiry`;
    const requestBody = {
      transactionId: input.providerTransactionId || input.providerReference,
      billerId: input.billerProfile.billerId
    };
    const result = await postJson(url, requestBody, getScbHeaders());
    return {
      providerReference: ((_b = (_a = result.data) == null ? void 0 : _a.data) == null ? void 0 : _b.transactionId) || ((_c = result.data) == null ? void 0 : _c.transactionId) || input.providerReference || null,
      providerTransactionId: ((_e = (_d = result.data) == null ? void 0 : _d.data) == null ? void 0 : _e.transactionId) || ((_f = result.data) == null ? void 0 : _f.transactionId) || input.providerTransactionId || null,
      status: mapScbStatusToInternal(
        ((_h = (_g = result.data) == null ? void 0 : _g.data) == null ? void 0 : _h.status) || ((_i = result.data) == null ? void 0 : _i.status)
      ),
      rawResponse: result.data
    };
  }
};

function getProviderAdapter(providerCode) {
  switch (providerCode) {
    case "SCB":
      return scbProvider;
    default:
      throw new Error(`Unsupported provider: ${providerCode}`);
  }
}

function toResponse(paymentIntent) {
  var _a;
  return {
    publicId: paymentIntent.publicId,
    status: paymentIntent.status,
    amount: paymentIntent.amount.toString(),
    currency: paymentIntent.currency,
    qrPayload: paymentIntent.qrPayload,
    deeplinkUrl: paymentIntent.deeplinkUrl,
    redirectUrl: paymentIntent.redirectUrl,
    expiresAt: ((_a = paymentIntent.expiresAt) == null ? void 0 : _a.toISOString()) || null
  };
}
async function createPaymentIntent(auth, input, opts) {
  var _a, _b;
  if (!auth.merchantAccountId) {
    throw new AppError(
      "FORBIDDEN",
      "API key is not bound to a merchant account",
      403
    );
  }
  const merchant = await prisma$1.merchantAccount.findFirst({
    where: {
      id: auth.merchantAccountId,
      tenantId: auth.tenantId,
      status: "ACTIVE"
    }
  });
  if (!merchant) {
    throw new AppError(
      "MERCHANT_NOT_FOUND",
      "Merchant not found or inactive",
      404
    );
  }
  const existingMerchantOrder = input.merchantOrderId ? await prisma$1.paymentIntent.findFirst({
    where: {
      tenantId: auth.tenantId,
      merchantAccountId: merchant.id,
      merchantOrderId: input.merchantOrderId
    }
  }) : null;
  if (existingMerchantOrder) {
    return toResponse(existingMerchantOrder);
  }
  const idem = await reserveIdempotency({
    tenantId: auth.tenantId,
    key: opts == null ? void 0 : opts.idempotencyKey,
    requestPath: "/api/v1/payment-intents",
    requestMethod: "POST",
    requestBody: input,
    event: (_a = opts == null ? void 0 : opts.event) != null ? _a : void 0
  });
  if ((idem == null ? void 0 : idem.status) === "REPLAY" && idem.responseBody) {
    return idem.responseBody;
  }
  let created = null;
  try {
    const route = await resolvePaymentRoute({
      tenantId: auth.tenantId,
      paymentMethodType: "PROMPTPAY_QR",
      currency: "THB"
    });
    const publicId = `piq_${nanoid(24)}`;
    const callbackUrl = `${process.env.APP_BASE_URL}/api/v1/providers/scb/callback`;
    const expiresAt = new Date(Date.now() + 15 * 60 * 1e3);
    created = await prisma$1.paymentIntent.create({
      data: {
        tenantId: auth.tenantId,
        merchantAccountId: merchant.id,
        paymentRouteId: route.id,
        billerProfileId: route.billerProfile.id,
        publicId,
        merchantOrderId: input.merchantOrderId,
        merchantReference: input.merchantReference,
        idempotencyKeyValue: (opts == null ? void 0 : opts.idempotencyKey) || null,
        paymentMethodType: "PROMPTPAY_QR",
        providerCode: route.providerCode,
        currency: "THB",
        amount: input.amount,
        feeAmount: "0",
        netAmount: input.amount,
        status: "PENDING_PROVIDER",
        customerName: input.customerName,
        customerEmail: input.customerEmail,
        customerPhone: input.customerPhone,
        metadata: input.metadata,
        expiresAt,
        events: {
          create: [
            {
              type: "PAYMENT_CREATED",
              toStatus: "CREATED",
              summary: "Payment intent created"
            },
            {
              type: "ROUTE_RESOLVED",
              fromStatus: "CREATED",
              toStatus: "ROUTING",
              summary: "Route resolved",
              payload: {
                routeId: route.id,
                billerProfileId: route.billerProfile.id,
                providerCode: route.providerCode
              }
            }
          ]
        }
      }
    });
    const provider = getProviderAdapter(route.providerCode);
    const providerResult = await provider.createPayment({
      paymentIntentId: created.id,
      publicId: created.publicId,
      amount: created.amount.toString(),
      currency: created.currency,
      merchantOrderId: created.merchantOrderId,
      expiresAt: ((_b = created.expiresAt) == null ? void 0 : _b.toISOString()) || null,
      callbackUrl,
      billerProfile: {
        id: route.billerProfile.id,
        providerCode: route.billerProfile.providerCode,
        billerId: route.billerProfile.billerId,
        credentialsEncrypted: route.billerProfile.credentialsEncrypted,
        config: route.billerProfile.config
      }
    });
    await prisma$1.providerAttempt.create({
      data: {
        paymentIntentId: created.id,
        billerProfileId: route.billerProfile.id,
        type: "CREATE_PAYMENT",
        status: providerResult.success ? "SUCCEEDED" : "FAILED",
        requestId: `req_${nanoid(20)}`,
        providerCode: route.providerCode,
        providerEndpoint: "create-payment",
        httpMethod: "POST",
        requestBody: providerResult.rawRequest,
        responseBody: providerResult.rawResponse,
        providerReference: providerResult.providerReference,
        providerTxnId: providerResult.providerTransactionId,
        errorCode: providerResult.errorCode,
        errorMessage: providerResult.errorMessage,
        sentAt: /* @__PURE__ */ new Date(),
        completedAt: /* @__PURE__ */ new Date()
      }
    });
    const updated = await prisma$1.paymentIntent.update({
      where: { id: created.id },
      data: providerResult.success ? {
        status: "AWAITING_CUSTOMER",
        providerReference: providerResult.providerReference,
        providerTransactionId: providerResult.providerTransactionId,
        qrPayload: providerResult.qrPayload,
        deeplinkUrl: providerResult.deeplinkUrl,
        redirectUrl: providerResult.redirectUrl,
        events: {
          create: [
            {
              type: "PROVIDER_ACCEPTED",
              fromStatus: "PENDING_PROVIDER",
              toStatus: "AWAITING_CUSTOMER",
              summary: "Provider created payment successfully"
            }
          ]
        }
      } : {
        status: "FAILED",
        failedAt: /* @__PURE__ */ new Date(),
        events: {
          create: [
            {
              type: "PROVIDER_REJECTED",
              fromStatus: "PENDING_PROVIDER",
              toStatus: "FAILED",
              summary: providerResult.errorMessage || "Provider rejected payment",
              payload: {
                errorCode: providerResult.errorCode
              }
            }
          ]
        }
      }
    });
    const response = toResponse(updated);
    await completeIdempotency({
      tenantId: auth.tenantId,
      key: opts == null ? void 0 : opts.idempotencyKey,
      responseStatusCode: 200,
      responseBody: response,
      resourceType: "PaymentIntent",
      resourceId: updated.id
    });
    return response;
  } catch (error) {
    if (created == null ? void 0 : created.id) {
      try {
        const failed = await prisma$1.paymentIntent.update({
          where: { id: created.id },
          data: {
            status: "FAILED",
            failedAt: /* @__PURE__ */ new Date(),
            events: {
              create: [
                {
                  type: "PAYMENT_INTERNAL_ERROR",
                  fromStatus: "PENDING_PROVIDER",
                  toStatus: "FAILED",
                  summary: "Payment failed due to internal/provider exception",
                  payload: {
                    message: typeof (error == null ? void 0 : error.message) === "string" ? error.message.slice(0, 500) : "unknown"
                  }
                }
              ]
            }
          }
        });
        const failureResponse = toResponse(failed);
        await completeIdempotency({
          tenantId: auth.tenantId,
          key: opts == null ? void 0 : opts.idempotencyKey,
          responseStatusCode: 200,
          responseBody: failureResponse,
          resourceType: "PaymentIntent",
          resourceId: failed.id
        });
      } catch {
      }
    } else {
      try {
        await releaseIdempotencyLock({
          tenantId: auth.tenantId,
          key: opts == null ? void 0 : opts.idempotencyKey
        });
      } catch {
      }
    }
    throw error;
  }
}

async function checkPaymentSpamOrThrow(event, input) {
  var _a, _b, _c, _d, _e;
  const ipHash = getClientIpHash(event);
  const blockedKey = buildTempBlockKey(
    "payment-spam",
    `${input.merchantAccountId}:${ipHash}`
  );
  const blockedTtl = await redis.ttl(blockedKey);
  if (blockedTtl > 0) {
    setResponseHeader(event, "Retry-After", blockedTtl);
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "PAYMENT_SPAM_BLOCKED",
        retryAfterSec: blockedTtl
      }
    });
  }
  const referenceHash = sha256$1(((_a = input.reference) == null ? void 0 : _a.trim()) || "no-ref");
  const amountKey = `${input.amount}:${input.currency}`;
  const duplicateRefKey = buildPaymentSpamKey(
    "dupref",
    input.merchantAccountId,
    referenceHash,
    amountKey
  );
  const velocityKey = buildPaymentSpamKey(
    "velocity",
    input.merchantAccountId,
    ipHash,
    amountKey
  );
  const multi = redis.multi();
  multi.incr(duplicateRefKey);
  multi.expire(
    duplicateRefKey,
    PAYMENT_SPAM_LIMITS.duplicateReference.ttlSec
  );
  multi.incr(velocityKey);
  multi.expire(
    velocityKey,
    PAYMENT_SPAM_LIMITS.amountVelocity.ttlSec
  );
  const results = await multi.exec();
  const duplicateCount = Number((_c = (_b = results == null ? void 0 : results[0]) == null ? void 0 : _b[1]) != null ? _c : 0);
  const velocityCount = Number((_e = (_d = results == null ? void 0 : results[2]) == null ? void 0 : _d[1]) != null ? _e : 0);
  if (duplicateCount > PAYMENT_SPAM_LIMITS.duplicateReference.threshold) {
    await redis.set(
      blockedKey,
      "1",
      "EX",
      PAYMENT_SPAM_LIMITS.duplicateReference.blockSec
    );
    setResponseHeader(
      event,
      "Retry-After",
      PAYMENT_SPAM_LIMITS.duplicateReference.blockSec
    );
    console.warn("[payment-spam]", {
      type: "duplicate-reference",
      merchantAccountId: input.merchantAccountId,
      apiKeyId: input.apiKeyId,
      duplicateCount,
      amount: input.amount,
      currency: input.currency
    });
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "PAYMENT_SPAM_DUPLICATE_REFERENCE",
        retryAfterSec: PAYMENT_SPAM_LIMITS.duplicateReference.blockSec
      }
    });
  }
  if (velocityCount > PAYMENT_SPAM_LIMITS.amountVelocity.threshold) {
    await redis.set(
      blockedKey,
      "1",
      "EX",
      PAYMENT_SPAM_LIMITS.amountVelocity.blockSec
    );
    setResponseHeader(
      event,
      "Retry-After",
      PAYMENT_SPAM_LIMITS.amountVelocity.blockSec
    );
    console.warn("[payment-spam]", {
      type: "amount-velocity",
      merchantAccountId: input.merchantAccountId,
      apiKeyId: input.apiKeyId,
      velocityCount,
      amount: input.amount,
      currency: input.currency
    });
    throw createError({
      statusCode: 429,
      statusMessage: "Too Many Requests",
      data: {
        code: "PAYMENT_SPAM_AMOUNT_VELOCITY",
        retryAfterSec: PAYMENT_SPAM_LIMITS.amountVelocity.blockSec
      }
    });
  }
}

const schema = z.object({
  merchantOrderId: z.string().optional(),
  merchantReference: z.string().optional(),
  amount: z.string().regex(/^\d+(\.\d{1,2})?$/),
  currency: z.literal("THB").default("THB"),
  paymentMethodType: z.literal("PROMPTPAY_QR"),
  customerName: z.string().optional(),
  customerEmail: z.string().optional(),
  customerPhone: z.string().optional(),
  metadata: z.record(z.any()).optional()
});
function getApiKeyId(auth) {
  var _a, _b, _c, _d;
  return (_d = (_c = (_b = auth == null ? void 0 : auth.apiKeyId) != null ? _b : (_a = auth == null ? void 0 : auth.apiKey) == null ? void 0 : _a.id) != null ? _c : auth == null ? void 0 : auth.id) != null ? _d : null;
}
function getMerchantAccountId(auth) {
  var _a, _b, _c, _d, _e;
  return (_e = (_d = (_b = auth == null ? void 0 : auth.merchantAccountId) != null ? _b : (_a = auth == null ? void 0 : auth.merchantAccount) == null ? void 0 : _a.id) != null ? _d : (_c = auth == null ? void 0 : auth.apiKey) == null ? void 0 : _c.merchantAccountId) != null ? _e : null;
}
const index_post = defineEventHandler(async (event) => {
  var _a, _b, _c, _d, _e;
  try {
    const auth = event.context.auth;
    if (!auth) {
      throw createError({
        statusCode: 401,
        statusMessage: "Unauthorized",
        data: { code: "AUTH_CONTEXT_MISSING" }
      });
    }
    requireScope(auth, "payments:create");
    const body = schema.parse(await readBody(event));
    const idempotencyKey = getHeader(event, "idempotency-key");
    const apiKeyId = getApiKeyId(auth);
    const merchantAccountId = getMerchantAccountId(auth);
    if (apiKeyId && merchantAccountId) {
      await checkPaymentSpamOrThrow(event, {
        merchantAccountId,
        apiKeyId,
        amount: body.amount,
        currency: body.currency,
        reference: (_c = (_b = (_a = body.merchantReference) != null ? _a : body.merchantOrderId) != null ? _b : idempotencyKey) != null ? _c : null
      });
    }
    const result = await createPaymentIntent(auth, body, {
      idempotencyKey,
      event
    });
    return result;
  } catch (error) {
    if (error instanceof AppError) {
      if ((_d = error.details) == null ? void 0 : _d.retryAfterSec) {
        setResponseHeader(
          event,
          "Retry-After",
          error.details.retryAfterSec.toString()
        );
      }
      setResponseStatus(event, error.statusCode);
      return {
        error: error.code,
        message: error.message,
        details: error.details
      };
    }
    if (error == null ? void 0 : error.statusCode) {
      setResponseStatus(event, error.statusCode);
      return {
        error: ((_e = error == null ? void 0 : error.data) == null ? void 0 : _e.code) || "REQUEST_ERROR",
        message: (error == null ? void 0 : error.statusMessage) || (error == null ? void 0 : error.message) || "Request failed",
        details: error == null ? void 0 : error.data
      };
    }
    setResponseStatus(event, 400);
    return {
      error: "BAD_REQUEST",
      message: (error == null ? void 0 : error.message) || "Invalid request"
    };
  }
});

const index_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: index_post
}, Symbol.toStringTag, { value: 'Module' }));

function sha256(input) {
  return createHash("sha256").update(input).digest("hex");
}
function hmacSha256(secret, payload) {
  return createHmac("sha256", secret).update(payload).digest("hex");
}
function safeCompare(a, b) {
  if (!a || !b) return false;
  const ab = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ab.length !== bb.length) return false;
  return timingSafeEqual$1(ab, bb);
}

function buildScbCallbackSignature(secret, rawBody) {
  return hmacSha256(secret, rawBody);
}
function verifyScbCallbackSignature(secret, rawBody, incoming) {
  const expected = buildScbCallbackSignature(secret, rawBody);
  return safeCompare(expected, incoming || "");
}

const queueNames = {
  callback: "callback-queue",
  webhook: "webhook-queue",
  reconcile: "reconcile-queue",
  async: "async-queue"
};
const callbackQueue = new Queue$1(queueNames.callback, { connection: redis });
new Queue$1(queueNames.webhook, { connection: redis });
new Queue$1(queueNames.reconcile, { connection: redis });
new Queue$1(queueNames.async, { connection: redis });

async function storeProviderCallback(params) {
  const dedupeKey = `${params.providerCode}:${params.providerTxnId || params.providerReference || sha256(params.rawBody)}`;
  let callback;
  try {
    callback = await prisma$1.providerCallback.create({
      data: {
        providerCode: params.providerCode,
        callbackType: "PAYMENT_CALLBACK",
        processStatus: "RECEIVED",
        providerReference: params.providerReference,
        providerTxnId: params.providerTxnId,
        signatureValid: params.signatureValid,
        dedupeKey,
        headers: params.headers,
        queryParams: params.queryParams || {},
        body: params.body,
        rawBodySha256: sha256(params.rawBody)
      }
    });
  } catch {
    return { duplicate: true };
  }
  await callbackQueue.add("provider.callback.process", { providerCallbackId: callback.id }, { jobId: `pcb_${callback.id}_${nanoid(6)}`, removeOnComplete: 1e3, removeOnFail: 1e3 });
  await prisma$1.providerCallback.update({
    where: { id: callback.id },
    data: { processStatus: "QUEUED", queuedAt: /* @__PURE__ */ new Date() }
  });
  return { duplicate: false, callbackId: callback.id };
}

const callback_post = defineEventHandler(async (event) => {
  var _a, _b;
  const rawBody = await readRawBody(event, "utf8") || "{}";
  const body = JSON.parse(rawBody);
  const incomingSig = getHeader(event, "x-signature") || getHeader(event, "authorization") || "";
  const signatureValid = verifyScbCallbackSignature(process.env.SCB_CALLBACK_SECRET || "", rawBody, incomingSig);
  const result = await storeProviderCallback({
    providerCode: "SCB",
    rawBody,
    body,
    headers: getHeaders(event),
    queryParams: getQuery$1(event),
    signatureValid,
    providerReference: (body == null ? void 0 : body.partnerPaymentId) || ((_a = body == null ? void 0 : body.data) == null ? void 0 : _a.partnerPaymentId) || null,
    providerTxnId: (body == null ? void 0 : body.transactionId) || ((_b = body == null ? void 0 : body.data) == null ? void 0 : _b.transactionId) || null
  });
  return { received: true, duplicate: result.duplicate };
});

const callback_post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: callback_post
}, Symbol.toStringTag, { value: 'Module' }));

const TOLERANCE = Number(process.env.WEBHOOK_TIMESTAMP_TOLERANCE_SEC || 300);
function timingSafeEqual(a, b) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return crypto$1.timingSafeEqual(bufA, bufB);
}
async function verifyWebhookSignature({
  rawBody,
  signature,
  timestamp,
  merchantId
}) {
  if (!signature || !timestamp) {
    throw new Error("missing signature");
  }
  const ts = Number(timestamp);
  if (!Number.isFinite(ts)) {
    throw new Error("invalid timestamp");
  }
  const now = Math.floor(Date.now() / 1e3);
  if (Math.abs(now - ts) > TOLERANCE) {
    throw new Error("timestamp out of tolerance");
  }
  const secrets = getSecrets();
  if (!secrets.length) {
    throw new Error("webhook secret is not configured");
  }
  const payload = `${timestamp}.${rawBody}`;
  const matched = secrets.some((secret) => {
    const expected = crypto$1.createHmac("sha256", secret).update(payload).digest("hex");
    return timingSafeEqual(expected, signature);
  });
  if (!matched) {
    throw new Error("invalid signature");
  }
}
function getSecrets(_merchantId) {
  return (process.env.WEBHOOK_SECRET || "").split(",").map((s) => s.trim()).filter(Boolean);
}

const { Queue } = BullMQ;
const redisUrl = process.env.REDIS_URL || "redis://localhost:6379";
const webhookQueueName = "webhook-queue";
function createRedisConnection() {
  return new IORedis(redisUrl, {
    maxRetriesPerRequest: null,
    enableReadyCheck: false
  });
}
function createWebhookQueue() {
  return new Queue(webhookQueueName, {
    connection: createRedisConnection(),
    defaultJobOptions: {
      attempts: Number(process.env.WEBHOOK_QUEUE_ATTEMPTS || 5),
      backoff: {
        type: "exponential",
        delay: Number(process.env.WEBHOOK_QUEUE_BACKOFF_MS || 2e3)
      },
      removeOnComplete: 1e3,
      removeOnFail: 1e3
    }
  });
}

function toSafeJobId(input) {
  return `webhook__${input.provider}__${input.eventId}`;
}
async function enqueueWebhookJob(data) {
  const queue = createWebhookQueue();
  try {
    await queue.add("process-webhook", data, {
      jobId: toSafeJobId({
        provider: data.provider,
        eventId: data.eventId
      })
    });
  } finally {
    await queue.close();
  }
}

function getErrorMessage(error) {
  if (error instanceof Error) return error.message;
  return "unknown error";
}
const _provider__post = defineEventHandler(async (event) => {
  var _a;
  const provider = (_a = event.context.params) == null ? void 0 : _a.provider;
  if (!provider) {
    setResponseStatus(event, 400);
    return { error: "missing provider" };
  }
  const rawBody = await readRawBody(event, "utf8") || "";
  const signature = getHeader(event, "x-payiq-signature") || "";
  const timestamp = getHeader(event, "x-payiq-timestamp") || "";
  const eventId = getHeader(event, "x-payiq-event-id") || "";
  const merchantId = getHeader(event, "x-merchant-id") || null;
  if (!eventId) {
    setResponseStatus(event, 400);
    return { error: "missing event id" };
  }
  const existing = await prisma$1.webhookEvent.findUnique({
    where: {
      provider_eventId: {
        provider,
        eventId
      }
    },
    select: {
      id: true,
      status: true
    }
  });
  if (existing) {
    await prisma$1.webhookEvent.update({
      where: { id: existing.id },
      data: { status: "DUPLICATE" }
    });
    setResponseStatus(event, 200);
    return { ok: true, duplicate: true };
  }
  const dbRecord = await prisma$1.webhookEvent.create({
    data: {
      provider,
      eventId,
      merchantId,
      payload: rawBody,
      status: "RECEIVED",
      headersJson: {
        signature,
        timestamp,
        merchantId
      }
    },
    select: {
      id: true
    }
  });
  try {
    await verifyWebhookSignature({
      rawBody,
      signature,
      timestamp,
      merchantId: merchantId || void 0
    });
    await prisma$1.webhookEvent.update({
      where: { id: dbRecord.id },
      data: {
        status: "VERIFIED",
        verifiedAt: /* @__PURE__ */ new Date()
      }
    });
    await enqueueWebhookJob({
      eventId,
      provider,
      rawBody,
      merchantId: merchantId || void 0,
      headers: {
        "x-payiq-signature": signature,
        "x-payiq-timestamp": timestamp,
        "x-payiq-event-id": eventId,
        "x-merchant-id": merchantId || void 0
      }
    });
    setResponseStatus(event, 200);
    return { ok: true };
  } catch (error) {
    const message = getErrorMessage(error);
    await prisma$1.webhookEvent.update({
      where: { id: dbRecord.id },
      data: {
        status: "FAILED",
        lastError: message
      }
    });
    setResponseStatus(event, 400);
    return { error: message };
  }
});

const _provider__post$1 = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: _provider__post
}, Symbol.toStringTag, { value: 'Module' }));

function renderPayloadResponse(ssrContext) {
	return {
		body: encodeForwardSlashes(stringify(splitPayload(ssrContext).payload, ssrContext["~payloadReducers"])) ,
		statusCode: getResponseStatus(ssrContext.event),
		statusMessage: getResponseStatusText(ssrContext.event),
		headers: {
			"content-type": "application/json;charset=utf-8" ,
			"x-powered-by": "Nuxt"
		}
	};
}
function renderPayloadJsonScript(opts) {
	const contents = opts.data ? encodeForwardSlashes(stringify(opts.data, opts.ssrContext["~payloadReducers"])) : "";
	const payload = {
		"type": "application/json",
		"innerHTML": contents,
		"data-nuxt-data": appId,
		"data-ssr": !(opts.ssrContext.noSSR)
	};
	{
		payload.id = "__NUXT_DATA__";
	}
	if (opts.src) {
		payload["data-src"] = opts.src;
	}
	const config = uneval(opts.ssrContext.config);
	return [payload, { innerHTML: `window.__NUXT__={};window.__NUXT__.config=${config}` }];
}
/**
* Encode forward slashes as unicode escape sequences to prevent
* Google from treating them as internal links and trying to crawl them.
* @see https://github.com/nuxt/nuxt/issues/24175
*/
function encodeForwardSlashes(str) {
	return str.replaceAll("/", "\\u002F");
}
function splitPayload(ssrContext) {
	const { data, prerenderedAt, ...initial } = ssrContext.payload;
	return {
		initial: {
			...initial,
			prerenderedAt
		},
		payload: {
			data,
			prerenderedAt
		}
	};
}

const renderSSRHeadOptions = {"omitLineBreaks":true};

// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__buildAssetsURL = buildAssetsURL;
// @ts-expect-error private property consumed by vite-generated url helpers
globalThis.__publicAssetsURL = publicAssetsURL;
const HAS_APP_TELEPORTS = !!(appTeleportAttrs.id);
const APP_TELEPORT_OPEN_TAG = HAS_APP_TELEPORTS ? `<${appTeleportTag}${propsToString(appTeleportAttrs)}>` : "";
const APP_TELEPORT_CLOSE_TAG = HAS_APP_TELEPORTS ? `</${appTeleportTag}>` : "";
const PAYLOAD_URL_RE = /^[^?]*\/_payload.json(?:\?.*)?$/ ;
const PAYLOAD_FILENAME = "_payload.json" ;
const handler = defineRenderHandler(async (event) => {
	const nitroApp = useNitroApp();
	// Whether we're rendering an error page
	const ssrError = event.path.startsWith("/__nuxt_error") ? getQuery$1(event) : null;
	if (ssrError && !("__unenv__" in event.node.req)) {
		throw createError({
			status: 404,
			statusText: "Page Not Found: /__nuxt_error",
			message: "Page Not Found: /__nuxt_error"
		});
	}
	// Initialize ssr context
	const ssrContext = createSSRContext(event);
	// needed for hash hydration plugin to work
	const headEntryOptions = { mode: "server" };
	ssrContext.head.push(appHead, headEntryOptions);
	if (ssrError) {
		// eslint-disable-next-line @typescript-eslint/no-deprecated
		const status = ssrError.status || ssrError.statusCode;
		if (status) {
			// eslint-disable-next-line @typescript-eslint/no-deprecated
			ssrError.status = ssrError.statusCode = Number.parseInt(status);
		}
		if (typeof ssrError.data === "string") {
			try {
				ssrError.data = destr(ssrError.data);
			} catch {}
		}
		setSSRError(ssrContext, ssrError);
	}
	// Get route options (for `ssr: false`, `isr`, `cache` and `noScripts`)
	const routeOptions = getRouteRules(event);
	// Whether we are prerendering route or using ISR/SWR caching
	const _PAYLOAD_EXTRACTION = !ssrContext.noSSR && (NUXT_RUNTIME_PAYLOAD_EXTRACTION);
	// When NUXT_PAYLOAD_INLINE is true (payloadExtraction: 'client'), we inline the full payload
	// in the HTML to avoid a separate _payload.json fetch on initial load (which would trigger a
	// second render or lambda invocation). The _payload.json endpoint still works for client-side nav.
	const _PAYLOAD_INLINE = !_PAYLOAD_EXTRACTION || NUXT_PAYLOAD_INLINE;
	const isRenderingPayload = (_PAYLOAD_EXTRACTION || routeOptions.prerender) && PAYLOAD_URL_RE.test(ssrContext.url);
	if (isRenderingPayload) {
		const url = ssrContext.url.substring(0, ssrContext.url.lastIndexOf("/")) || "/";
		ssrContext.url = url;
		event._path = event.node.req.url = url;
	}
	if (routeOptions.ssr === false) {
		ssrContext.noSSR = true;
	}
	const payloadURL = _PAYLOAD_EXTRACTION ? joinURL(ssrContext.runtimeConfig.app.cdnURL || ssrContext.runtimeConfig.app.baseURL, ssrContext.url.replace(/\?.*$/, ""), PAYLOAD_FILENAME) + "?" + ssrContext.runtimeConfig.app.buildId : undefined;
	// Render app
	const renderer = await getRenderer(ssrContext);
	const _rendered = await renderer.renderToString(ssrContext).catch(async (error) => {
		// We use error to bypass full render if we have an early response we can make
		// TODO: remove _renderResponse in nuxt v5
		if ((ssrContext["~renderResponse"] || ssrContext._renderResponse) && error.message === "skipping render") {
			return {};
		}
		// Use explicitly thrown error in preference to subsequent rendering errors
		const _err = !ssrError && ssrContext.payload?.error || error;
		await ssrContext.nuxt?.hooks.callHook("app:error", _err);
		throw _err;
	});
	// Render inline styles
	// TODO: remove _renderResponse in nuxt v5
	const inlinedStyles = [];
	await ssrContext.nuxt?.hooks.callHook("app:rendered", {
		ssrContext,
		renderResult: _rendered
	});
	if (ssrContext["~renderResponse"] || ssrContext._renderResponse) {
		// TODO: remove _renderResponse in nuxt v5
		return ssrContext["~renderResponse"] || ssrContext._renderResponse;
	}
	// Handle errors
	if (ssrContext.payload?.error && !ssrError) {
		throw ssrContext.payload.error;
	}
	// Directly render payload routes
	if (isRenderingPayload) {
		const response = renderPayloadResponse(ssrContext);
		return response;
	}
	const NO_SCRIPTS = routeOptions.noScripts;
	// Setup head
	const { styles, scripts } = getRequestDependencies(ssrContext, renderer.rendererContext);
	// 1. Preload payloads and app manifest
	// Skip preload when inlining full payload in HTML (no separate fetch needed for initial load)
	if (_PAYLOAD_EXTRACTION && !_PAYLOAD_INLINE && !NO_SCRIPTS) {
		ssrContext.head.push({ link: [{
			rel: "preload",
			as: "fetch",
			crossorigin: "anonymous",
			href: payloadURL
		} ] }, headEntryOptions);
	}
	// 2. Styles
	if (inlinedStyles.length) {
		ssrContext.head.push({ style: inlinedStyles });
	}
	const link = [];
	for (const resource of Object.values(styles)) {
		// Do not add links to resources that are inlined (vite v5+)
		if ("inline" in getQuery(resource.file)) {
			continue;
		}
		// Add CSS links in <head> for CSS files
		// - in production
		// - in dev mode when not rendering an island
		link.push({
			rel: "stylesheet",
			href: renderer.rendererContext.buildAssetsURL(resource.file),
			crossorigin: ""
		});
	}
	if (link.length) {
		ssrContext.head.push({ link }, headEntryOptions);
	}
	if (!NO_SCRIPTS) {
		// 4. Resource Hints
		// Remove lazy hydrated modules from ssrContext.modules so they don't get preloaded
		// (CSS links are already added above, this only affects JS preloads)
		if (ssrContext["~lazyHydratedModules"]) {
			for (const id of ssrContext["~lazyHydratedModules"]) {
				ssrContext.modules?.delete(id);
			}
		}
		ssrContext.head.push({ link: getPreloadLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		ssrContext.head.push({ link: getPrefetchLinks(ssrContext, renderer.rendererContext) }, headEntryOptions);
		// 5. Payloads
		ssrContext.head.push({ script: _PAYLOAD_INLINE ? renderPayloadJsonScript({
			ssrContext,
			data: ssrContext.payload
		})  : renderPayloadJsonScript({
			ssrContext,
			data: splitPayload(ssrContext).initial,
			src: payloadURL
		})  }, {
			...headEntryOptions,
			tagPosition: "bodyClose",
			tagPriority: "high"
		});
	}
	// 6. Scripts
	if (!routeOptions.noScripts) {
		const tagPosition = "head";
		ssrContext.head.push({ script: Object.values(scripts).map((resource) => ({
			type: resource.module ? "module" : null,
			src: renderer.rendererContext.buildAssetsURL(resource.file),
			defer: resource.module ? null : true,
			tagPosition,
			crossorigin: ""
		})) }, headEntryOptions);
	}
	const { headTags, bodyTags, bodyTagsOpen, htmlAttrs, bodyAttrs } = await renderSSRHead(ssrContext.head, renderSSRHeadOptions);
	// Create render context
	const htmlContext = {
		htmlAttrs: htmlAttrs ? [htmlAttrs] : [],
		head: normalizeChunks([headTags]),
		bodyAttrs: bodyAttrs ? [bodyAttrs] : [],
		bodyPrepend: normalizeChunks([bodyTagsOpen, ssrContext.teleports?.body]),
		body: [replaceIslandTeleports(ssrContext, _rendered.html) , APP_TELEPORT_OPEN_TAG + (HAS_APP_TELEPORTS ? joinTags([ssrContext.teleports?.[`#${appTeleportAttrs.id}`]]) : "") + APP_TELEPORT_CLOSE_TAG],
		bodyAppend: [bodyTags]
	};
	// Allow hooking into the rendered result
	await nitroApp.hooks.callHook("render:html", htmlContext, { event });
	// Construct HTML response
	return {
		body: renderHTMLDocument(htmlContext),
		statusCode: getResponseStatus(event),
		statusMessage: getResponseStatusText(event),
		headers: {
			"content-type": "text/html;charset=utf-8",
			"x-powered-by": "Nuxt"
		}
	};
});
function normalizeChunks(chunks) {
	const result = [];
	for (const _chunk of chunks) {
		const chunk = _chunk?.trim();
		if (chunk) {
			result.push(chunk);
		}
	}
	return result;
}
function joinTags(tags) {
	return tags.join("");
}
function joinAttrs(chunks) {
	if (chunks.length === 0) {
		return "";
	}
	return " " + chunks.join(" ");
}
function renderHTMLDocument(html) {
	return "<!DOCTYPE html>" + `<html${joinAttrs(html.htmlAttrs)}>` + `<head>${joinTags(html.head)}</head>` + `<body${joinAttrs(html.bodyAttrs)}>${joinTags(html.bodyPrepend)}${joinTags(html.body)}${joinTags(html.bodyAppend)}</body>` + "</html>";
}

const renderer = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: handler
}, Symbol.toStringTag, { value: 'Module' }));
//# sourceMappingURL=index.mjs.map
