# Development

## Run against the local Docker stack

Set up the stack first with the
[local development guide](https://github.com/EMOBase/emobase-docs/blob/main/DEVELOPMENT.md).
It starts the portal at `http://localhost:9080`, Keycloak at
`http://localhost:8181/keycloak` and the species site at
`http://localhost:9090`.

The dev server runs on the host, so keep `PUBLIC_SERVER` as the dev origin for
auth, and point the browser-facing URLs at the Docker portal:

```dotenv
PUBLIC_SERVER=http://localhost:4321

PUBLIC_APIS_BASE_URL=http://localhost:9080/api
PUBLIC_API_GENOMICS_SERVICE=http://localhost:9080/api/genomicsservice/v1
PUBLIC_DOWNLOAD_URL=http://localhost:9080/download/
PUBLIC_UI_PAGE_GENOMEBROWSER=http://localhost:9080/jbrowse/
PUBLIC_UI_PAGE_BLAST=http://localhost:9080/blast/
PUBLIC_UI_PAGE_API_DOC=http://localhost:9080/api/genomicsservice/v1/docs

AUTH_SECRET=<portal AUTH_SECRET>
AUTH_TRUST_HOST=true

KEYCLOAK_ISSUER=http://localhost:8181/keycloak/realms/<portal realm>
KEYCLOAK_CLIENT_ID=<portal client ID>
KEYCLOAK_CLIENT_SECRET=<portal client secret>
```

Read the Keycloak and auth values from the portal checkout's `.env`:

```bash
grep -E '^(AUTH_SECRET|KEYCLOAK_REALM|KEYCLOAK_CLIENT_ID|KEYCLOAK_CLIENT_SECRET)=' portal/.env
```

Leave `INTERNAL_*` unset for host-side development: they fall back to the
absolute `PUBLIC_*` URLs above, which the host can reach.

`localhost` is outside `security.allowedDomains`, so start the dev server with
the origin check disabled:

```bash
DISABLE_ORIGIN_CHECK=true npm run dev
```

Add the dev origin to the portal's Keycloak client once, so login redirects
back to the dev server:

```bash
cd infra
./scripts/allow-origin.sh \
  --realm <portal realm> \
  --client-id <portal client ID> \
  http://localhost:4321
```

If login still redirects to the Docker site, set
`AUTH_URL=http://localhost:4321` in `.env`.

BLAST submits through a first-party CSRF cookie, so a search started from the
`4321` dev origin may be rejected. Use the Docker portal's `/blast/` for BLAST
testing; JBrowse2 and the genomics API work from the dev server.

If you run this and the species dev server at the same time, give one of them a
second port (for example `4322`) and add that origin too.

## Other tasks

- `npm run check` type-checks the project.
- `npm run build` produces the production build.
- `npm run storybook` starts Storybook on port `6006`.
