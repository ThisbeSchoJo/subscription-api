import { config } from 'dotenv';

config(options = { path: `.env.${process.env.NODE_ENV || 'development'}.local` });

export const { PORT, NODE_ENV, DB_URI, JWT_SECRET, JWT_EXPIRES_IN, ARCJET_ENV, ARCJET_KEY, QSTASH_URL, QSTASH_TOKEN, EMAIL_PASSORD } = process.env;