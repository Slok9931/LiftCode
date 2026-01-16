import { Router } from "express";
import userRoutes from "./userRoutes";

const router = Router();

// Health check endpoint
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "LiftCode API is running",
    timestamp: new Date().toISOString(),
  });
});

// User routes
router.use("/users", userRoutes);

export default router;
