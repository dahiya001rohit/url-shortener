import { Router } from "express";
import { getUrlAnalytics } from "../controllers/analyticsController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/:shortCode", authenticate, getUrlAnalytics);

export default router;
