import database from "../config/database";
import dotenv from "dotenv";

dotenv.config();

const seedExercises = [
  {
    name: "Push Up",
    description:
      "A classic bodyweight exercise that targets the chest, shoulders, and triceps.",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    photo_public_id: "pushup_demo_001",
    category: "chest",
    equipment: "bodyweight",
    difficulty_level: "beginner",
    primary_muscles: ["chest", "triceps"],
    secondary_muscles: ["shoulders", "abs"],
    instructions: [
      "Start in a plank position with hands slightly wider than shoulders",
      "Lower your body until chest nearly touches the ground",
      "Push back up to starting position",
      "Keep your core tight throughout the movement",
    ],
    tips: [
      "Keep your body in a straight line",
      "Don't let your hips sag",
      "Control the movement - don't rush",
    ],
  },
  {
    name: "Barbell Bench Press",
    description:
      "The king of chest exercises, targeting the pectoral muscles with heavy weight.",
    photo: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400",
    photo_public_id: "bench_press_demo_001",
    category: "chest",
    equipment: "barbell",
    difficulty_level: "intermediate",
    primary_muscles: ["chest"],
    secondary_muscles: ["triceps", "shoulders"],
    instructions: [
      "Lie on bench with feet flat on floor",
      "Grip barbell with hands slightly wider than shoulders",
      "Lower bar to chest with control",
      "Press bar back up to starting position",
    ],
    tips: [
      "Keep your shoulder blades pulled back",
      "Don't bounce the bar off your chest",
      "Use a spotter when lifting heavy",
    ],
  },
  {
    name: "Pull Up",
    description:
      "A compound exercise that primarily targets the latissimus dorsi and biceps.",
    photo: "https://images.unsplash.com/photo-1594736797933-d0cb2304015c?w=400",
    photo_public_id: "pullup_demo_001",
    category: "back",
    equipment: "bodyweight",
    difficulty_level: "intermediate",
    primary_muscles: ["lats", "upper_back"],
    secondary_muscles: ["biceps", "forearms"],
    instructions: [
      "Hang from pull-up bar with overhand grip",
      "Pull your body up until chin clears the bar",
      "Lower yourself back down with control",
      "Repeat for desired reps",
    ],
    tips: [
      "Engage your lats, not just your arms",
      "Don't swing or use momentum",
      "Full range of motion is important",
    ],
  },
  {
    name: "Squat",
    description:
      "The fundamental lower body exercise targeting quads, glutes, and hamstrings.",
    photo: "https://images.unsplash.com/photo-1566241134226-13dbdc2cb7e4?w=400",
    photo_public_id: "squat_demo_001",
    category: "legs",
    equipment: "bodyweight",
    difficulty_level: "beginner",
    primary_muscles: ["quadriceps", "glutes"],
    secondary_muscles: ["hamstrings", "calves"],
    instructions: [
      "Stand with feet shoulder-width apart",
      "Lower your body by bending at hips and knees",
      "Go down until thighs are parallel to floor",
      "Push through heels to return to standing",
    ],
    tips: [
      "Keep your chest up and core engaged",
      "Don't let knees cave inward",
      "Go as deep as your mobility allows",
    ],
  },
  {
    name: "Deadlift",
    description:
      "A compound movement that works the entire posterior chain and core.",
    photo: "https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400",
    photo_public_id: "deadlift_demo_001",
    category: "back",
    equipment: "barbell",
    difficulty_level: "advanced",
    primary_muscles: ["lower_back", "glutes", "hamstrings"],
    secondary_muscles: ["lats", "quadriceps", "abs"],
    instructions: [
      "Stand with feet hip-width apart, bar over mid-foot",
      "Bend at hips and knees to grip the bar",
      "Keep chest up and back straight",
      "Drive through heels and extend hips to lift the bar",
    ],
    tips: [
      "Keep the bar close to your body",
      "Don't round your back",
      "Start with lighter weight to master form",
    ],
  },
  {
    name: "Shoulder Press",
    description:
      "An overhead pressing movement that targets the deltoids and triceps.",
    photo: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400",
    photo_public_id: "shoulder_press_demo_001",
    category: "shoulders",
    equipment: "dumbbell",
    difficulty_level: "intermediate",
    primary_muscles: ["shoulders"],
    secondary_muscles: ["triceps", "upper_back"],
    instructions: [
      "Hold dumbbells at shoulder height",
      "Press weights straight up overhead",
      "Lower back to starting position with control",
      "Keep core engaged throughout",
    ],
    tips: [
      "Don't arch your back excessively",
      "Press in a straight line",
      "Control the weight on the way down",
    ],
  },
  {
    name: "Plank",
    description:
      "An isometric core exercise that builds stability and endurance.",
    photo: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400",
    photo_public_id: "plank_demo_001",
    category: "core",
    equipment: "bodyweight",
    difficulty_level: "beginner",
    primary_muscles: ["abs"],
    secondary_muscles: ["obliques", "lower_back", "shoulders"],
    instructions: [
      "Start in push-up position",
      "Lower onto forearms, keeping elbows under shoulders",
      "Hold this position while maintaining straight body line",
      "Breathe normally while holding",
    ],
    tips: [
      "Don't let hips sag or pike up",
      "Squeeze glutes and abs",
      "Start with shorter holds and build up time",
    ],
  },
  {
    name: "Burpees",
    description:
      "A full-body cardio exercise that combines strength and conditioning.",
    photo: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400",
    photo_public_id: "burpees_demo_001",
    category: "cardio",
    equipment: "bodyweight",
    difficulty_level: "intermediate",
    primary_muscles: ["cardio"],
    secondary_muscles: ["chest", "legs", "shoulders", "abs"],
    instructions: [
      "Start standing, then drop into a squat",
      "Place hands on ground and jump feet back to plank",
      "Do a push-up, then jump feet back to squat",
      "Jump up with arms overhead",
    ],
    tips: [
      "Maintain good form even when tired",
      "Land softly on jumps",
      "Modify by stepping back instead of jumping",
    ],
  },
];

