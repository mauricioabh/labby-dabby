import { config } from 'dotenv';
import { resolve } from 'path';
import { defineConfig } from 'drizzle-kit';

// Load .env and .env.local when running drizzle-kit (CLI doesn't use Next.js env loading)
config({ path: resolve(__dirname, '.env') });
config({ path: resolve(__dirname, '.env.local') });

export default defineConfig({
  schema: './src/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
});
