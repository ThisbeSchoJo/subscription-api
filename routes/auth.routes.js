/**
 * Auth routes – sign up (create user + JWT), sign in (JWT), sign out (stub).
 * All under /api/v1/auth. No auth middleware; these are the endpoints that issue tokens.
 */
import { Router } from "express";

import { signUp, signIn, signOut } from "../controllers/auth.controller.js";

const authRouter = Router();

authRouter.post("/sign-up", signUp);
authRouter.post("/sign-in", signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;
