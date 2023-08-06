import { Router } from "express";
import { getMyUrls, logOut, signIn, signUp } from "../controllers/users.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { freeEmail, validateToken } from "../middlewares/validateUser.middleware.js";
import { signInSchema, signUpSchema } from "../schemas/users.schemas.js";

const usersRouter = Router();

usersRouter.post('/signup', validateSchema(signUpSchema), freeEmail,signUp);
usersRouter.post('/signin', validateSchema(signInSchema), signIn);
usersRouter.get('/users/me', validateToken, getMyUrls);
usersRouter.delete('/logout', validateToken, logOut)

export default usersRouter;