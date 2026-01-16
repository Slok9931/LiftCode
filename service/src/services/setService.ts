import { Pool } from "pg";
import {
  Set,
  CreateSetDTO,
  UpdateSetDTO,
  SetWithExercises,
  SetValidation,
} from "../models/Set";

export class SetService {
  constructor(private pool: Pool) {}

  // Create a new set
  async createSet(setData: CreateSetDTO): Promise<Set> {
    // Validate the set data
    const validation = this.validateSet(setData);
    if (!validation.isValid) {
      throw new Error(`Invalid set data: ${validation.errors.join(", ")}`);
    }

    const query = `
      INSERT INTO sets (
        user_id, workout_session_id, set_number, set_type, exercise_id, 
        superset_exercise_id, weight, reps, drop_weight, drop_reps, note, completed
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const values = [
      setData.user_id,
      setData.workout_session_id,
      setData.set_number,
      setData.set_type,
      setData.exercise_id,
      setData.superset_exercise_id,
      JSON.stringify(setData.weight),
      JSON.stringify(setData.reps),
      setData.drop_weight,
      setData.drop_reps,
      setData.note,
      setData.completed ?? true,
    ];

    const result = await this.pool.query(query, values);
    return this.parseSetRow(result.rows[0]);
  }

  // Get set by ID with exercise details
  async getSetById(id: number): Promise<SetWithExercises | null> {
    const query = `
      SELECT 
        s.*,
        e1.id as exercise_id, e1.name as exercise_name, e1.category as exercise_category,
        e2.id as superset_exercise_id, e2.name as superset_exercise_name, 
        e2.category as superset_exercise_category
      FROM sets s
      LEFT JOIN exercises e1 ON s.exercise_id = e1.id
      LEFT JOIN exercises e2 ON s.superset_exercise_id = e2.id
      WHERE s.id = $1
    `;

    const result = await this.pool.query(query, [id]);
    if (result.rows.length === 0) return null;

    return this.parseSetWithExercisesRow(result.rows[0]);
  }

  // Get all sets for a user
  async getSetsByUserId(
    userId: number,
    limit: number = 50,
    offset: number = 0
  ): Promise<SetWithExercises[]> {
    const query = `
      SELECT 
        s.*,
        e1.id as exercise_id, e1.name as exercise_name, e1.category as exercise_category,
        e2.id as superset_exercise_id, e2.name as superset_exercise_name, 
        e2.category as superset_exercise_category
      FROM sets s
      LEFT JOIN exercises e1 ON s.exercise_id = e1.id
      LEFT JOIN exercises e2 ON s.superset_exercise_id = e2.id
      WHERE s.user_id = $1
      ORDER BY s.created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const result = await this.pool.query(query, [userId, limit, offset]);
    return result.rows.map((row) => this.parseSetWithExercisesRow(row));
  }

  // Get sets by exercise
  async getSetsByExercise(
    userId: number,
    exerciseId: number,
    limit: number = 20
  ): Promise<SetWithExercises[]> {
    const query = `
      SELECT 
        s.*,
        e1.id as exercise_id, e1.name as exercise_name, e1.category as exercise_category,
        e2.id as superset_exercise_id, e2.name as superset_exercise_name, 
        e2.category as superset_exercise_category
      FROM sets s
      LEFT JOIN exercises e1 ON s.exercise_id = e1.id
      LEFT JOIN exercises e2 ON s.superset_exercise_id = e2.id
      WHERE s.user_id = $1 AND (s.exercise_id = $2 OR s.superset_exercise_id = $2)
      ORDER BY s.created_at DESC
      LIMIT $3
    `;

    const result = await this.pool.query(query, [userId, exerciseId, limit]);
    return result.rows.map((row) => this.parseSetWithExercisesRow(row));
  }

  // Get sets by workout session
  async getSetsByWorkoutSession(
    workoutSessionId: number
  ): Promise<SetWithExercises[]> {
    const query = `
      SELECT 
        s.*,
        e1.id as exercise_id, e1.name as exercise_name, e1.category as exercise_category,
        e2.id as superset_exercise_id, e2.name as superset_exercise_name, 
        e2.category as superset_exercise_category
      FROM sets s
      LEFT JOIN exercises e1 ON s.exercise_id = e1.id
      LEFT JOIN exercises e2 ON s.superset_exercise_id = e2.id
      WHERE s.workout_session_id = $1
      ORDER BY s.set_number ASC, s.created_at ASC
    `;

    const result = await this.pool.query(query, [workoutSessionId]);
    return result.rows.map((row) => this.parseSetWithExercisesRow(row));
  }

