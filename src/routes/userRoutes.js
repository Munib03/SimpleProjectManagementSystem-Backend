import userController from "../controllers/userController.js";
import express from "express";


const router = express.Router();

router.post("/register", userController.registerUser);
router.post("/verify-register", userController.verifyRegisteredEmailAddress);

export default router;