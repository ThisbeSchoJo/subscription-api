/**
 * Workflow controller – Upstash workflow handler for subscription reminders.
 * QStash calls this endpoint when a subscription is created; we schedule steps for 7, 5, 2, and 1
 * days before renewal. Each step sleeps until the right day, then sends a reminder email.
 */
import dayjs from 'dayjs'
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { serve } = require("@upstash/workflow/express");
import Subscription from '../models/subscription.model.js';
import { sendReminderEmail } from '../utils/send-email.js'

/** Days before renewal to send a reminder (e.g. 7, 5, 2, 1). */
const REMINDERS = [7, 5, 2, 1]

/**
 * Workflow entry: receive subscriptionId, load subscription, then for each reminder day either
 * sleep until that date (context.sleepUntil) or, if we're already on that day, send the email.
 * context.run() makes each step durable so QStash can replay/resume.
 */
export const sendReminders = serve(async (context) => {
  const { subscriptionId } = context.requestPayload;
  const subscription = await fetchSubscription(context, subscriptionId);

  if(!subscription || subscription.status !== 'active') return;

  const renewalDate = dayjs(subscription.renewalDate);

  if(renewalDate.isBefore(dayjs())) {
    console.log(`Renewal date has passed for subscription ${subscriptionId}. Stopping workflow.`);
    return;
  }

  for (const daysBefore of REMINDERS) {
    const reminderDate = renewalDate.subtract(daysBefore, 'day');

    if(reminderDate.isAfter(dayjs())) {
      await sleepUntilReminder(context, `Reminder ${daysBefore} days before`, reminderDate);
    }

    if (dayjs().isSame(reminderDate, 'day')) {
      await triggerReminder(context, `${daysBefore} days before reminder`, subscription);
    }
  }
});

/** Load subscription by id with user populated (name, email) for the reminder email. */
export const fetchSubscription = async (context, subscriptionId) => {
  return await context.run('get subscription', async () => {
    return Subscription.findById(subscriptionId).populate('user', 'name email');
  })
}

/** Tell QStash to wake this workflow at the given date – no server polling required. */
export const sleepUntilReminder = async (context, label, date) => {
  console.log(`Sleeping until ${label} reminder at ${date}`);
  await context.sleepUntil(label, date.toDate());
}

/** Run the reminder step: send email via Nodemailer using the template that matches the label. */
export const triggerReminder = async (context, label, subscription) => {
  return await context.run(label, async () => {
    console.log(`Triggering ${label} reminder`);

    await sendReminderEmail({
      to: subscription.user.email,
      type: label,
      subscription,
    })
  })
}

export const updateReminder = async (context, label, subscription) => {
// TODO: Implement update reminder workflow step, which will be triggered when a subscription is updated (e.g. renewal date changes). This should update the scheduled reminders in QStash to match the new renewal date.
}

export const deleteReminder = async (context, label, subscription) => {
// TODO: Implement delete reminder workflow step, which will be triggered when a subscription is cancelled or deleted. This should remove any scheduled reminders in QStash for that subscription.
}
