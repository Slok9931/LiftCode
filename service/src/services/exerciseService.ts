import database from "../config/database";
import {
  Exercise,
  CreateExerciseDTO,
  UpdateExerciseDTO,
  ExerciseCategory,
  ExerciseEquipment,
  DifficultyLevel,
} from "../models/Exercise";

export class ExerciseService {
  async getAllExercises(): Promise<Exercise[]> {
    const query = `
      SELECT e.*
      FROM exercises e
      WHERE e.is_active = true
      ORDER BY e.name ASC
    `;
    const result = await database.query(query);
    return result.rows;
  }

  async getExerciseById(id: number): Promise<Exercise | null> {
    const query = `
      SELECT e.*
      FROM exercises e
      WHERE e.id = $1 AND e.is_active = true
    `;
    const result = await database.query(query, [id]);
    return result.rows[0] || null;
  }

  async getExercisesByCategory(
    category: ExerciseCategory
  ): Promise<Exercise[]> {
    const query = `
      SELECT e.*
      FROM exercises e
      WHERE e.category = $1 AND e.is_active = true
      ORDER BY e.name ASC
    `;
    const result = await database.query(query, [category]);
    return result.rows;
  }

  async getExercisesByEquipment(
    equipment: ExerciseEquipment
  ): Promise<Exercise[]> {
    const query = `
      SELECT e.*
      FROM exercises e
      WHERE e.equipment = $1 AND e.is_active = true
      ORDER BY e.name ASC
    `;
    const result = await database.query(query, [equipment]);
    return result.rows;
  }

  async getExercisesByDifficulty(
    difficulty: DifficultyLevel
  ): Promise<Exercise[]> {
    const query = `
      SELECT e.*
      FROM exercises e
      WHERE e.difficulty_level = $1 AND e.is_active = true
      ORDER BY e.name ASC
    `;
    const result = await database.query(query, [difficulty]);
    return result.rows;
  }

  async searchExercises(searchTerm: string): Promise<Exercise[]> {
    const query = `
      SELECT e.*
      FROM exercises e
      WHERE e.is_active = true 
        AND (
          LOWER(e.name) LIKE LOWER($1) 
          OR LOWER(e.description) LIKE LOWER($1)
          OR $2 = ANY(e.primary_muscles)
          OR $2 = ANY(e.secondary_muscles)
        )
      ORDER BY e.name ASC
    `;
    const searchPattern = `%${searchTerm}%`;
    const result = await database.query(query, [
      searchPattern,
      searchTerm.toLowerCase(),
    ]);
    return result.rows;
  }

  async createExercise(exerciseData: CreateExerciseDTO): Promise<Exercise> {
    const query = `
      INSERT INTO exercises (
        name, description, photo, photo_public_id, category, equipment, 
        difficulty_level, primary_muscles, secondary_muscles, instructions, 
        tips, is_active
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      exerciseData.name,
      exerciseData.description || null,
      exerciseData.photo || null,
      exerciseData.photo_public_id || null,
      exerciseData.category,
      exerciseData.equipment || null,
      exerciseData.difficulty_level,
      exerciseData.primary_muscles,
      exerciseData.secondary_muscles || [],
      exerciseData.instructions || [],
      exerciseData.tips || [],
      exerciseData.is_active !== undefined ? exerciseData.is_active : true,
    ];

    const result = await database.query(query, values);
    return result.rows[0];
  }

  async updateExercise(
    id: number,
    exerciseData: UpdateExerciseDTO
  ): Promise<Exercise | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    // Dynamically build the update query
    Object.entries(exerciseData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push(`updated_at = CURRENT_TIMESTAMP`);
    values.push(id);

    const query = `
      UPDATE exercises 
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex} AND is_active = true
      RETURNING *
    `;

    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  async deleteExercise(id: number): Promise<boolean> {
    // Soft delete by setting is_active to false
    const query = `
      UPDATE exercises 
      SET is_active = false, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
      RETURNING id
    `;
    const result = await database.query(query, [id]);
    return result.rows.length > 0;
  }

  async getExerciseStats(): Promise<any> {
    const query = `
      SELECT 
        COUNT(*) as total_exercises,
        COUNT(CASE WHEN category = 'chest' THEN 1 END) as chest_exercises,
        COUNT(CASE WHEN category = 'back' THEN 1 END) as back_exercises,
        COUNT(CASE WHEN category = 'shoulders' THEN 1 END) as shoulder_exercises,
        COUNT(CASE WHEN category = 'biceps' THEN 1 END) as biceps_exercises,
        COUNT(CASE WHEN category = 'triceps' THEN 1 END) as triceps_exercises,
        COUNT(CASE WHEN category = 'legs' THEN 1 END) as leg_exercises,
        COUNT(CASE WHEN category = 'core' THEN 1 END) as core_exercises,
        COUNT(CASE WHEN category = 'cardio' THEN 1 END) as cardio_exercises,
        COUNT(CASE WHEN category = 'full_body' THEN 1 END) as full_body_exercises,
        COUNT(CASE WHEN difficulty_level = 'beginner' THEN 1 END) as beginner_exercises,
        COUNT(CASE WHEN difficulty_level = 'intermediate' THEN 1 END) as intermediate_exercises,
        COUNT(CASE WHEN difficulty_level = 'advanced' THEN 1 END) as advanced_exercises
      FROM exercises 
      WHERE is_active = true
    `;
    const result = await database.query(query);
    return result.rows[0];
  }
}

export default new ExerciseService();
