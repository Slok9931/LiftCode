// API Types based on backend models
export interface User {
  id?: number;
  name: string;
  email: string;
  dob?: Date;
  weight?: number;
  height?: number;
  profile_pic?: string;
  profile_pic_public_id?: string;
  role: "gymmer" | "viewer";
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  dob?: string;
  weight?: number;
  height?: number;
  profile_pic?: string;
  profile_pic_public_id?: string;
  role: "gymmer" | "viewer";
}

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

export interface Set {
  id?: number;
  user_id: number;
  workout_session_id?: number;
  set_number: number;
  set_type: SetType;
  exercise_id: number;
  superset_exercise_id?: number;
  weight: WeightData;
  reps: RepsData;
  drop_weight?: number;
  drop_reps?: number;
  note?: string;
  completed?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface CreateSetDTO {
  user_id: number;
  workout_session_id?: number;
  set_number: number;
  set_type: SetType;
  exercise_id: number;
  superset_exercise_id?: number;
  weight: WeightData;
  reps: RepsData;
  drop_weight?: number;
  drop_reps?: number;
  note?: string;
  completed?: boolean;
}

export type SetType = "normal" | "dropset" | "superset";

export interface WeightData {
  primary: number;
  secondary?: number;
}

export interface RepsData {
  primary: number;
  secondary?: number;
}

export interface SetWithExercises extends Set {
  exercise?: {
    id: number;
    name: string;
    category: string;
  };
  superset_exercise?: {
    id: number;
    name: string;
    category: string;
  };
}

export interface WorkoutSession {
  id?: number;
  user_id: number;
  name?: string;
  date: Date;
  duration_minutes?: number;
  notes?: string;
  created_at?: Date;
  updated_at?: Date;
}

// API Response interfaces
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Filter interfaces
export interface ExerciseFilters {
  category?: ExerciseCategory;
  equipment?: ExerciseEquipment;
  difficulty?: DifficultyLevel;
  search?: string;
}

export interface UserWorkoutStats {
  totalSets: number;
  totalWorkouts: number;
  averageWorkoutDuration: number;
  totalVolumeLifted: number;
  favoriteExercises: Array<{
    exercise_name: string;
    exercise_id: number;
    total_sets: number;
  }>;
  recentActivity: Array<{
    date: string;
    sets_count: number;
    volume: number;
  }>;
}

// Form interfaces
export interface ExerciseFormData
  extends Omit<
    CreateExerciseDTO,
    "primary_muscles" | "secondary_muscles" | "instructions" | "tips"
  > {
  primary_muscles: string;
  secondary_muscles: string;
  instructions: string;
  tips: string;
}

export interface SetFormData {
  exercise_id: string;
  set_type: SetType;
  weight_primary: string;
  weight_secondary?: string;
  reps_primary: string;
  reps_secondary?: string;
  drop_weight?: string;
  drop_reps?: string;
  note?: string;
}
