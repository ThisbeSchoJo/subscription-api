/**
 * Workflow routes – called by Upstash QStash when scheduled steps run.
 * POST /api/v1/workflows/subscription/reminder receives the workflow payload (subscriptionId)
 * and runs the reminder logic (sleep until 7/5/2/1 days before renewal, then send email).
 */
import { Router} from 'express';
import { sendReminders, updateReminder, deleteReminder } from '../controllers/workflow.controller.js'

const workflowRouter = Router();

workflowRouter.post('/subscription/reminder', sendReminders);

// TODO: Implement other workflows (delete, update, etc.) (DONE)
workflowRouter.post('/subscription/update-reminder', updateReminder);

workflowRouter.post('/subscription/delete-reminder', deleteReminder);
export default workflowRouter;