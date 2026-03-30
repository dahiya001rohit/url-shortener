import { Router } from "express";
import { shortenUrl, getMyUrls, deleteUrl } from "../controllers/urlController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.post("/shorten", authenticate, shortenUrl);
router.get("/my-urls", authenticate, getMyUrls);
router.delete("/:id", authenticate, deleteUrl);

export default router;
