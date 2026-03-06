/**
 * Environment config – loads .env from .env.<NODE_ENV>.local and re-exports variables.
 * Default NODE_ENV is 'development' so local dev uses .env.development.local.
 */
import { config } from 'dotenv';

config({ path: `.env.${process.env.NODE_ENV || 'development'}.local` });

// Re-export env vars used across the app (server, DB, JWT, Arcjet, QStash, email)
export const {
  PORT, NODE_ENV, SERVER_URL,
  DB_URI,
  JWT_SECRET, JWT_EXPIRES_IN,
  ARCJET_ENV, ARCJET_KEY,
  QSTASH_TOKEN, QSTASH_URL,
  EMAIL_PASSWORD,
} = process.env;