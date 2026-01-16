import { Request, Response } from "express";
import exerciseService from "../services/exerciseService";
import { CreateExerciseDTO, UpdateExerciseDTO } from "../models/Exercise";

export const getAllExercises = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { category, equipment, difficulty, search } = req.query;

    let exercises;

    if (search) {
      exercises = await exerciseService.searchExercises(search as string);
    } else if (category) {
      exercises = await exerciseService.getExercisesByCategory(category as any);
    } else if (equipment) {
      exercises = await exerciseService.getExercisesByEquipment(
        equipment as any
      );
    } else if (difficulty) {
      exercises = await exerciseService.getExercisesByDifficulty(
        difficulty as any
      );
    } else {
      exercises = await exerciseService.getAllExercises();
    }

    res.status(200).json({
      success: true,
      data: exercises,
      count: exercises.length,
    });
  } catch (error) {
    console.error("Error fetching exercises:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getExerciseById = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const exerciseId = parseInt(id);

    if (isNaN(exerciseId)) {
      res.status(400).json({
        success: false,
        message: "Invalid exercise ID",
      });
      return;
    }

    const exercise = await exerciseService.getExerciseById(exerciseId);

    if (!exercise) {
      res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: exercise,
    });
  } catch (error) {
    console.error("Error fetching exercise:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createExercise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const exerciseData: CreateExerciseDTO = req.body;

    // Basic validation
    if (
      !exerciseData.name ||
      !exerciseData.category ||
      !exerciseData.difficulty_level ||
      !exerciseData.primary_muscles
    ) {
      res.status(400).json({
        success: false,
        message:
          "Missing required fields: name, category, difficulty_level, and primary_muscles are required",
      });
      return;
    }

    if (
      !Array.isArray(exerciseData.primary_muscles) ||
      exerciseData.primary_muscles.length === 0
    ) {
      res.status(400).json({
        success: false,
        message: "primary_muscles must be a non-empty array",
      });
      return;
    }

    const exercise = await exerciseService.createExercise(exerciseData);

    res.status(201).json({
      success: true,
      message: "Exercise created successfully",
      data: exercise,
    });
  } catch (error) {
    console.error("Error creating exercise:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const updateExercise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const exerciseId = parseInt(id);

    if (isNaN(exerciseId)) {
      res.status(400).json({
        success: false,
        message: "Invalid exercise ID",
      });
      return;
    }

    const exerciseData: UpdateExerciseDTO = req.body;

    if (Object.keys(exerciseData).length === 0) {
      res.status(400).json({
        success: false,
        message: "No fields to update",
      });
      return;
    }

    const exercise = await exerciseService.updateExercise(
      exerciseId,
      exerciseData
    );

    if (!exercise) {
      res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Exercise updated successfully",
      data: exercise,
    });
  } catch (error) {
    console.error("Error updating exercise:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteExercise = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { id } = req.params;
    const exerciseId = parseInt(id);

    if (isNaN(exerciseId)) {
      res.status(400).json({
        success: false,
        message: "Invalid exercise ID",
      });
      return;
    }

    const deleted = await exerciseService.deleteExercise(exerciseId);

    if (!deleted) {
      res.status(404).json({
        success: false,
        message: "Exercise not found",
      });
      return;
    }

    res.status(200).json({
      success: true,
      message: "Exercise deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting exercise:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getExerciseStats = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const stats = await exerciseService.getExerciseStats();

    res.status(200).json({
      success: true,
      data: stats,
    });
  } catch (error) {
    console.error("Error fetching exercise statistics:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
