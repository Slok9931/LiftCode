import database from "../config/database";
import dotenv from "dotenv";

dotenv.config();

const seedUsers = [
  {
    name: "Slok Tulsyan",
    email: "sloktulsya@gmail.com",
    dob: "2005-03-03",
    weight: 67.5,
    height: 180,
    profile_pic:
      "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400",
    profile_pic_public_id: "slok_profile_001",
    role: "gymmer",
  },
  {
    name: "Rahul Raj",
    email: "rahulraj@gmail.com",
    dob: "1990-05-15",
    weight: 95.0,
    height: 170,
    profile_pic:
      "https://images.unsplash.com/photo-1500917281340-7c8c1f8c8c8c?w=400",
    profile_pic_public_id: "rahul_profile_002",
    role: "gymmer",
  },
  {
    name: "Akshat Gupta",
    email: "akshatgupta099@gmail.com",
    dob: "2004-10-05",
    weight: 69,
    height: 182,
    profile_pic:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400",
    profile_pic_public_id: "akshat_profile_003",
    role: "viewer",
  },
];

async function createUsersTable(): Promise<void> {
  const createTableQuery = `
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
  `;

  const createIndexesQuery = `
    CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
    CREATE INDEX IF NOT EXISTS idx_users_role ON users(role);
    CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
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
    DROP TRIGGER IF EXISTS update_users_updated_at ON users;
    CREATE TRIGGER update_users_updated_at
        BEFORE UPDATE ON users
        FOR EACH ROW
        EXECUTE FUNCTION update_updated_at_column();
  `;

  try {
    console.log("🏗️  Creating users table...");
    await database.query(createTableQuery);

    console.log("📊 Creating indexes...");
    await database.query(createIndexesQuery);

    console.log("⚙️  Creating trigger function...");
    await database.query(createFunctionQuery);

    console.log("🔄 Creating trigger...");
    await database.query(createTriggerQuery);

    console.log("✅ Database schema created successfully!");
  } catch (error) {
    console.error("❌ Error creating database schema:", error);
    throw error;
  }
}

async function insertUsers(): Promise<void> {
  try {
    // Check if users already exist
    const existingUsersResult = await database.query(
      "SELECT COUNT(*) FROM users"
    );
    const userCount = parseInt(existingUsersResult.rows[0].count);

    if (userCount > 0) {
      console.log(
        `📝 ${userCount} users already exist in the database. Skipping seed...`
      );
      return;
    }

    console.log("👥 Seeding users...");

    for (const user of seedUsers) {
      const insertQuery = `
        INSERT INTO users (name, email, dob, weight, height, profile_pic, profile_pic_public_id, role)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *;
      `;

      const values = [
        user.name,
        user.email,
        user.dob,
        user.weight,
        user.height,
        user.profile_pic,
        user.profile_pic_public_id,
        user.role,
      ];

      const result = await database.query(insertQuery, values);
      console.log(
        `✅ Created user: ${result.rows[0].name} (${result.rows[0].role})`
      );
    }

    console.log("🎉 All users seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  }
}

async function main(): Promise<void> {
  try {
    console.log("🚀 Starting database setup...\n");

    await createUsersTable();
    console.log(""); // Empty line for better readability

    await insertUsers();
    console.log(""); // Empty line for better readability

    console.log("✅ Database setup completed successfully!");
    console.log(
      "👥 Total users in database:",
      (await database.query("SELECT COUNT(*) FROM users")).rows[0].count
    );

    // Display seeded users
    const users = await database.query(
      "SELECT id, name, email, role FROM users ORDER BY id"
    );
    console.log("\n📋 Seeded users:");
    users.rows.forEach((user: any) => {
      console.log(`  ${user.id}. ${user.name} (${user.email}) - ${user.role}`);
    });
  } catch (error) {
    console.error("💥 Database setup failed:", error);
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
