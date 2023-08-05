import { Router } from "express";
import urlsRouter from "./urls.routes.js";
import usersRouter from "./users.routes.js";

const router = Router();

router.use(usersRouter);
router.use(urlsRouter)

export default router;