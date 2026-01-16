import { SetService } from "../services/setService";
import { CreateSetDTO } from "../models/Set";
import database from "../config/database";

const setService = new SetService(database.getPool());

// Sample sets data
const sampleSets: CreateSetDTO[] = [
  // Normal sets
  {
    user_id: 1,
    set_number: 1,
    set_type: "normal",
    exercise_id: 1, // Bench Press
    weight: { primary: 135 },
    reps: { primary: 10 },
    note: "Felt strong today",
    completed: true,
  },
  {
    user_id: 1,
    set_number: 2,
    set_type: "normal",
    exercise_id: 1, // Bench Press
    weight: { primary: 135 },
    reps: { primary: 8 },
    completed: true,
  },
  {
    user_id: 1,
    set_number: 3,
    set_type: "normal",
    exercise_id: 1, // Bench Press
    weight: { primary: 135 },
    reps: { primary: 6 },
    note: "Last rep was tough",
    completed: true,
  },

  // Dropset example
  {
    user_id: 1,
    set_number: 1,
    set_type: "dropset",
    exercise_id: 2, // Bicep Curls
    weight: { primary: 50 },
    reps: { primary: 8 },
    drop_weight: 35,
    drop_reps: 12,
    note: "Good burn on the dropset",
    completed: true,
  },

  // Superset example
  {
    user_id: 1,
    set_number: 1,
    set_type: "superset",
    exercise_id: 3, // Push-ups
    superset_exercise_id: 4, // Pull-ups
    weight: { primary: 1, secondary: 1 }, // Bodyweight (using 1 as placeholder)
    reps: { primary: 20, secondary: 10 },
    note: "Great superset combination",
    completed: true,
  },
  {
    user_id: 1,
    set_number: 2,
    set_type: "superset",
    exercise_id: 3, // Push-ups
    superset_exercise_id: 4, // Pull-ups
    weight: { primary: 1, secondary: 1 }, // Bodyweight (using 1 as placeholder)
    reps: { primary: 18, secondary: 8 },
    completed: true,
  },

  // Different user sets
  {
    user_id: 2,
    set_number: 1,
    set_type: "normal",
    exercise_id: 5, // Squats
    weight: { primary: 185 },
    reps: { primary: 12 },
    note: "Warm-up set",
    completed: true,
  },
  {
    user_id: 2,
    set_number: 2,
    set_type: "normal",
    exercise_id: 5, // Squats
    weight: { primary: 225 },
    reps: { primary: 8 },
    completed: true,
  },

  // Incomplete set example
  {
    user_id: 2,
    set_number: 3,
    set_type: "normal",
    exercise_id: 5, // Squats
    weight: { primary: 245 },
    reps: { primary: 3 },
    note: "Failed on 4th rep",
    completed: false,
  },
];

export const seedSets = async (): Promise<void> => {
  try {
    console.log("🌱 Seeding sets...");

    // Clear existing sets (optional - remove if you want to keep existing data)
    console.log("Clearing existing sets...");
    await database.query("DELETE FROM sets");

    // Insert sample sets
    for (const setData of sampleSets) {
      try {
        const createdSet = await setService.createSet(setData);
        console.log(
          `✅ Created set ${createdSet.id} for user ${createdSet.user_id}`
        );
      } catch (error) {
        console.error(
          `❌ Failed to create set for user ${setData.user_id}:`,
          error
        );
      }
    }

    console.log("✅ Sets seeding completed!");
  } catch (error) {
    console.error("❌ Sets seeding failed:", error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  seedSets()
    .then(() => {
      console.log("Sets seeding completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Sets seeding failed:", error);
      process.exit(1);
    });
}
