// @ts-check
import { defineConfig } from "astro/config";

import tailwindcss from "@tailwindcss/vite";

import react from "@astrojs/react";

import authAstro from "@zitadel/astro-auth";

import node from "@astrojs/node";

// https://astro.build/config
export default defineConfig({
  output: "server",

  adapter: node({
    mode: "standalone",
  }),

  // Auth.js is driven from ./auth.config.mjs; its own endpoints are disabled in
  // favour of src/pages/api/auth/[...auth].ts, which adds the TLS-proxy rewrite
  // and the Keycloak RP-initiated logout.
  integrations: [react(), authAstro({ configFile: "./auth.config.mjs", injectEndpoints: false })],

  // Every deployment host is a subdomain of uni-goettingen.de, and Astro only
  // trusts forwarded Host / X-Forwarded-* headers for hosts listed here — at
  // build time, so an unlisted domain needs a rebuild. `**` also covers the
  // species hosts nested one level deeper (lsta.emobase.uni-goettingen.de);
  // `*` alone would not.
  // Local development on localhost is outside the allowlist: start the dev
  // server with DISABLE_ORIGIN_CHECK=true. It is read when this config loads,
  // so it is a local/dev switch, not something a built image can toggle.
  security: {
    checkOrigin: process.env.DISABLE_ORIGIN_CHECK !== "true",
    allowedDomains: [{ hostname: "**.uni-goettingen.de", protocol: "https" }],
  },

  vite: {
    plugins: [tailwindcss()],
  },
});
