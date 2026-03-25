/**
 * User routes – under /api/v1/users. List all users (no auth) and get one by id (auth). Others stubs.
 */
import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js'
import { inputValidationMiddleware } from '../middlewares/inputvalidation.middleware.js'
import { getUser, getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js'
import { getUsersLimiter, getUserLimiter, createUserLimiter, updateUserLimiter, deleteUserLimiter } from '../middlewares/rateLimiter.middleware.js';

const userRouter = Router();

//TODO: rate limiter should be high (20-50) (DONE)
userRouter.get('/', getUsersLimiter, getUsers);

//TODO: rate limiter should be high (10-20) (DONE)
userRouter.get('/:id', authorize, getUserLimiter, getUser);

//TODO: rate limiter lower (5-10) (DONE)
userRouter.post('/', inputValidationMiddleware, createUserLimiter, createUser);

//TODO: rate limiter lower (5-10) (DONE)
userRouter.put('/:id', authorize, updateUserLimiter, updateUser);

//TODO: rate limiter lower (5-10) (DONE)
userRouter.delete('/:id', authorize, deleteUserLimiter, deleteUser);

export default userRouter;