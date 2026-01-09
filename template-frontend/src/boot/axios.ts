import { defineBoot } from '#q-app/wrappers';
import type { InternalAxiosRequestConfig } from 'axios';
import axios from 'axios';
import type { AxiosInstance, AxiosResponse } from 'axios';
import { v4 as uuidv4 } from 'uuid';

import type DataObject from '../models/DataObject';
import LanguageUtil from '../util/LanguageUtil';
import SessionUtil from '../util/SessionUtil';
import NotifyUtil from '../util/NotifyUtil';
import ApiUtil from '../util/ApiUtil';

const processEnv = import.meta.env;
const baseURL = processEnv.VITE_API_URL;

// --- Caching Mechanism ---
// 1. In-memory cache store
const cache = new Map<
  string,
  { data: DataObject | Array<DataObject> | null | undefined; expiry: number }
>();
// 2. Default Time-to-Live for cached items (5 minutes)
const DEFAULT_CACHE_TTL = 5 * 60 * 1000;

declare module 'vue' {
  interface ComponentCustomProperties {
    $axios: AxiosInstance;
    $api: AxiosInstance;
  }
}

// --- Extend Axios types for custom properties ---
declare module 'axios' {
  export interface InternalAxiosRequestConfig {
    /** Custom TTL for this request's cache in milliseconds. */
    cacheTTL?: number;
    /** Internal flag to identify a request fulfilled from cache. */
    __fromCache?: boolean;
    /** Unique identifier for request-response tracking. */
    rayId?: string;
  }
  export interface AxiosResponse {
    __fromCache?: boolean;
  }
}

const api = axios.create({ baseURL });
type HeaderValue = string | number | string[] | undefined;

export default defineBoot(({ app }) => {
  const findHeaderIgnoreCase = (headers: DataObject, keyToFind: string): HeaderValue | null => {
    const foundKey = Object.keys(headers).find(
      (key) => key.toLowerCase() === keyToFind.toLowerCase(),
    );
    return foundKey ? (headers[foundKey] as HeaderValue) : null;
  };

  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      // --- Cache Check (for GET requests only) ---
      if (config.method?.toLowerCase() === 'get') {
        const cacheKey = (config.url || '') + JSON.stringify(config.params || {});
        const cachedItem = cache.get(cacheKey);

        if (cachedItem) {
          // If item has expired, remove it from cache and proceed with network request
          if (Date.now() > cachedItem.expiry) {
            cache.delete(cacheKey);
          } else {
            // If item is valid, short-circuit the request
            console.log(`[CACHE] Serving '${cacheKey}' from cache.`);
            config.__fromCache = true;
            // Use a custom adapter to resolve with cached data
            config.adapter = () => {
              return Promise.resolve({
                data: cachedItem.data,
                status: 200,
                statusText: 'OK (from cache)',
                headers: {},
                config,
                request: {},
              });
            };
            return config;
          }
        }
      }

      // --- Original Request Logic ---
      const rayId = uuidv4();
      config.headers['X-RAY-ID'] = rayId;
      config.rayId = rayId;

      if (SessionUtil.getToken()) {
        config.headers.Authorization = `Bearer ${SessionUtil.getToken()}`;
      }
      if (!config.headers['Content-Type']) {
        config.headers['Content-Type'] = 'application/json';
      }
      config.headers['accept-language'] = LanguageUtil.isArabic() ? 'ar' : 'en';
      config.headers['language'] = LanguageUtil.isArabic() ? 'ar' : 'en';
      config.headers['app-version'] = processEnv.VITE_APP_VERSION;
      config.headers['platform'] = 'desktop';

      ApiUtil.initializeFingerprint();
      config.headers['X-FINGERPRINT'] = ApiUtil.getFingerprint() || 'unknown';

      return config;
    },
    (error) => {
      return Promise.reject(error instanceof Error ? error : new Error(String(error)));
    },
  );

  api.interceptors.response.use(
    (response: AxiosResponse) => {
      // If the response is from cache, just return the data directly
      if (response.config.__fromCache) {
        return response.data;
      }

      // --- Store successful GET requests in cache ---
      if (response.config.method?.toLowerCase() === 'get') {
        const cacheKey = (response.config.url || '') + JSON.stringify(response.config.params || {});
        const ttl = response.config.cacheTTL || DEFAULT_CACHE_TTL;
        const expiry = Date.now() + ttl;

        console.log(`[CACHE] Storing '${cacheKey}' with TTL of ${ttl}ms.`);
        cache.set(cacheKey, { data: response.data, expiry });
      }
      // const error = JSON.parse(JSON.stringify(data))?.error;
      // --- Original Response Logic ---
      const res = response.data as {
        success: boolean;
        message: string;
        error: DataObject | null;
        data: DataObject | null;
      };

      const requestRayId = response.config.rayId;
      const responseRayId = findHeaderIgnoreCase(response.headers, 'x-ray-id');
      const responseFingerprint = findHeaderIgnoreCase(response.headers, 'x-fingerprint');
      const success = res.success;

      if (!responseRayId || requestRayId !== responseRayId) {
        throw new Error('Ray mismatch');
      }

      if (
        !responseFingerprint ||
        ApiUtil.getFingerprint()?.toString() !== String(responseFingerprint)
      ) {
        throw new Error('Fingerprint mismatch');
      }

      if (success === false) {
        NotifyUtil.error({
          message: (res.error?.message || res.message) as string,
        });
        if (res.error?.code === 'INVALID_FINGERPRINT') {
          SessionUtil.logout();
          return;
        }
        throw new Error(JSON.stringify(res.error));
      }

      return response.data; // Return full data for successful requests
    },
    (error) => {
      let msg = 'Network error';
      // const error = JSON.parse(JSON.stringify(data))?.error;
      const res = error.response?.data;
      try {
        msg = (res.error?.message || res.message) as string;
      } catch (e) {
        console.error(e);
        msg = 'An unexpected network error occurred.';
      }
      NotifyUtil.error({ message: msg });
      if (res.error?.code === 'INVALID_FINGERPRINT') {
        SessionUtil.logout();
        return;
      }
      return Promise.resolve(res?.error ?? null);
    },
  );

  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
