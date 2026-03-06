/**
 * User routes – under /api/v1/users. List all users (no auth) and get one by id (auth). Others stubs.
 */
import { Router } from 'express';

import authorize from '../middlewares/auth.middleware.js'
import { getUser, getUsers } from '../controllers/user.controller.js'

const userRouter = Router();

userRouter.get('/', getUsers);

userRouter.get('/:id', authorize, getUser);

userRouter.post('/', (req, res) => res.send({ title: 'CREATE new user' }));

userRouter.put('/:id', (req, res) => res.send({ title: 'UPDATE user' }));

userRouter.delete('/:id', (req, res) => res.send({ title: 'DELETE user' }));

export default userRouter;