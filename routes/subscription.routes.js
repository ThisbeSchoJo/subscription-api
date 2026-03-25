/**
 * Subscription routes – under /api/v1/subscriptions.
 * Create and get-by-user are implemented and require auth (authorize); others are stubs.
 */
import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  getAllSubscriptions,
  getSubscriptionById,
  createSubscription,
  getUserSubscriptions,
  updateSubscription,
  deleteSubscription,
  cancelSubscription,
  getUpcomingRenewals
} from "../controllers/subscription.controller.js";
import { 
  getAllSubscriptionsLimiter,
  getSubscriptionByIdLimiter,
  createSubscriptionLimiter, 
  updateSubscriptionLimiter, 
  deleteSubscriptionLimiter, 
  getUserSubscriptionsLimiter,
  cancelSubscriptionLimiter, 
  getUpcomingRenewalsLimiter 
} from "../middlewares/rateLimiter.middleware.js";
const subscriptionRouter = Router();

// TODO: should not be able to create, delete, update a lot of subscriptions at one time (implement ratelimiter middleware) (5-10 limit) (DONE)
// TODO: GET actions -  rate limits can be higher (20-50)
subscriptionRouter.get("/", authorize, getAllSubscriptionsLimiter, getAllSubscriptions);

subscriptionRouter.get("/:id", authorize, getSubscriptionByIdLimiter, getSubscriptionById);

subscriptionRouter.post("/", authorize, createSubscriptionLimiter, createSubscription);

subscriptionRouter.put("/:id", authorize, updateSubscriptionLimiter, updateSubscription);

subscriptionRouter.delete("/:id", authorize, deleteSubscriptionLimiter, deleteSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptionsLimiter, getUserSubscriptions);

subscriptionRouter.put("/:id/cancel", authorize, cancelSubscriptionLimiter, cancelSubscription);

subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewalsLimiter, getUpcomingRenewals);

export default subscriptionRouter;
