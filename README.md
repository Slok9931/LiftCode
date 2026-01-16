# LiftCode - Workout Tracking Application

A comprehensive full-stack workout tracking application built with Node.js/Express backend and Next.js frontend.

## 🏗️ Architecture

### Backend (Node.js/Express) - Port 5000

- **Location**: `/service`
- **Database**: PostgreSQL
- **API Endpoints**: RESTful API for users, exercises, and workout sets
- **Features**: User management, exercise library, workout tracking

### Frontend (Next.js/React) - Port 3000

- **Location**: `/client`
- **Styling**: Custom CSS with dark theme (black & red color scheme)
- **Features**: Dashboard, exercise management, workout tracking, user management

## 🎨 Design Theme

- **Primary Colors**: Black backgrounds with red (#dc2626) accents
- **Theme**: Dark theme optimized for fitness tracking
- **Typography**: Modern, clean fonts with excellent readability
- **Layout**: Responsive design that works on desktop and mobile

## 🚀 Features

### 👥 User Management

- Create and manage users (Gymers and Viewers)
- User profiles with personal information
- Role-based access control

### 💪 Exercise Library

- Comprehensive exercise database
- Categories: Chest, Back, Shoulders, Arms, Legs, Core, Cardio
- Equipment types: Barbell, Dumbbell, Machine, Cable, Bodyweight, etc.
- Difficulty levels: Beginner, Intermediate, Advanced
- Exercise instructions and tips

### 🏋️ Workout Tracking

- Log workout sets with weight and reps
- Support for different set types:
  - Normal sets
  - Drop sets
  - Supersets
- Real-time workout session management
- Exercise volume calculations

### 📊 Statistics & Analytics

- Workout history and progress tracking
- Volume lifted over time
- Favorite exercises
- Personal records and achievements
- User-specific statistics dashboard

## 🛠️ API Endpoints

### Users

- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `GET /api/users/role/:role` - Get users by role
- `POST /api/users` - Create new user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Exercises

- `GET /api/exercises` - Get all exercises (with filters)
- `GET /api/exercises/:id` - Get exercise by ID
- `GET /api/exercises/stats` - Get exercise statistics
- `POST /api/exercises` - Create new exercise
- `PUT /api/exercises/:id` - Update exercise
- `DELETE /api/exercises/:id` - Delete exercise

### Workout Sets

- `POST /api/sets` - Create new set
- `POST /api/sets/bulk` - Bulk create sets
- `GET /api/sets/:id` - Get set by ID
- `PUT /api/sets/:id` - Update set
- `DELETE /api/sets/:id` - Delete set
- `GET /api/sets/user/:userId` - Get sets by user
- `GET /api/sets/user/:userId/exercise/:exerciseId` - Get sets by exercise
- `GET /api/sets/user/:userId/stats` - Get user workout statistics

## 📱 Frontend Pages

### 🏠 Dashboard (`/`)

- Overview of users, exercises, and recent activity
- Quick action buttons
- Statistics cards

### 💪 Exercises (`/exercises`)

- Browse and search exercises
- Filter by category, equipment, and difficulty
- Add/edit/delete exercises
- Detailed exercise information

### 🏋️ Workout (`/workout`)

- Start and manage workout sessions
- Add sets with different types
- Real-time volume tracking
- Exercise selection and logging

### 👥 Users (`/users`)

- User management interface
- Create and edit user profiles
- View user statistics
- Role management

### 📊 Statistics (`/stats`)

- Detailed workout analytics
- Progress tracking
- Personal records
- Activity history

### 👤 User Profile (`/users/:id`)

- Individual user details
- Workout history
- Personal statistics
- Profile management

## 🔧 Technical Stack

### Backend

- **Node.js** with Express.js
- **TypeScript** for type safety
- **PostgreSQL** database
- **Joi** for validation
- **CORS** enabled for cross-origin requests

### Frontend

- **Next.js 16** with App Router
- **React 19** with hooks
- **TypeScript** for type safety
- **Custom CSS** with CSS variables
- **Responsive design** for all screen sizes

## 🎯 Key Features Implemented

1. **Complete CRUD Operations** for all entities
2. **Type-safe API** with TypeScript interfaces
3. **Responsive UI** with mobile-first design
4. **Real-time Workout Tracking** with live updates
5. **Advanced Set Types** (normal, drop sets, supersets)
6. **Statistical Analysis** with progress tracking
7. **Role-based User Management**
8. **Exercise Filtering and Search**
9. **Dark Theme** optimized for gym use
10. **API Integration** with error handling

## 🚦 Getting Started

### Backend

```bash
cd service
npm install
npm run dev  # Starts on http://localhost:5000
```

### Frontend

```bash
cd client
npm install
npm run dev  # Starts on http://localhost:3000
```

## 🎨 Color Scheme

- **Primary Red**: #dc2626
- **Background Black**: #000000
- **Card Background**: #1f1f1f
- **Secondary Background**: #111111
- **Text Primary**: #ffffff
- **Text Secondary**: #a3a3a3
- **Text Muted**: #737373
- **Border**: #404040

The application is now fully functional with a complete backend API and a beautiful, responsive frontend that connects to the API running on localhost:5000. Users can manage their workouts, track exercises, and monitor their fitness progress through an intuitive dark-themed interface.
