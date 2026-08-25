import userController from "../controllers/userController.js";
import express from "express";


const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/verify-register", userController.verifyRegisteredEmailAddress);
router.post("/login", userController.loginUser);
router.post("/resend-verification-email", userController.resendEmailVerification);


export default router;