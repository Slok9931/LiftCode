import { ExerciseCategory, ExerciseEquipment, DifficultyLevel } from "./types";

// Exercise categories with display names
export const EXERCISE_CATEGORIES: {
  value: ExerciseCategory;
  label: string;
  icon: string;
}[] = [
  { value: "chest", label: "Chest", icon: "💪" },
  { value: "back", label: "Back", icon: "🏋️" },
  { value: "shoulders", label: "Shoulders", icon: "🤸" },
  { value: "biceps", label: "Biceps", icon: "💪" },
  { value: "triceps", label: "Triceps", icon: "💪" },
  { value: "legs", label: "Legs", icon: "🦵" },
  { value: "core", label: "Core", icon: "🔥" },
  { value: "cardio", label: "Cardio", icon: "❤️" },
  { value: "full_body", label: "Full Body", icon: "🏃" },
];

// Equipment types with display names
export const EQUIPMENT_TYPES: {
  value: ExerciseEquipment;
  label: string;
  icon: string;
}[] = [
  { value: "barbell", label: "Barbell", icon: "🏋️‍♂️" },
  { value: "dumbbell", label: "Dumbbell", icon: "🏋️‍♀️" },
  { value: "machine", label: "Machine", icon: "🤖" },
  { value: "cable", label: "Cable", icon: "🔗" },
  { value: "bodyweight", label: "Bodyweight", icon: "🤸‍♂️" },
  { value: "resistance_band", label: "Resistance Band", icon: "🎗️" },
  { value: "kettlebell", label: "Kettlebell", icon: "⚫" },
  { value: "other", label: "Other", icon: "❓" },
];

// Difficulty levels with display names
export const DIFFICULTY_LEVELS: {
  value: DifficultyLevel;
  label: string;
  color: string;
}[] = [
  { value: "beginner", label: "Beginner", color: "text-success" },
  { value: "intermediate", label: "Intermediate", color: "text-warning" },
  { value: "advanced", label: "Advanced", color: "text-error" },
];

// Muscle groups for exercises
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

// Utility functions
export const formatWeight = (weight: number): string => {
  return `${weight} lbs`;
};

export const formatDate = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const formatDateTime = (date: Date | string): string => {
  const d = new Date(date);
  return d.toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatDuration = (minutes: number): string => {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return remainingMinutes > 0 ? `${hours}h ${remainingMinutes}m` : `${hours}h`;
};

export const calculateVolume = (weight: number, reps: number): number => {
  return weight * reps;
};

export const getCategoryIcon = (category: ExerciseCategory): string => {
  return EXERCISE_CATEGORIES.find((c) => c.value === category)?.icon || "💪";
};

export const getEquipmentIcon = (equipment: ExerciseEquipment): string => {
  return EQUIPMENT_TYPES.find((e) => e.value === equipment)?.icon || "❓";
};

export const getDifficultyColor = (difficulty: DifficultyLevel): string => {
  return (
    DIFFICULTY_LEVELS.find((d) => d.value === difficulty)?.color ||
    "text-secondary"
  );
};

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validateWeight = (weight: string | number): boolean => {
  const w = typeof weight === "string" ? parseFloat(weight) : weight;
  return !isNaN(w) && w > 0;
};

export const validateReps = (reps: string | number): boolean => {
  const r = typeof reps === "string" ? parseInt(reps) : reps;
  return !isNaN(r) && r > 0 && Number.isInteger(r);
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

export const pluralize = (
  count: number,
  singular: string,
  plural?: string
): string => {
  return count === 1 ? singular : plural || `${singular}s`;
};

// Local storage utilities
export const LOCAL_STORAGE_KEYS = {
  CURRENT_USER: "liftcode_current_user",
  WORKOUT_SESSION: "liftcode_workout_session",
  PREFERENCES: "liftcode_preferences",
} as const;

export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === "undefined") return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage for key "${key}":`, error);
    return defaultValue;
  }
};

export const setToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error writing to localStorage for key "${key}":`, error);
  }
};

export const removeFromLocalStorage = (key: string): void => {
  if (typeof window === "undefined") return;

  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing from localStorage for key "${key}":`, error);
  }
};

// Debounce utility for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};
