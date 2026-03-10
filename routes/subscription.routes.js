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

const subscriptionRouter = Router();

// TODO: DONE
subscriptionRouter.get("/", authorize, getAllSubscriptions);

// TODO: DONE
subscriptionRouter.get("/:id", authorize, getSubscriptionById);

subscriptionRouter.post("/", authorize, createSubscription);

// TODO: DONE
subscriptionRouter.put("/:id", authorize, updateSubscription);

// TODO: DONE
subscriptionRouter.delete("/:id", authorize, deleteSubscription);

subscriptionRouter.get("/user/:id", authorize, getUserSubscriptions);

// TODO: DONE
subscriptionRouter.put("/:id/cancel", authorize, cancelSubscription);

// TODO: DONE
subscriptionRouter.get("/upcoming-renewals", authorize, getUpcomingRenewals);

export default subscriptionRouter;
