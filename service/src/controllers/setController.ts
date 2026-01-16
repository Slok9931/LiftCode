import { Request, Response } from "express";
import { SetService } from "../services/setService";
import { CreateSetDTO, UpdateSetDTO } from "../models/Set";
import database from "../config/database";

const setService = new SetService(database.getPool());

// Create a new set
export const createSet = async (req: Request, res: Response) => {
  try {
    const setData: CreateSetDTO = req.body;
    const newSet = await setService.createSet(setData);
    res.status(201).json({
      success: true,
      message: "Set created successfully",
      data: newSet,
    });
  } catch (error) {
    console.error("Error creating set:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create set",
      data: null,
    });
  }
};

// Get set by ID
export const getSetById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const set = await setService.getSetById(parseInt(id));

    if (!set) {
      return res.status(404).json({
        success: false,
        message: "Set not found",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Set retrieved successfully",
      data: set,
    });
  } catch (error) {
    console.error("Error getting set:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve set",
      data: null,
    });
  }
};

// Get sets by user ID
export const getSetsByUserId = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { limit = "50", offset = "0" } = req.query;

    const sets = await setService.getSetsByUserId(
      parseInt(userId),
      parseInt(limit as string),
      parseInt(offset as string)
    );

    res.json({
      success: true,
      message: "Sets retrieved successfully",
      data: sets,
      pagination: {
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
        count: sets.length,
      },
    });
  } catch (error) {
    console.error("Error getting sets by user:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve sets",
      data: null,
    });
  }
};

// Get sets by exercise
export const getSetsByExercise = async (req: Request, res: Response) => {
  try {
    const { userId, exerciseId } = req.params;
    const { limit = "20" } = req.query;

    const sets = await setService.getSetsByExercise(
      parseInt(userId),
      parseInt(exerciseId),
      parseInt(limit as string)
    );

    res.json({
      success: true,
      message: "Exercise sets retrieved successfully",
      data: sets,
    });
  } catch (error) {
    console.error("Error getting sets by exercise:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve exercise sets",
      data: null,
    });
  }
};

// Get sets by workout session
export const getSetsByWorkoutSession = async (req: Request, res: Response) => {
  try {
    const { workoutSessionId } = req.params;
    const sets = await setService.getSetsByWorkoutSession(
      parseInt(workoutSessionId)
    );

    res.json({
      success: true,
      message: "Workout session sets retrieved successfully",
      data: sets,
    });
  } catch (error) {
    console.error("Error getting sets by workout session:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve workout session sets",
      data: null,
    });
  }
};

// Update a set
export const updateSet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData: UpdateSetDTO = req.body;

    const updatedSet = await setService.updateSet(parseInt(id), updateData);

    if (!updatedSet) {
      return res.status(404).json({
        success: false,
        message: "Set not found",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Set updated successfully",
      data: updatedSet,
    });
  } catch (error) {
    console.error("Error updating set:", error);
    res.status(400).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to update set",
      data: null,
    });
  }
};

// Delete a set
export const deleteSet = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const deleted = await setService.deleteSet(parseInt(id));

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Set not found",
        data: null,
      });
    }

    res.json({
      success: true,
      message: "Set deleted successfully",
      data: null,
    });
  } catch (error) {
    console.error("Error deleting set:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete set",
      data: null,
    });
  }
};

// Get user workout statistics
export const getUserWorkoutStats = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { days = "30" } = req.query;

    const stats = await setService.getUserWorkoutStats(
      parseInt(userId),
      parseInt(days as string)
    );

    res.json({
      success: true,
      message: "Workout statistics retrieved successfully",
      data: {
        ...stats,
        period_days: parseInt(days as string),
      },
    });
  } catch (error) {
    console.error("Error getting workout stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to retrieve workout statistics",
      data: null,
    });
  }
};

// Bulk create sets (useful for workout sessions)
export const bulkCreateSets = async (req: Request, res: Response) => {
  try {
    const { sets }: { sets: CreateSetDTO[] } = req.body;

    if (!Array.isArray(sets) || sets.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Sets array is required and cannot be empty",
        data: null,
      });
    }

    const createdSets = [];
    const errors = [];

    for (let i = 0; i < sets.length; i++) {
      try {
        const set = await setService.createSet(sets[i]);
        createdSets.push(set);
      } catch (error) {
        errors.push({
          index: i,
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    res.status(createdSets.length > 0 ? 201 : 400).json({
      success: createdSets.length > 0,
      message: `${createdSets.length} sets created successfully${
        errors.length > 0 ? `, ${errors.length} failed` : ""
      }`,
      data: {
        created: createdSets,
        errors: errors,
      },
    });
  } catch (error) {
    console.error("Error bulk creating sets:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create sets",
      data: null,
    });
  }
};
