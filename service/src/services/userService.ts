import database from "../config/database";
import { User, CreateUserDTO, UpdateUserDTO } from "../models/User";

export class UserService {
  public async createUser(userData: CreateUserDTO): Promise<User> {
    const query = `
      INSERT INTO users (name, email, dob, weight, height, profile_pic, profile_pic_public_id, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW(), NOW())
      RETURNING *
    `;

    const values = [
      userData.name,
      userData.email,
      userData.dob || null,
      userData.weight || null,
      userData.height || null,
      userData.profile_pic || null,
      userData.profile_pic_public_id || null,
      userData.role,
    ];

    const result = await database.query(query, values);
    return result.rows[0];
  }

  public async getAllUsers(): Promise<User[]> {
    const query = "SELECT * FROM users ORDER BY created_at DESC";
    const result = await database.query(query);
    return result.rows;
  }

  public async getUserById(id: number): Promise<User | null> {
    const query = "SELECT * FROM users WHERE id = $1";
    const result = await database.query(query, [id]);
    return result.rows[0] || null;
  }

  public async getUserByEmail(email: string): Promise<User | null> {
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await database.query(query, [email]);
    return result.rows[0] || null;
  }

  public async updateUser(
    id: number,
    userData: UpdateUserDTO
  ): Promise<User | null> {
    const fields = [];
    const values = [];
    let paramCount = 1;

    // Dynamically build the update query based on provided fields
    Object.entries(userData).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramCount}`);
        values.push(value);
        paramCount++;
      }
    });

    if (fields.length === 0) {
      throw new Error("No fields to update");
    }

    fields.push(`updated_at = NOW()`);
    values.push(id);

    const query = `
      UPDATE users 
      SET ${fields.join(", ")} 
      WHERE id = $${paramCount}
      RETURNING *
    `;

    const result = await database.query(query, values);
    return result.rows[0] || null;
  }

  public async deleteUser(id: number): Promise<boolean> {
    const query = "DELETE FROM users WHERE id = $1";
    const result = await database.query(query, [id]);
    return result.rowCount > 0;
  }

  public async getUsersByRole(role: "gymmer" | "viewer"): Promise<User[]> {
    const query =
      "SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC";
    const result = await database.query(query, [role]);
    return result.rows;
  }
}
