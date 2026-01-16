// Workout schedule utilities
export interface WorkoutSchedule {
  day: number;
  name: string;
  exercises: string[];
  isRestDay: boolean;
}

export const workoutSchedule: WorkoutSchedule[] = [
  {
    day: 1,
    name: "Back & Biceps",
    exercises: [
      "Pull-ups",
      "Barbell Rows",
      "Lat Pulldowns",
      "Bicep Curls",
      "Hammer Curls",
    ],
    isRestDay: false,
  },
  {
    day: 2,
    name: "Legs & Shoulders",
    exercises: [
      "Squats",
      "Deadlifts",
      "Shoulder Press",
      "Leg Press",
      "Lateral Raises",
    ],
    isRestDay: false,
  },
  {
    day: 3,
    name: "Chest & Triceps",
    exercises: [
      "Bench Press",
      "Push-ups",
      "Tricep Dips",
      "Chest Flyes",
      "Tricep Extensions",
    ],
    isRestDay: false,
  },
  {
    day: 4,
    name: "Rest Day",
    exercises: [],
    isRestDay: true,
  },
  {
    day: 5,
    name: "Back & Biceps",
    exercises: [
      "Pull-ups",
      "Barbell Rows",
      "Lat Pulldowns",
      "Bicep Curls",
      "Hammer Curls",
    ],
    isRestDay: false,
  },
  {
    day: 6,
    name: "Legs & Shoulders",
    exercises: [
      "Squats",
      "Deadlifts",
      "Shoulder Press",
      "Leg Press",
      "Lateral Raises",
    ],
    isRestDay: false,
  },
  {
    day: 7,
    name: "Chest & Triceps",
    exercises: [
      "Bench Press",
      "Push-ups",
      "Tricep Dips",
      "Chest Flyes",
      "Tricep Extensions",
    ],
    isRestDay: false,
  },
  {
    day: 8,
    name: "Rest Day",
    exercises: [],
    isRestDay: true,
  },
];

export function getCurrentWorkoutDay(): WorkoutSchedule {
  const today = new Date();
  const startDate = new Date("2026-01-13"); // Example start date, you can adjust
  const daysDiff = Math.floor(
    (today.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const currentDay = (daysDiff % 8) + 1;
  return workoutSchedule[currentDay - 1];
}

export function getWorkoutStreak(): number {
  // This would typically come from your backend API
  // For now, return a mock value
  return 5;
}

export function getTotalWorkouts(): number {
  // This would typically come from your backend API
  return 24;
}
