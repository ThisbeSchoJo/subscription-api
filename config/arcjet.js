/**
 * Arcjet – request protection (DDoS shield, bot detection, rate limiting).
 * Used by arcjet.middleware on every request; denied requests get 429 or 403.
 * In development we use DRY_RUN for shield and detectBot so you can test without being blocked.
 */
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY, NODE_ENV } from './env.js';

const isDev = !NODE_ENV || NODE_ENV === "development";
const protectMode = isDev ? "DRY_RUN" : "LIVE";

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"], // Identify clients by source IP for rate limiting
  rules: [
    shield({ mode: protectMode }),           // DDoS protection
    detectBot({
      mode: protectMode,
      allow: [ "CATEGORY:SEARCH_ENGINE" ],   // Allow search engine crawlers; block other bots
    }),
    tokenBucket({
      mode: "LIVE",
      refillRate: 5,   // 5 tokens added per interval
      interval: 10,    // every 10 seconds
      capacity: 10,    // max 10 tokens per client
    }),
  ],
});

export default aj;