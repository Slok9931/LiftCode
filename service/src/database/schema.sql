-- Create users table
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    dob DATE NULL,
    weight DECIMAL(5,2) NULL CHECK (weight > 0 AND weight <= 1000),
    height DECIMAL(5,2) NULL CHECK (height > 0 AND height <= 300),
    profile_pic VARCHAR(500),
    profile_pic_public_id VARCHAR(255),
    role VARCHAR(10) NOT NULL CHECK (role IN ('gymmer', 'viewer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);

-- Create a function to automatically update the updated_at column
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create a trigger to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_users_updated_at ON users;
CREATE TRIGGER update_users_updated_at
    BEFORE UPDATE ON users
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create exercises table
CREATE TABLE IF NOT EXISTS exercises (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    photo VARCHAR(500),
    photo_public_id VARCHAR(255),
    category VARCHAR(50) NOT NULL CHECK (category IN ('chest', 'back', 'shoulders', 'biceps', 'triceps', 'legs', 'core', 'cardio', 'full_body')),
    equipment VARCHAR(50) CHECK (equipment IN ('barbell', 'dumbbell', 'machine', 'cable', 'bodyweight', 'resistance_band', 'kettlebell', 'other')),
    difficulty_level VARCHAR(20) NOT NULL CHECK (difficulty_level IN ('beginner', 'intermediate', 'advanced')),
    primary_muscles TEXT[] NOT NULL, -- Array of primary muscles worked
    secondary_muscles TEXT[], -- Array of secondary muscles worked
    instructions TEXT[],  -- Array of step-by-step instructions
    tips TEXT[], -- Array of helpful tips
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for exercises table
CREATE INDEX IF NOT EXISTS idx_exercises_category ON exercises(category);
CREATE INDEX IF NOT EXISTS idx_exercises_equipment ON exercises(equipment);
CREATE INDEX IF NOT EXISTS idx_exercises_difficulty ON exercises(difficulty_level);
CREATE INDEX IF NOT EXISTS idx_exercises_active ON exercises(is_active);
CREATE INDEX IF NOT EXISTS idx_exercises_name ON exercises(name);

-- Create trigger for exercises updated_at
DROP TRIGGER IF EXISTS update_exercises_updated_at ON exercises;
CREATE TRIGGER update_exercises_updated_at
    BEFORE UPDATE ON exercises
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create workout sessions table (optional for grouping sets)
CREATE TABLE IF NOT EXISTS workout_sessions (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    name VARCHAR(255), -- Optional workout name
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

-- Create indexes for workout sessions
CREATE INDEX IF NOT EXISTS idx_workout_sessions_user_id ON workout_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_date ON workout_sessions(date);
CREATE INDEX IF NOT EXISTS idx_workout_sessions_created_at ON workout_sessions(created_at);

-- Create trigger for workout_sessions updated_at
DROP TRIGGER IF EXISTS update_workout_sessions_updated_at ON workout_sessions;
CREATE TRIGGER update_workout_sessions_updated_at
    BEFORE UPDATE ON workout_sessions
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Create sets table
CREATE TABLE IF NOT EXISTS sets (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    workout_session_id INTEGER REFERENCES workout_sessions(id) ON DELETE SET NULL,
    set_number INTEGER NOT NULL CHECK (set_number > 0),
    set_type VARCHAR(20) NOT NULL CHECK (set_type IN ('normal', 'dropset', 'superset')),
    
    -- Exercise information (for normal and dropset: single exercise, for superset: primary exercise)
    exercise_id INTEGER NOT NULL REFERENCES exercises(id) ON DELETE CASCADE,
    
    -- Superset second exercise (only used when set_type = 'superset')
    superset_exercise_id INTEGER REFERENCES exercises(id) ON DELETE CASCADE,
    
    -- Weight information (stored as JSON for flexibility)
    -- Normal/Dropset: {"primary": 135.5} 
    -- Superset: {"primary": 135.5, "secondary": 50.0}
    weight JSONB NOT NULL,
    
    -- Reps information (stored as JSON for flexibility)  
    -- Normal: {"primary": 12}
    -- Dropset: {"primary": 8} (initial reps before drop)
    -- Superset: {"primary": 12, "secondary": 15}
    reps JSONB NOT NULL,
    
    -- Dropset specific information
    drop_weight DECIMAL(6,2) CHECK (drop_weight >= 0), -- Weight after drop (for dropsets)
    drop_reps INTEGER CHECK (drop_reps > 0), -- Reps after drop (for dropsets)
    
    -- Additional information
    note TEXT, -- User notes about the set
    completed BOOLEAN DEFAULT true, -- Whether the set was completed as planned
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for sets table
CREATE INDEX IF NOT EXISTS idx_sets_user_id ON sets(user_id);
CREATE INDEX IF NOT EXISTS idx_sets_exercise_id ON sets(exercise_id);
CREATE INDEX IF NOT EXISTS idx_sets_superset_exercise_id ON sets(superset_exercise_id);
CREATE INDEX IF NOT EXISTS idx_sets_workout_session ON sets(workout_session_id);
CREATE INDEX IF NOT EXISTS idx_sets_type ON sets(set_type);
CREATE INDEX IF NOT EXISTS idx_sets_created_at ON sets(created_at);
CREATE INDEX IF NOT EXISTS idx_sets_user_exercise ON sets(user_id, exercise_id);

-- Create trigger for sets updated_at
DROP TRIGGER IF EXISTS update_sets_updated_at ON sets;
CREATE TRIGGER update_sets_updated_at
    BEFORE UPDATE ON sets
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add constraint to ensure superset_exercise_id is only set when set_type = 'superset'
ALTER TABLE sets ADD CONSTRAINT check_superset_exercise 
    CHECK (
        (set_type = 'superset' AND superset_exercise_id IS NOT NULL) OR 
        (set_type != 'superset' AND superset_exercise_id IS NULL)
    );

-- Add constraint to ensure drop_weight and drop_reps are only set when set_type = 'dropset'
ALTER TABLE sets ADD CONSTRAINT check_dropset_fields 
    CHECK (
        (set_type = 'dropset' AND (drop_weight IS NOT NULL OR drop_reps IS NOT NULL)) OR 
        (set_type != 'dropset' AND drop_weight IS NULL AND drop_reps IS NULL)
    );
