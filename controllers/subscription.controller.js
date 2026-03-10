/**
 * Subscription controller – create subscription (and trigger reminder workflow) and list by user.
 */
import Subscription from '../models/subscription.model.js'
import { workflowClient } from '../config/upstash.js'
import { SERVER_URL } from '../config/env.js'

export const getAllSubscriptions = async (req, res, next) => {
  try {
    const subscriptions = await Subscription.find();
    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

export const getSubscriptionById = async (req, res, next) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      const error = new Error('Subscription not found');
      error.status = 404;
      throw error;
    }
    res.status(200).json({ success: true, data: subscription });
  } catch (e) {
    next(e);
  }
}

/**
 * Create a subscription for the authenticated user. Body should include name, price, frequency,
 * category, paymentMethod, startDate, etc. After saving, we trigger the Upstash workflow so
 * QStash will call our reminder endpoint at 7, 5, 2, and 1 days before renewal.
 */
export const createSubscription = async (req, res, next) => {
  try {
    const subscription = await Subscription.create({
      ...req.body,
      user: req.user._id,
    });

    const { workflowRunId } = await workflowClient.trigger({
      url: `${SERVER_URL}/api/v1/workflows/subscription/reminder`,
      body: {
        subscriptionId: subscription.id,
      },
      headers: {
        'content-type': 'application/json',
      },
      retries: 0,
    })

    res.status(201).json({ success: true, data: { subscription, workflowRunId } });
  } catch (e) {
    next(e);
  }
}

/** Return all subscriptions for the user id in the URL. Requires the JWT to belong to that same user. */
export const getUserSubscriptions = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscriptions = await Subscription.find({ user: req.params.id });

    res.status(200).json({ success: true, data: subscriptions });
  } catch (e) {
    next(e);
  }
}

export const updateSubscription = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      req.body,
      { new: true }
    );

    res.status(200).json({ success: true, data: subscription });
    
  } catch (e) {
    next(e)
  }
}

export const deleteSubscription = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    await Subscription.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    res.status(200).json({ success: true, data: {} });
    
  } catch (e) {
    next(e)
  }
}

export const cancelSubscription = async (req, res, next) => {
  try {
    // Check if the user is the same as the one in the token
    if(req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const subscription = await Subscription.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: 'cancelled' },
      { new: true }
    );

    res.status(200).json({ success: true, data: subscription });
    
  } catch (e) {
    next(e)
  }
}

export const getUpcomingRenewals = async (req, res, next) => {
  try {
    // Query for subscriptions with renewal dates within the next X days and return those.
    if (req.user.id !== req.params.id) {
      const error = new Error('You are not the owner of this account');
      error.status = 401;
      throw error;
    }

    const upcomingRenewals = await Subscription.find({
      user: req.user._id,
      renewalDate: { $gte: new Date(), $lte: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) } // next 7 days
    });
    
    res.status(200).json({ success: true, data: upcomingRenewals });
  } catch (e) {
    next(e);
  }
}