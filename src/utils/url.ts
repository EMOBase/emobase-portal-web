import { getEnv, getUrlEnv } from "./env";
import { API_SERVICE_ENVS, type ApiService } from "./constants/api";

export const directusUrl = getUrlEnv("PUBLIC_DIRECTUS_URL");
export const keycloakIssuerUrl = getUrlEnv("KEYCLOAK_ISSUER");
export const apiBaseUrl = getUrlEnv("PUBLIC_APIS_BASE_URL");
export const jbrowseBaseUrl = getUrlEnv("PUBLIC_UI_PAGE_GENOMEBROWSER");
export const downloadBaseUrl = getUrlEnv("PUBLIC_DOWNLOAD_URL");

const ASSEMBLY_IMAGE_PATH_PREFIX = "public/uploads/";

const isServer = () => typeof window === "undefined";
const trimTrailingSlash = (url: string) => url.replace(/\/+$/, "");
const warned = new Set<string>();
const isAbsoluteUrl = (url: string) => /^https?:\/\//i.test(url);

const isLoopbackUrl = (url: string): boolean => {
  try {
    const hostname = new URL(url).hostname;
    return ["localhost", "127.0.0.1", "::1"].includes(hostname);
  } catch {
    return false;
  }
};

const warnOnce = (key: string, message: string) => {
  if (warned.has(key)) return;
  warned.add(key);
  console.warn(message);
};

const getInternalUrl = (key: string): string => {
  const value = getEnv(key).trim();
  if (!value) return "";

  if (!isAbsoluteUrl(value)) {
    warnOnce(
      key,
      `[urls] ${key} must be an absolute URL; ignoring relative value "${value}".`,
    );
    return "";
  }

  return trimTrailingSlash(value);
};

const warnIfLoopbackFallback = (
  publicKey: string,
  internalKey: string,
  publicUrl: string,
) => {
  if (!isLoopbackUrl(publicUrl)) return;

  warnOnce(
    internalKey,
    `[urls] ${internalKey} is not set and ${publicKey} points at loopback ` +
      `(${publicUrl}). Server-side calls will target the current container.`,
  );
};

export const downloadUrl = (path: string): string => {
  const base = downloadBaseUrl.endsWith("/")
    ? downloadBaseUrl
    : `${downloadBaseUrl}/`;
  return `${base}${path.replace(/^\/+/, "")}`;
};

export const assemblyImageUrl = (
  imagePath?: string | null,
): string | undefined => {
  if (!imagePath) return undefined;
  const normalized = imagePath.replace(/^\/+/, "");
  const rel = normalized.startsWith(ASSEMBLY_IMAGE_PATH_PREFIX)
    ? normalized.slice(ASSEMBLY_IMAGE_PATH_PREFIX.length)
    : normalized;
  return downloadUrl(`emobase-genomics/${rel}`);
};

export const getPublicApiBaseUrl = (service: ApiService): string => {
  const publicUrl =
    getUrlEnv(API_SERVICE_ENVS[service].public) ||
    `${apiBaseUrl}/${service}/v1`;
  return trimTrailingSlash(publicUrl);
};

export const getApiBaseUrl = (service: ApiService): string => {
  const publicUrl = getPublicApiBaseUrl(service);
  if (!isServer()) return publicUrl;

  const { public: publicKey, internal: internalKey } = API_SERVICE_ENVS[service];
  const internalUrl = getInternalUrl(internalKey);
  if (internalUrl) return internalUrl;

  warnIfLoopbackFallback(publicKey, internalKey, publicUrl);
  return publicUrl;
};

export const getDirectusUrl = (): string => {
  const publicUrl = trimTrailingSlash(getUrlEnv("PUBLIC_DIRECTUS_URL"));
  if (!isServer()) return publicUrl;

  const internalUrl = getInternalUrl("INTERNAL_DIRECTUS_URL");
  if (internalUrl) return internalUrl;

  warnIfLoopbackFallback(
    "PUBLIC_DIRECTUS_URL",
    "INTERNAL_DIRECTUS_URL",
    publicUrl,
  );
  return publicUrl;
};

export const getKeycloakServerIssuer = (): string => {
  const publicUrl = trimTrailingSlash(getUrlEnv("KEYCLOAK_ISSUER"));
  if (!isServer()) return publicUrl;

  const internalUrl = getInternalUrl("INTERNAL_KEYCLOAK_ISSUER");
  if (internalUrl) return internalUrl;

  warnIfLoopbackFallback(
    "KEYCLOAK_ISSUER",
    "INTERNAL_KEYCLOAK_ISSUER",
    publicUrl,
  );
  return publicUrl;
};
