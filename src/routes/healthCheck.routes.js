import healthCheckController from "../controllers/healthCheck.controller.js";
import express from "express";


const router = express.Router();

router.get("/", healthCheckController.healthCheck);


export default router;