# EMOBase portal web UI

Astro server-rendered frontend for the multi-species EMOBase portal. It lists
database versions and assemblies, serves search and gene pages, and links to the
genomics API, JBrowse2 and BLAST of the same portal.

The image is published as `ghcr.io/emobase/emobase-portal-web` and deployed by
[`emobase-portal-deploy`](https://github.com/EMOBase/emobase-portal-deploy).

- [Deployment stack](https://github.com/EMOBase/emobase-portal-deploy)
- [Genomics API](https://github.com/EMOBase/emobase-genomics)
- [Deployment guide](https://github.com/EMOBase/emobase-docs/blob/main/DEPLOYMENT.md)

## Requirements

- Node.js 22.12 or newer (see `engines` in `package.json`)
- npm

## Local development

To run against the full local Docker stack (portal, Keycloak and species),
including the `.env` values and the Keycloak dev origin, see
[DEVELOPMENT.md](DEVELOPMENT.md). The steps below are the standalone UI setup.

```bash
npm install
cp .env.example .env
# Set PUBLIC_SERVER, the KEYCLOAK_* values and AUTH_SECRET.

DISABLE_ORIGIN_CHECK=true npm run dev
```

The dev server listens on `http://localhost:4321`. `localhost` is outside
`security.allowedDomains` in `astro.config.mjs`, so `DISABLE_ORIGIN_CHECK=true`
is required locally; the flag is read when the Astro config loads.

The genomics API, JBrowse2 and BLAST come from a running deployment. Point
`PUBLIC_API_GENOMICS_SERVICE` at it, or use the defaults derived from
`PUBLIC_SERVER`.

| Script | Action |
| --- | --- |
| `npm run dev` | Start the dev server |
| `npm run check` | Type-check the project |
| `npm run build` | Build for production |
| `npm run preview` | Preview a production build |
| `npm run storybook` | Start Storybook on port `6006` |
| `npm run build-storybook` | Build static Storybook |

## Environment

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SERVER` | Browser-facing portal origin; relative paths resolve against it |
| `PUBLIC_API_GENOMICS_SERVICE` | Genomics API URL; optional, derived from `PUBLIC_APIS_BASE_URL` |
| `AUTH_SECRET` | Auth.js session secret (`openssl rand -base64 48`) |
| `AUTH_TRUST_HOST` | Trust forwarded `Host` and `X-Forwarded-*` headers |
| `KEYCLOAK_ISSUER` | Browser-facing Keycloak realm issuer |
| `KEYCLOAK_CLIENT_ID` / `KEYCLOAK_CLIENT_SECRET` | Portal client credentials |
| `KEYCLOAK_VALID_ISSUER` | Expected issuer claim when it differs from the browser URL |
| `INTERNAL_API_GENOMICS_SERVICE` | Server-to-server genomics API URL |
| `INTERNAL_KEYCLOAK_ISSUER` | Server-to-server Keycloak issuer for token, userinfo and JWKS calls |

`.env.example` documents the same-origin path defaults
(`PUBLIC_APIS_BASE_URL`, `PUBLIC_DOWNLOAD_URL`, `PUBLIC_UI_PAGE_*`).

## Project structure

```text
src/
├── pages/          Routes (admin, api, search, index)
├── components/     React and Astro UI
├── layouts/        Page layouts
├── states/         State management
├── styles/         Global CSS
└── utils/          URL/env helpers and API clients
src/middleware.ts   Session and version context
auth.config.mjs     Keycloak/Auth.js configuration
astro.config.mjs    SSR adapter and origin allowlist
```

## Deployment

Deploy through [`emobase-portal-deploy`](https://github.com/EMOBase/emobase-portal-deploy),
which runs the nginx entrypoint and sets the internal URLs for the portal
containers. Image tags and pinning are documented in that repository's
`.env.example`.

`security.allowedDomains` in `astro.config.mjs` is applied at build time. A
deployment host outside `**.uni-goettingen.de` needs an entry there and a
rebuilt image. Development conventions are in [AGENTS.md](AGENTS.md).
