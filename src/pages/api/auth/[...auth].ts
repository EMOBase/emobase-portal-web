import { Auth } from "@auth/core";
import { decode } from "@auth/core/jwt";
import authConfig from "../../../../auth.config.mjs";
import { getEnv, getUrlEnv } from "@/utils/env";

const SESSION_COOKIES = ["__Secure-authjs.session-token", "authjs.session-token"];
const SIGNOUT_PATH = "/api/auth/signout";

const isLocalhost = (hostname: string) =>
  ["localhost", "127.0.0.1", "::1"].includes(hostname);

/**
 * The node adapter always builds an http:// request URL, even when the public
 * endpoint is behind a TLS proxy. Prefer the proxy header, then fall back to
 * the configured PUBLIC_SERVER so a direct request to the container still
 * uses the public scheme.
 */
const requestUsesHttps = (request: Request): boolean => {
  const forwardedProto = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim()
    .toLowerCase();

  if (forwardedProto === "https") return true;
  if (forwardedProto === "http") return false;

  const publicServer = getEnv("PUBLIC_SERVER");
  return /^https:\/\//i.test(publicServer);
};

const handler = async ({ request }: { request: Request }) => {
  const url = new URL(request.url);

  if (requestUsesHttps(request)) {
    url.protocol = "https:";
  }

  // Use the RP-initiated logout for deployed hosts (including plain-HTTP LAN
  // deployments), but keep local dev servers on Auth.js' default sign-out.
  const isDeployedHost = !isLocalhost(url.hostname);

  if (isDeployedHost && url.pathname === SIGNOUT_PATH && request.method === "POST") {
    const idToken = await getIdToken(request);
    const response = await Auth(new Request(url, request), authConfig);

    if (idToken) {
      const logoutUrl = new URL(
        `${getUrlEnv("KEYCLOAK_ISSUER")}/protocol/openid-connect/logout`,
      );
      logoutUrl.searchParams.set("post_logout_redirect_uri", url.origin);
      logoutUrl.searchParams.set("id_token_hint", idToken);

      const res = new Response(response.body, {
        status: response.status,
        statusText: response.statusText,
        headers: response.headers,
      });
      res.headers.set("Location", logoutUrl.toString());
      return res;
    }

    return response;
  }

  return await Auth(new Request(url, request), authConfig);
};

async function getIdToken(request: Request): Promise<string | null> {
  const cookie = request.headers.get("cookie") ?? "";
  const parts = cookie.split(";").map((c) => c.trim());

  for (const name of SESSION_COOKIES) {
    const value = parts
      .find((c) => c.startsWith(`${name}=`))
      ?.slice(name.length + 1);

    if (!value) continue;

    try {
      const token = await decode({
        token: value,
        secret: authConfig.secret as string,
        salt: name,
      });
      return typeof token?.idToken === "string" ? token.idToken : null;
    } catch {
      return null;
    }
  }

  return null;
}

export const GET = handler;
export const POST = handler;
