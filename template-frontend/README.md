# Bridge47 Frontend Template (Quasar / Vue 3)

This folder is the frontend template used by the Bridge47 generator. It’s a Quasar (Vue 3) app configured with Vite, Axios bootstrapping, and i18n.

## Requirements

- Node.js (recommended: latest LTS)

## Quick start

```bash
cd template-frontend
npm ci
npm run dev
```

The dev server opens a browser window automatically.

## Environment variables (Vite)

This template expects the API base URL via Vite env vars.

Create a `.env` file in this folder (or export env vars in your shell) and set:

```bash
VITE_API_URL="http://127.0.0.1:7777/api/v1"
VITE_APP_VERSION="dev"
```

Notes:

- `VITE_API_URL` should include the backend prefix + version (`/api/v1`) so calls like `GET /users` become `.../api/v1/users`.
- Axios interceptors add headers like `X-RAY-ID`, `X-FINGERPRINT`, `accept-language`, `app-version`, and `Authorization` when a token exists.

## Scripts

```bash
npm run dev      # quasar dev
npm run build    # quasar build
npm run lint
npm run format
```

## Configuration pointers

- Quasar config: `quasar.config.ts`
- Boot files: `src/boot/config.ts`, `src/boot/i18n.ts`, `src/boot/axios.ts`
- API helpers: `src/util/ApiUtil.ts`

## Notes for generator usage

If you’re consuming this via Bridge47, treat this folder as the “golden template”:

- Add shared layouts/components, auth flows, and styling here.
- The generator can copy and extend these sources when creating a new frontend.
