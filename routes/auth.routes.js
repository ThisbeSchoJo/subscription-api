/**
 * Auth routes – sign up (create user + JWT), sign in (JWT), sign out (stub).
 * All under /api/v1/auth. No auth middleware; these are the endpoints that issue tokens.
 */
import { Router } from "express";

import { signUp, signIn, signOut, refreshToken } from "../controllers/auth.controller.js";
// import { signUpLimiter, signInLimiter, signOutLimiter, refreshTokenLimiter } from "../middlewares/rateLimiter.middleware.js";
import { authLimiter, globalRateLimiter } from "../middlewares/rateLimiter.middleware.js";

const authRouter = Router();

const signUpLimiter = globalRateLimiter(authLimiter.signUp.time, authLimiter.signUp.limit, authLimiter.signUp.message);
const signInLimiter = globalRateLimiter(authLimiter.signIn.time, authLimiter.signIn.limit, authLimiter.signIn.message);
const signOutLimiter = globalRateLimiter(authLimiter.signOut.time, authLimiter.signOut.limit, authLimiter.signOut.message);
const refreshTokenLimiter = globalRateLimiter(authLimiter.refreshToken.time, authLimiter.refreshToken.limit, authLimiter.refreshToken.message);

// TODO: create a JSON object that contains four subobjects inside the object (authlimiter={signUp, signIn, signOut, refreshToken})
// ^^ for using global rate limiter
authRouter.post("/sign-up", signUpLimiter, signUp);
authRouter.post("/sign-in", signInLimiter, signIn);
authRouter.post("/sign-out", signOutLimiter, signOut);
authRouter.post("/refresh", refreshTokenLimiter, refreshToken);

export default authRouter;
