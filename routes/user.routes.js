/**
 * User routes – under /api/v1/users. List all users (no auth) and get one by id (auth). Others stubs.
 */
import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js'
import { inputValidationMiddleware } from '../middlewares/inputvalidation.middleware.js'
import { getUser, getUsers, createUser, updateUser, deleteUser } from '../controllers/user.controller.js'

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);

//FIXME: Implement/fix create user
userRouter.post('/', inputValidationMiddleware, createUser);

//TODO: Implement update user (only allow user to update their own account, check in controller) (DONE)
userRouter.put('/:id', authorize, updateUser);

//TODO: Implement delete user (only allow user to delete their own account, check in controller) (DONE)
userRouter.delete('/:id', authorize, deleteUser);

export default userRouter;