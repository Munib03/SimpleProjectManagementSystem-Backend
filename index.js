import "dotenv/config";
import healthCheckRoutes from "./src/routes/healthCheck.routes.js";
import userRouter from "./src/routes/userRoutes.js";
import express from "express";
const app = express();


app.use(express.json());


app.use("/api/v1/healthCheck", healthCheckRoutes);
app.use("/user", userRouter);

const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is runnign on port ${PORT}!`);
});