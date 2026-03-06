/**
 * Upstash Workflow client – used to trigger scheduled reminder workflows.
 * When a subscription is created, we call workflowClient.trigger() with our
 * workflow URL; QStash then invokes that URL at the scheduled times (e.g. 7, 5, 2, 1 days before renewal).
 */
import { Client as WorkflowClient } from '@upstash/workflow';

import { QSTASH_TOKEN, QSTASH_URL } from './env.js';

export const workflowClient = new WorkflowClient({
  baseUrl: QSTASH_URL,
  token: QSTASH_TOKEN,
});