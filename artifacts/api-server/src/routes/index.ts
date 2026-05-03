import { Router, type IRouter } from "express";
import healthRouter from "./health";
import portfolioRouter from "./portfolio";
import messagesRouter from "./messages";

const router: IRouter = Router();

router.use(healthRouter);
router.use(portfolioRouter);
router.use(messagesRouter);

export default router;
