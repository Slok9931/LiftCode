import { Router } from "express";
import {
  getAllExercises,
  getExerciseById,
  createExercise,
  updateExercise,
  deleteExercise,
  getExerciseStats,
} from "../controllers/exerciseController";

const router = Router();

// GET /api/exercises/stats - Get exercise statistics
router.get("/stats", getExerciseStats);

// GET /api/exercises - Get all exercises (with optional filters)
// Query params: ?category=chest&equipment=dumbbell&difficulty=beginner&search=push
router.get("/", getAllExercises);

// GET /api/exercises/:id - Get exercise by ID
router.get("/:id", getExerciseById);

// POST /api/exercises - Create new exercise
router.post("/", createExercise);

// PUT /api/exercises/:id - Update exercise
router.put("/:id", updateExercise);

// DELETE /api/exercises/:id - Delete exercise (soft delete)
router.delete("/:id", deleteExercise);

export default router;
