# Labby-dabby

AI-powered lab report analysis for patients. Web (Next.js) + Mobile (Expo) in a Turborepo monorepo.

## Quick start

```bash
npm install
```

### Web

```bash
npm run web
```

Create `.env.local` in `apps/web` with the variables from `docs/ENV.md`, then:

```bash
cd apps/web && npm run db:migrate
```

Configure a **Clerk webhook** pointing to `https://<your-domain>/api/webhooks/clerk` (or `ngrok` URL locally) with `user.created` / `user.updated`, and set `CLERK_WEBHOOK_SECRET` in `.env.local` so rows sync to the `users` table.

Regenerate favicons and Expo assets from design SVGs anytime:

```bash
npm run generate-assets
```

### Mobile

```bash
npm run mobile
```

Create `.env.local` in `apps/mobile` with `EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY` and `EXPO_PUBLIC_API_URL`. Icons are produced by `npm run generate-assets` into `apps/mobile/assets/`.

## Project structure

```
apps/
  web/      → Next.js 16, Clerk, Drizzle, NeonDB
  mobile/   → Expo, Clerk, NativeWind
packages/
  types/    → Shared TypeScript types
  utils/    → Shared utilities
```

## Documentation

- [PRD](docs/PRD.md) — Product requirements
- [Screens](docs/SCREENS.md) — Routes and screens
- [Data model](docs/DATA_MODEL.md) — Database schema
- [Tech stack](docs/TECH_STACK.md) — Technologies
- [Development flow](docs/DEVELOPMENT_FLOW.md) — Git branches, GitHub PRs, Vercel deploy
- [Contributing](docs/CONTRIBUTING.md) — How to contribute

## License

MIT
