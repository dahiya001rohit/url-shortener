import { Router } from "express";
import { getProfile, updateProfile, changePassword, deleteAccount, exportData } from "../controllers/userController.js";
import { authenticate } from "../middleware/auth.js";

const router = Router();

router.get("/profile", authenticate, getProfile);
router.patch("/profile", authenticate, updateProfile);
router.patch("/password", authenticate, changePassword);
router.delete("/account", authenticate, deleteAccount);
router.get("/export", authenticate, exportData);

export default router;
