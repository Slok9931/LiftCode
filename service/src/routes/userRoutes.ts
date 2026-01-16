import { Router } from "express";
import { UserController } from "../controllers/userController";

const router = Router();
const userController = new UserController();

// GET /api/users - Get all users
router.get("/", userController.getAllUsers);

// GET /api/users/:id - Get user by ID
router.get("/:id", userController.getUserById);

// GET /api/users/role/:role - Get users by role (gymmer or viewer)
router.get("/role/:role", userController.getUsersByRole);

// POST /api/users - Create a new user
router.post("/", userController.createUser);

// PUT /api/users/:id - Update user by ID
router.put("/:id", userController.updateUser);

// DELETE /api/users/:id - Delete user by ID
router.delete("/:id", userController.deleteUser);

export default router;
