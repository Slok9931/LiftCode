export interface Exercise {
  id?: number;
  name: string;
  description?: string;
  photo?: string;
  photo_public_id?: string;
  category: ExerciseCategory;
  equipment?: ExerciseEquipment;
  difficulty_level: DifficultyLevel;
  primary_muscles: string[];
  secondary_muscles?: string[];
  instructions?: string[];
  tips?: string[];
  is_active?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateExerciseDTO {
  name: string;
  description?: string;
  photo?: string;
  photo_public_id?: string;
  category: ExerciseCategory;
  equipment?: ExerciseEquipment;
  difficulty_level: DifficultyLevel;
  primary_muscles: string[];
  secondary_muscles?: string[];
  instructions?: string[];
  tips?: string[];
  is_active?: boolean;
}

export interface UpdateExerciseDTO {
  name?: string;
  description?: string;
  photo?: string;
  photo_public_id?: string;
  category?: ExerciseCategory;
  equipment?: ExerciseEquipment;
  difficulty_level?: DifficultyLevel;
  primary_muscles?: string[];
  secondary_muscles?: string[];
  instructions?: string[];
  tips?: string[];
  is_active?: boolean;
}

export type ExerciseCategory =
  | "chest"
  | "back"
  | "shoulders"
  | "biceps"
  | "triceps"
  | "legs"
  | "core"
  | "cardio"
  | "full_body";

export type ExerciseEquipment =
  | "barbell"
  | "dumbbell"
  | "machine"
  | "cable"
  | "bodyweight"
  | "resistance_band"
  | "kettlebell"
  | "other";

export type DifficultyLevel = "beginner" | "intermediate" | "advanced";

// Common muscle groups for reference
export const MUSCLE_GROUPS = [
  "chest",
  "triceps",
  "shoulders",
  "biceps",
  "forearms",
  "upper_back",
  "lats",
  "lower_back",
  "abs",
  "obliques",
  "glutes",
  "quadriceps",
  "hamstrings",
  "calves",
  "cardio",
] as const;

export type MuscleGroup = (typeof MUSCLE_GROUPS)[number];
