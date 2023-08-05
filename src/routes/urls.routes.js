import { Router } from "express";
import { deleteUrl, getRanking, getUrlById, postUrl, redirectUrl } from "../controllers/urls.controllers.js";
import { validateSchema } from "../middlewares/validateSchema.middleware.js";
import { validateOwner, validateToken } from "../middlewares/validateUser.middleware.js";
import { urlSchema } from "../schemas/urls.schema.js";

const urlsRouter = Router();

urlsRouter.post('/urls/shorten', validateToken, validateSchema(urlSchema),postUrl);
urlsRouter.get('/urls/:id', getUrlById)
urlsRouter.get('/urls/open/:shortUrl', redirectUrl);
urlsRouter.delete('/urls/:id', validateToken, validateOwner, deleteUrl);
urlsRouter.get('/ranking', getRanking);

export default urlsRouter;