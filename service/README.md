# LiftCode Service API

A RESTful API service built with Express.js, TypeScript, and PostgreSQL (NeonDB) for the LiftCode application.

## Features

- 🚀 Express.js with TypeScript
- 🔒 Security middleware (Helmet, CORS)
- 📊 PostgreSQL database with NeonDB
- 🎯 User management with roles (gymmer/viewer)
- ✅ Input validation with Joi
- 📝 Request logging
- 🔄 Database migrations and seeding
- 🐳 Production-ready structure

## Project Structure

```
src/
├── config/
│   └── database.ts          # Database configuration
├── controllers/
│   └── userController.ts    # User route handlers
├── middleware/
│   ├── common.ts           # Common middleware
│   └── validation.ts       # Input validation
├── models/
│   └── User.ts             # User interfaces/types
├── routes/
│   ├── index.ts            # Main router
│   └── userRoutes.ts       # User routes
├── services/
│   └── userService.ts      # User business logic
├── utils/
│   └── helpers.ts          # Utility functions
├── database/
│   └── schema.sql          # Database schema
├── scripts/
│   └── seedUsers.ts        # Database seeding script
├── app.ts                  # Express app configuration
└── index.ts               # Application entry point
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- NeonDB account and database

### Installation

1. **Clone the repository and navigate to the service directory:**

   ```bash
   cd LiftCode/service
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Environment Setup:**

   Copy the `.env` file and update it with your NeonDB connection string:

   ```bash
   cp .env .env.local
   ```

   Update `.env.local` with your actual database URL:

   ```env
   NODE_ENV=development
   PORT=3001
   DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
   ```

4. **Set up the database and seed users:**

   ```bash
   npm run seed
   ```

5. **Start the development server:**
   ```bash
   npm run dev
   ```

The API will be available at `http://localhost:3001`

### Production Build

1. **Build the application:**

   ```bash
   npm run build
   ```

2. **Start the production server:**
   ```bash
   npm start
   ```

## API Endpoints

### Health Check

- `GET /api/health` - Health check endpoint

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/role/:role` - Get users by role (gymmer/viewer)
- `POST /api/users` - Create a new user
- `PUT /api/users/:id` - Update user by ID
- `DELETE /api/users/:id` - Delete user by ID

### Example Request/Response

**GET /api/users**

```json
{
  "success": true,
  "message": "Users retrieved successfully",
  "data": [
    {
      "id": 1,
      "name": "Alex Johnson",
      "email": "alex.johnson@example.com",
      "dob": "1995-03-15T00:00:00.000Z",
      "weight": "75.50",
      "height": "180.00",
      "profile_pic": "https://images.unsplash.com/photo-1566492031773-4f4e44671d66?w=400",
      "profile_pic_public_id": "alex_profile_001",
      "role": "gymmer",
      "created_at": "2024-01-16T10:30:00.000Z",
      "updated_at": "2024-01-16T10:30:00.000Z"
    }
  ],
  "count": 1
}
```

**POST /api/users**

```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "dob": "1990-05-15",
  "weight": 70.5,
  "height": 175,
  "profile_pic": "https://example.com/profile.jpg",
  "profile_pic_public_id": "john_profile_001",
  "role": "gymmer"
}
```

## Database Schema

### Users Table

```sql
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    dob DATE NOT NULL,
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0 AND weight <= 1000),
    height DECIMAL(5,2) NOT NULL CHECK (height > 0 AND height <= 300),
    profile_pic VARCHAR(500),
    profile_pic_public_id VARCHAR(255),
    role VARCHAR(10) NOT NULL CHECK (role IN ('gymmer', 'viewer')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Seeded Users

The application comes with 3 pre-seeded users:

1. **Alex Johnson** (alex.johnson@example.com) - Role: gymmer
2. **Sarah Davis** (sarah.davis@example.com) - Role: gymmer
3. **Mike Wilson** (mike.wilson@example.com) - Role: viewer

## Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run seed` - Set up database and seed users

## Environment Variables

| Variable     | Description                  | Default     |
| ------------ | ---------------------------- | ----------- |
| NODE_ENV     | Environment mode             | development |
| PORT         | Server port                  | 3001        |
| DATABASE_URL | PostgreSQL connection string | -           |

## NeonDB Setup

1. **Create a NeonDB account** at [neon.tech](https://neon.tech)

2. **Create a new database project**

3. **Get your connection string** from the dashboard

4. **Update your `.env` file** with the connection string:
   ```env
   DATABASE_URL=postgresql://username:password@hostname:port/database?sslmode=require
   ```

## Error Handling

The API includes comprehensive error handling:

- **400 Bad Request** - Validation errors
- **404 Not Found** - Resource not found
- **409 Conflict** - Duplicate resources (e.g., email already exists)
- **500 Internal Server Error** - Server errors

## Security Features

- **Helmet.js** - Security headers
- **CORS** - Cross-origin resource sharing
- **Input Validation** - Joi schema validation
- **SQL Injection Protection** - Parameterized queries
- **Rate Limiting Ready** - Structure supports rate limiting middleware

## License

MIT License
