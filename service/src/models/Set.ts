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

export interface UpdateSetDTO {
  workout_session_id?: number;
  set_number?: number;
  set_type?: SetType;
  exercise_id?: number;
  superset_exercise_id?: number;
  weight?: WeightData;
  reps?: RepsData;
  drop_weight?: number;
  drop_reps?: number;
  note?: string;
  completed?: boolean;
}

// Set types
export type SetType = "normal" | "dropset" | "superset";

// Weight data structure
export interface WeightData {
  primary: number; // Weight for primary exercise
  secondary?: number; // Weight for secondary exercise (superset only)
}

// Reps data structure
export interface RepsData {
  primary: number; // Reps for primary exercise
  secondary?: number; // Reps for secondary exercise (superset only)
}

// Extended Set interface with exercise details (for API responses)
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

// Workout session interface (optional for grouping sets)
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

// Helper type for set validation
export interface SetValidation {
  isValid: boolean;
  errors: string[];
}

// Common set templates for quick creation
export const SET_TEMPLATES = {
  normal: (
    exercise_id: number,
    weight: number,
    reps: number
  ): Partial<CreateSetDTO> => ({
    set_type: "normal",
    exercise_id,
    weight: { primary: weight },
    reps: { primary: reps },
  }),

  dropset: (
    exercise_id: number,
    initialWeight: number,
    initialReps: number,
    dropWeight: number,
    dropReps: number
  ): Partial<CreateSetDTO> => ({
    set_type: "dropset",
    exercise_id,
    weight: { primary: initialWeight },
    reps: { primary: initialReps },
    drop_weight: dropWeight,
    drop_reps: dropReps,
  }),

  superset: (
    exercise1_id: number,
    exercise2_id: number,
    weight1: number,
    weight2: number,
    reps1: number,
    reps2: number
  ): Partial<CreateSetDTO> => ({
    set_type: "superset",
    exercise_id: exercise1_id,
    superset_exercise_id: exercise2_id,
    weight: { primary: weight1, secondary: weight2 },
    reps: { primary: reps1, secondary: reps2 },
  }),
} as const;
