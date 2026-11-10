const defaultValues: Record<string, string> = {
  PUBLIC_APIS_BASE_URL: "/api",
  PUBLIC_DOWNLOAD_URL: "/download/",

  PUBLIC_UI_PAGE_GENOMEBROWSER: "/jbrowse/",
  PUBLIC_UI_PAGE_BLAST: "/blast/",
  PUBLIC_UI_PAGE_API_DOC: "/api/genomicsservice/v1/docs",

  AUTH_TRUST_HOST: "true",

  KEYCLOAK_ISSUER: "http://localhost:8081/keycloak/realms/ibb",
  KEYCLOAK_CLIENT_ID: "ibb-client",
};

/**
 * Utility to access environment variables consistently on both server and client side.
 * In SSR mode, it supports reading variables injected into window.__ENV__ at runtime.
 */
export const getEnv = (key: string): string => {
  try {
    if (typeof window !== "undefined") {
      // Client-side: try runtime-injected env first, then fall back to build-time env
      return (
        (window as any).__ENV__?.[key] ||
        (import.meta.env as any)?.[key] ||
        defaultValues[key] ||
        ""
      );
    }

    // Server-side: Use process.env for reliable runtime access with dynamic keys.
    // We also check import.meta.env as a fallback for Astro-specific behavior.
    const processEnv = typeof process !== "undefined" ? process.env : {};
    return (processEnv?.[key] ||
      (import.meta.env as any)?.[key] ||
      defaultValues[key] ||
      "") as string;
  } catch (err) {
    console.error(`[getEnv Error] Failed to get key ${key}:`, err);
    return "";
  }
};

const isAbsoluteUrl = (value: string): boolean =>
  /^([a-z][a-z0-9+.-]*:)?\/\//i.test(value);

/**
 * Reads a URL environment variable and resolves relative paths against
 * PUBLIC_SERVER. Absolute values are returned untouched, so deployments can
 * override any path with a full URL.
 *
 * URL env vars use relative paths by convention (see `defaultValues`); this is
 * the single place that turns them into absolute URLs.
 */
export const getUrlEnv = (key: string): string => {
  const value = getEnv(key);
  if (!value || isAbsoluteUrl(value)) return value;

  const origin = getEnv("PUBLIC_SERVER").replace(/\/+$/, "");
  if (!origin) return value;

  return `${origin}/${value.replace(/^\/+/, "")}`;
};
