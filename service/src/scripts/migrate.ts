import database from "../config/database";

// Migration script to create the sets and workout_sessions tables
async function migrate() {
  try {
    console.log("🔄 Starting database migration...");

    // Create workout sessions table
    console.log("Creating workout_sessions table...");
    await database.query(`
      CREATE TABLE IF NOT EXISTS workout_sessions (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255),
        date DATE NOT NULL DEFAULT CURRENT_DATE,
        start_time TIMESTAMP,
        end_time TIMESTAMP,
        duration_minutes INTEGER GENERATED ALWAYS AS (
          CASE 
            WHEN start_time IS NOT NULL AND end_time IS NOT NULL 
            THEN EXTRACT(EPOCH FROM (end_time - start_time))/60 
            ELSE NULL 
          END
        ) STORED,
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for workout sessions
    await database.query(`
      CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
      CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(date);
      CREATE INDEX IF NOT EXISTS idx_workout_sessions_created_at ON workout_sessions(created_at);
    `);

    // Create sets table
    console.log("Creating sets table...");
    await database.query(`
      CREATE TABLE IF NOT EXISTS sets (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        workout_session_id INTEGER REFERENCES workout_sessions(id) ON DELETE SET NULL,
        set_number INTEGER NOT NULL CHECK (set_number > 0),
        set_type VARCHAR(20) NOT NULL CHECK (set_type IN ('normal', 'dropset', 'superset')),
        exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
        superset_exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
        weight JSONB NOT NULL,
        reps JSONB NOT NULL,
        drop_weight DECIMAL(6,2) CHECK (drop_weight >= 0),
        drop_reps INTEGER CHECK (drop_reps > 0),
        note TEXT,
        completed BOOLEAN DEFAULT true,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Create indexes for sets table
    await database.query(`
      CREATE INDEX IF NOT EXISTS idx_sets_user_id ON sets(user_id);
      CREATE INDEX IF NOT EXISTS idx_sets_exercise_id ON sets(exercise_id);
      CREATE INDEX IF NOT EXISTS idx_sets_superset_exercise_id ON sets(superset_exercise_id);
      CREATE INDEX IF NOT EXISTS idx_sets_workout_session ON sets(workout_session_id);
      CREATE INDEX IF NOT EXISTS idx_sets_type ON sets(set_type);
      CREATE INDEX IF NOT EXISTS idx_sets_created_at ON sets(created_at);
      CREATE INDEX IF NOT EXISTS idx_sets_user_exercise ON sets(user_id, exercise_id);
    `);

    // Create triggers (assuming the update function already exists)
    console.log("Creating triggers...");
    await database.query(`
      DROP TRIGGER IF EXISTS update_workout_sessions_updated_at ON workout_sessions;
      CREATE TRIGGER update_workout_sessions_updated_at
        BEFORE UPDATE ON workout_sessions
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    await database.query(`
      DROP TRIGGER IF EXISTS update_sets_updated_at ON sets;
      CREATE TRIGGER update_sets_updated_at
        BEFORE UPDATE ON sets
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
    `);

    // Add constraints
    console.log("Adding constraints...");
    await database.query(`
      ALTER TABLE sets DROP CONSTRAINT IF EXISTS check_superset_exercise;
      ALTER TABLE sets ADD CONSTRAINT check_superset_exercise 
        CHECK (
          (set_type = 'superset' AND superset_exercise_id IS NOT NULL) OR 
          (set_type != 'superset' AND superset_exercise_id IS NULL)
        );
    `);

    await database.query(`
      ALTER TABLE sets DROP CONSTRAINT IF EXISTS check_dropset_fields;
      ALTER TABLE sets ADD CONSTRAINT check_dropset_fields 
        CHECK (
          (set_type = 'dropset' AND (drop_weight IS NOT NULL OR drop_reps IS NOT NULL)) OR 
          (set_type != 'dropset' AND drop_weight IS NULL AND drop_reps IS NULL)
        );
    `);

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run migration if this file is executed directly
if (require.main === module) {
  migrate()
    .then(() => {
      console.log("Database migration completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("Database migration failed:", error);
      process.exit(1);
    });
}

export { migrate };
