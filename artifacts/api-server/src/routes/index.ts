import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioRouter from "./portfolio";
import messagesRouter from "./messages";
import bootstrapRouter from "./bootstrap";

const router: IRouter = Router();

router.use(healthRouter);
router.use(portfolioRouter);
router.use(messagesRouter);
router.use(bootstrapRouter);

export default router;
