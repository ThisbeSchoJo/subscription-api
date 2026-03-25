import { rateLimit } from 'express-rate-limit';

export const signUpLimiter = rateLimit({

  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: "Too many requests, please try again later.",
});

export const signInLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 2,
  message: "Too many requests, please try again later.",
});

export const signOutLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: "Too many requests, please try again later.",
});

export const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 5,
  message: "Too many requests, please try again later.",
});

export const getAllSubscriptionsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: "Too many requests, please try again later.",
});

export const getSubscriptionByIdLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: "Too many requests, please try again later.",
});

export const createSubscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: "Too many requests, please try again later.",
});

export const updateSubscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: "Too many requests, please try again later.",
});

export const deleteSubscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: "Too many requests, please try again later.",
});

export const getUserSubscriptionsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: "Too many requests, please try again later.",
});

export const cancelSubscriptionLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: "Too many requests, please try again later.",
});

export const getUpcomingRenewalsLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: "Too many requests, please try again later.",
});

export const getUsersLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 20,
  message: "Too many requests, please try again later.",
});

export const getUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: "Too many requests, please try again later.",
});

export const createUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: "Too many requests, please try again later.",
});

export const updateUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: "Too many requests, please try again later.",
});

export const deleteUserLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: "Too many requests, please try again later.",
});

export const sendRemindersLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: "Too many requests, please try again later.",
});

export const updateReminderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: "Too many requests, please try again later.",
});

export const deleteReminderLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  limit: 10,
  message: "Too many requests, please try again later.",
});

export const authLimiter = {
  signUp: {
    limit: 5,
    time: 15 * 60 * 1000, // 15 minutes
    message: "Too many sign up requests, please try again later.",
  },
  signIn: {
    limit: 2,
    time: 15 * 60 * 1000, // 15 minutes
    message: "Too many sign in requests, please try again later.",
  },
  signOut: {
    limit: 5,
    time: 15 * 60 * 1000, // 15 minutes
    message: "Too many sign out requests, please try again later.",
  },
  refreshToken: {
    limit: 5,
    time: 15 * 60 * 1000, // 15 minutes
    message: "Too many refresh token requests, please try again later.",
  },
}

export const globalRateLimiter = (time, limit, message) => rateLimit({
  windowMs: time,
  limit: limit,
  message: message,
});