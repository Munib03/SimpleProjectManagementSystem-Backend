import "dotenv/config";
import healthCheckRoutes from "./routes/healthCheck.routes.js";
import express from "express";
const app = express();


app.use(express.json());


app.use("/api/v1/healthCheck", healthCheckRoutes);


const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
  console.log(`Server is runnign on port ${PORT}!`);
});