  // Update a set
  async updateSet(id: number, setData: UpdateSetDTO): Promise<Set | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Build dynamic update query
    Object.entries(setData).forEach(([key, value]) => {
      if (value !== undefined) {
        if (key === "weight" || key === "reps") {
          fields.push(`${key} = $${paramCount}`);
          values.push(JSON.stringify(value));
        } else {
          fields.push(`${key} = $${paramCount}`);
          values.push(value);
        }
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    values.push(id);
    const query = `
      UPDATE sets 
      SET ${fields.join(", ")}, updated_at = CURRENT_TIMESTAMP
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await this.pool.query(query, values);
    if (result.rows.length === 0) return null;

    return this.parseSetRow(result.rows[0]);
  }

  // Delete a set
  async deleteSet(id: number): Promise<boolean> {
    const query = "DELETE FROM sets WHERE id = $1";
    const result = await this.pool.query(query, [id]);
    return (result.rowCount ?? 0) > 0;
  }

  // Get workout statistics for a user
  async getUserWorkoutStats(userId: number, days: number = 30) {
    const query = `
      SELECT 
        COUNT(*) as total_sets,
        COUNT(DISTINCT exercise_id) as unique_exercises,
        SUM(CASE WHEN set_type = 'normal' THEN 1 ELSE 0 END) as normal_sets,
        SUM(CASE WHEN set_type = 'dropset' THEN 1 ELSE 0 END) as drop_sets,
        SUM(CASE WHEN set_type = 'superset' THEN 1 ELSE 0 END) as super_sets,
        COUNT(DISTINCT DATE(created_at)) as workout_days
      FROM sets 
      WHERE user_id = $1 
        AND created_at >= CURRENT_DATE - INTERVAL '${days} days'
        AND completed = true
    `;

    const result = await this.pool.query(query, [userId]);
    return result.rows[0];
  }

  // Validate set data
  private validateSet(setData: CreateSetDTO): SetValidation {
    const errors: string[] = [];

    // Basic validations
    if (!setData.user_id) errors.push("User ID is required");
    if (!setData.exercise_id) errors.push("Exercise ID is required");
    if (setData.set_number <= 0) errors.push("Set number must be positive");
    if (!["normal", "dropset", "superset"].includes(setData.set_type)) {
      errors.push("Invalid set type");
    }

    // Validate weight and reps structure
    if (!setData.weight?.primary || setData.weight.primary <= 0) {
      errors.push("Primary weight must be positive");
    }
    if (!setData.reps?.primary || setData.reps.primary <= 0) {
      errors.push("Primary reps must be positive");
    }

    // Type-specific validations
    if (setData.set_type === "superset") {
      if (!setData.superset_exercise_id) {
        errors.push("Superset exercise ID is required for supersets");
      }
      if (!setData.weight.secondary || setData.weight.secondary <= 0) {
        errors.push("Secondary weight is required for supersets");
      }
      if (!setData.reps.secondary || setData.reps.secondary <= 0) {
        errors.push("Secondary reps is required for supersets");
      }
    } else {
      if (setData.superset_exercise_id) {
        errors.push(
          "Superset exercise ID should not be set for non-superset types"
        );
      }
    }

    if (setData.set_type === "dropset") {
      if (!setData.drop_weight && !setData.drop_reps) {
        errors.push("Drop weight or drop reps must be specified for dropsets");
      }
    } else {
      if (setData.drop_weight || setData.drop_reps) {
        errors.push("Drop weight/reps should not be set for non-dropset types");
      }
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Parse database row to Set object
  private parseSetRow(row: any): Set {
    return {
      id: row.id,
      user_id: row.user_id,
      workout_session_id: row.workout_session_id,
      set_number: row.set_number,
      set_type: row.set_type,
      exercise_id: row.exercise_id,
      superset_exercise_id: row.superset_exercise_id,
      weight: row.weight,
      reps: row.reps,
      drop_weight: row.drop_weight,
      drop_reps: row.drop_reps,
      note: row.note,
      completed: row.completed,
      created_at: row.created_at,
      updated_at: row.updated_at,
    };
  }

  // Parse database row to SetWithExercises object
  private parseSetWithExercisesRow(row: any): SetWithExercises {
    const set = this.parseSetRow(row);

    const result: SetWithExercises = {
      ...set,
      exercise: row.exercise_name
        ? {
            id: row.exercise_id,
            name: row.exercise_name,
            category: row.exercise_category,
          }
        : undefined,
      superset_exercise: row.superset_exercise_name
        ? {
            id: row.superset_exercise_id,
            name: row.superset_exercise_name,
            category: row.superset_exercise_category,
          }
        : undefined,
    };

    return result;
  }
}
