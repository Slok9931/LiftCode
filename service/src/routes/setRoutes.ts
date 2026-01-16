import { Router } from "express";
import {
  createSet,
  getSetById,
  getSetsByUserId,
  getSetsByExercise,
  getSetsByWorkoutSession,
  updateSet,
  deleteSet,
  getUserWorkoutStats,
  bulkCreateSets,
} from "../controllers/setController";
import {
  validateCreateSetMiddleware,
  validateUpdateSetMiddleware,
  validateBulkCreateSetsMiddleware,
} from "../middleware/validation";

const router = Router();

// Create a new set (with validation)
router.post("/", validateCreateSetMiddleware, createSet);

// Bulk create sets (with validation)
router.post("/bulk", validateBulkCreateSetsMiddleware, bulkCreateSets);

// Get set by ID
router.get("/:id", getSetById);

// Update a set (with validation)
router.put("/:id", validateUpdateSetMiddleware, updateSet);

// Delete a set
router.delete("/:id", deleteSet);

// Get sets by user ID
router.get("/user/:userId", getSetsByUserId);

// Get sets by exercise for a specific user
router.get("/user/:userId/exercise/:exerciseId", getSetsByExercise);

// Get sets by workout session
router.get("/session/:workoutSessionId", getSetsByWorkoutSession);

// Get user workout statistics
router.get("/user/:userId/stats", getUserWorkoutStats);

export default router;
