# Repository guidance

## Development server

Start the dev server in background mode:

```sh
npm run dev -- --background
```

Manage it with `npx astro dev stop`, `npx astro dev status` and
`npx astro dev logs`.

Run `npm run check` before committing. `npm run build` catches SSR-only issues
that the dev server does not.

## Environment

- Copy `.env.example` to `.env` and fill `PUBLIC_SERVER`, the `KEYCLOAK_*`
  values and `AUTH_SECRET`.
- `localhost` is outside `security.allowedDomains`; start locally with
  `DISABLE_ORIGIN_CHECK=true npm run dev`. The flag is read when
  `astro.config.mjs` loads.
- Read URLs through `src/utils/env.ts` (`getEnv`, `getUrlEnv`,
  `getInternalUrl`) and `src/utils/url.ts`. Do not read `import.meta.env`
  directly in components.
- Server-side calls prefer `INTERNAL_*` values and fall back to the public URL.
  Keep that fallback when adding a service.

## Auth

- Keycloak runs through Auth.js in `auth.config.mjs`; the route is
  `src/pages/api/auth/[...auth].ts`.
- Server-side token, userinfo and JWKS requests use `INTERNAL_KEYCLOAK_ISSUER`
  when it is set.
- Use `getSession` from `@zitadel/astro-auth/server` as `src/middleware.ts`
  does; do not add a second auth path.

## Version context

`src/middleware.ts` resolves `?version=` and `VERSION_COOKIE_NAME`. A URL
parameter applies to that view only; do not write it into the cookie.

## Docs

- [README.md](README.md)
- [emobase-portal-deploy](https://github.com/EMOBase/emobase-portal-deploy)
- [Astro documentation](https://docs.astro.build)
