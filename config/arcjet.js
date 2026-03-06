/**
 * Arcjet – request protection (DDoS shield, bot detection, rate limiting).
 * Used by arcjet.middleware on every request; denied requests get 429 or 403.
 */
import arcjet, { shield, detectBot, tokenBucket } from "@arcjet/node";
import { ARCJET_KEY } from './env.js'

const aj = arcjet({
  key: ARCJET_KEY,
  characteristics: ["ip.src"], // Identify clients by source IP for rate limiting
  rules: [
    shield({ mode: "LIVE" }),           // DDoS protection
    detectBot({
      mode: "LIVE",
      allow: [ "CATEGORY:SEARCH_ENGINE" ], // Allow search engine crawlers; block other bots
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