import { Router } from "express";
import userRoutes from "./userRoutes";
import exerciseRoutes from "./exerciseRoutes";

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

// Exercise routes
router.use("/exercises", exerciseRoutes);

export default router;