async function createExercisesTable(): Promise<void> {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS exercises (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      photo VARCHAR(500),
      photo_public_id VARCHAR(255),
      category VARCHAR(50) NOT NULL CHECK (category IN ('chest', 'back', 'shoulders', 'arms', 'legs', 'core', 'cardio', 'full_body')),
      equipment VARCHAR(50) CHECK (equipment IN ('barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'resistance_band', 'kettlebell', 'other')),
      difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
      primary_muscles TEXT[] NOT NULL,
      secondary_muscles TEXT[],
      instructions TEXT[],
      tips TEXT[],
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `;

  const createIndexesQuery = `
    CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
    CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises(equipment);
    CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty_level);
    CREATE INDEX IF NOT EXISTS idx_exercises_active ON exercises(is_active);
    CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);
  `;

  const createFunctionQuery = `
    CREATE OR REPLACE FUNCTION update_updated_at_column()
    RETURNS TRIGGER AS $$
    BEGIN
        NEW.updated_at = CURRENT_TIMESTAMP;
        RETURN NEW;
    END;
    $$ language 'plpgsql';
  `;

  const createTriggerQuery = `
    DROP TRIGGER IF EXISTS update_exercises_updated_at ON exercises;
    CREATE TRIGGER update_exercises_updated_at
        BEFORE UPDATE ON exercises
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    console.log("🏗️  Creating exercises table...");
    await database.query(createTableQuery);

    console.log("📊 Creating indexes...");
    await database.query(createIndexesQuery);

    console.log("⚙️  Creating/updating trigger function...");
    await database.query(createFunctionQuery);

    console.log("🔄 Creating trigger...");
    await database.query(createTriggerQuery);

    console.log("✅ Exercises table created successfully!");
  } catch (error) {
    console.error("❌ Error creating exercises table:", error);
    throw error;
  }
}

async function insertExercises(): Promise<void> {
  try {
    // Check if exercises already exist
    const existingExercisesResult = await database.query(
      "SELECT COUNT(*) FROM exercises"
    );
    const exerciseCount = parseInt(existingExercisesResult.rows[0].count);

    if (exerciseCount > 0) {
      console.log(
        `📝 ${exerciseCount} exercises already exist in the database. Skipping seed...`
      );
      return;
    }

    console.log("💪 Seeding exercises...");

    for (const exercise of seedExercises) {
      const insertQuery = `
        INSERT INTO exercises (
          name, description, photo, photo_public_id, category, equipment, 
          difficulty_level, primary_muscles, secondary_muscles, instructions, tips
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *;
      `;

      const values = [
        exercise.name,
        exercise.description,
        exercise.photo,
        exercise.photo_public_id,
        exercise.category,
        exercise.equipment,
        exercise.difficulty_level,
        exercise.primary_muscles,
        exercise.secondary_muscles,
        exercise.instructions,
        exercise.tips,
      ];

      const result = await database.query(insertQuery, values);
      console.log(
        `✅ Created exercise: ${result.rows[0].name} (${result.rows[0].category})`
      );
    }

    console.log("🎉 All exercises seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding exercises:", error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    console.log("🚀 Starting exercises database setup...\n");

    await createExercisesTable();
    console.log(""); // Empty line for better readability

    await insertExercises();
    console.log(""); // Empty line for better readability

    console.log("✅ Exercises database setup completed successfully!");

    // Display statistics
    const stats = await database.query(`
      SELECT 
        COUNT(*) as total_exercises,
        COUNT(CASE WHEN category = 'chest' THEN 1 END) as chest_exercises,
        COUNT(CASE WHEN category = 'back' THEN 1 END) as back_exercises,
        COUNT(CASE WHEN category = 'shoulders' THEN 1 END) as shoulder_exercises,
        COUNT(CASE WHEN category = 'legs' THEN 1 END) as leg_exercises,
        COUNT(CASE WHEN category = 'core' THEN 1 END) as core_exercises,
        COUNT(CASE WHEN category = 'cardio' THEN 1 END) as cardio_exercises
      FROM exercises WHERE is_active = true
    `);

    console.log("\n📊 Exercise Statistics:");
    const statRow = stats.rows[0];
    console.log(`  Total exercises: ${statRow.total_exercises}`);
    console.log(`  Chest: ${statRow.chest_exercises}`);
    console.log(`  Back: ${statRow.back_exercises}`);
    console.log(`  Shoulders: ${statRow.shoulder_exercises}`);
    console.log(`  Legs: ${statRow.leg_exercises}`);
    console.log(`  Core: ${statRow.core_exercises}`);
    console.log(`  Cardio: ${statRow.cardio_exercises}`);

    // Display seeded exercises
    const exercises = await database.query(
      "SELECT id, name, category, difficulty_level FROM exercises WHERE is_active = true ORDER BY category, name"
    );
    console.log("\n📋 Seeded exercises:");
    exercises.rows.forEach((exercise: any) => {
      console.log(
        `  ${exercise.id}. ${exercise.name} (${exercise.category} - ${exercise.difficulty_level})`
      );
    });
  } catch (error) {
    console.error("💥 Exercises database setup failed:", error);
    process.exit(1);
  } finally {
    await database.close();
    process.exit(0);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { createExercisesTable, insertExercises };
