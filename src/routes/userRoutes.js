import userController from "../controllers/userController.js";
import express from "express";


const router = express.Router();

router.post("/register", userController.registerUser);

export default router;