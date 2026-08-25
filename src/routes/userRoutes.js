import userController from "../controllers/userController.js";
import { rateLimiter } from "../middlewares/rateLimitMiddleware.js"; 
import express from "express";


const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/verify-register", rateLimiter(), userController.verifyRegisteredEmailAddress);
router.post("/login", userController.loginUser);

export default router;