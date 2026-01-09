# Bridge47 Backend Template (NestJS)

This folder is the backend template used by the Bridge47 generator. It’s a NestJS + TypeORM API scaffold that’s meant to be copied/extended during generation.

## Requirements

- Node.js (recommended: latest LTS)
- MySQL (default) or another TypeORM-supported database

## Quick start

```bash
cd template-backend
cp .env.example .env
npm ci
npm run start:dev
```

The server binds to `127.0.0.1` and uses `PORT` from your `.env` (defaults to `7777` in `.env.example`).

## API routing & Swagger

- Global prefix: `/api`
- URI versioning: `/v1` (so endpoints look like `/api/v1/...`)

Swagger UI is available at:

`http://127.0.0.1:<PORT>/api/v1/doc?apiKey=<SWAGGER_X_KEY>`

Notes:

- The docs route is protected by the `apiKey` query param.
- Set `SWAGGER_X_KEY` in `.env`.

## Environment variables

See `.env.example` for the full list. Commonly used values:

- `PORT`
- `JWT_SECRET_KEY`, `JWT_EXPIRES_IN`
- `DATABASE_TYPE`, `DATABASE_HOST`, `DATABASE_PORT`, `DATABASE_USER`, `DATABASE_PASSWORD`, `DATABASE_NAME`
- Optional features: `REDIS_ENABLED`, `CLAMAV_ENABLED`

## Database & migrations (TypeORM)

The TypeORM data source is configured in `src/data-source.ts` and loads:

- Entities: `src/**/*.entity.ts`
- Migrations: `src/migrations/*`

Commands:

```bash
# Generate a migration (TypeORM v0.3 expects a path/name argument)
npm run migration:generate -- src/migrations/Init

# Apply migrations
npm run migration:run

# Revert last migration
npm run migration:revert
```

## Scripts

```bash
npm run start        # start
npm run start:dev    # watch mode
npm run build        # compile to dist/
npm run start:prod   # run compiled app

npm run lint
npm run format
npm run test
npm run test:e2e
npm run test:cov
```

## File uploads (default behavior)

Uploads use Multer with a custom storage engine:

- Stores files under `./uploads/` (created on demand)
- Uses a random UUID for the stored filename
- Default limit is ~40MB per file

## Notes for generator usage

If you’re consuming this via Bridge47, treat this folder as the “golden template”:

- Add shared modules, base services, interceptors/filters, etc.
- The generator can copy and augment these sources when creating a new backend.
