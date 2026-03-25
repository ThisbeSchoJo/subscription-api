/**
 * Workflow routes – called by Upstash QStash when scheduled steps run.
 * POST /api/v1/workflows/subscription/reminder receives the workflow payload (subscriptionId)
 * and runs the reminder logic (sleep until 7/5/2/1 days before renewal, then send email).
 */
import { Router} from 'express';
import { sendReminders, updateReminder, deleteReminder } from '../controllers/workflow.controller.js'
import { sendRemindersLimiter, updateReminderLimiter, deleteReminderLimiter } from '../middlewares/rateLimiter.middleware.js';

const workflowRouter = Router();

//TODO: ratelimiter (10-30) (DONE)
workflowRouter.post('/subscription/reminder', sendRemindersLimiter, sendReminders);

//TODO: ratelimiter (5-10) (DONE)
workflowRouter.post('/subscription/update-reminder', updateReminderLimiter, updateReminder);

//TODO: ratelimiter (5-10) (DONE)
workflowRouter.post('/subscription/delete-reminder', deleteReminderLimiter, deleteReminder);
export default workflowRouter;