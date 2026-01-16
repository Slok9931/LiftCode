import { Request, Response } from "express";
import { UserService } from "../services/userService";
import {
  validateCreateUser,
  validateUpdateUser,
} from "../middleware/validation";

export class UserController {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  public createUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const { error } = validateCreateUser(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          details: error.details[0].message,
        });
        return;
      }

      // Check if user with email already exists
      const existingUser = await this.userService.getUserByEmail(
        req.body.email
      );
      if (existingUser) {
        res.status(409).json({
          success: false,
          message: "User with this email already exists",
        });
        return;
      }

      const user = await this.userService.createUser(req.body);
      res.status(201).json({
        success: true,
        message: "User created successfully",
        data: user,
      });
    } catch (error) {
      console.error("Create user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  public getAllUsers = async (req: Request, res: Response): Promise<void> => {
    try {
      const users = await this.userService.getAllUsers();
      res.status(200).json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
        count: users.length,
      });
    } catch (error) {
      console.error("Get all users error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  public getUserById = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
        return;
      }

      const user = await this.userService.getUserById(userId);
      if (!user) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      console.error("Get user by ID error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  public updateUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
        return;
      }

      const { error } = validateUpdateUser(req.body);
      if (error) {
        res.status(400).json({
          success: false,
          message: "Validation error",
          details: error.details[0].message,
        });
        return;
      }

      // Check if user exists
      const existingUser = await this.userService.getUserById(userId);
      if (!existingUser) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      // If email is being updated, check if new email already exists
      if (req.body.email && req.body.email !== existingUser.email) {
        const emailExists = await this.userService.getUserByEmail(
          req.body.email
        );
        if (emailExists) {
          res.status(409).json({
            success: false,
            message: "User with this email already exists",
          });
          return;
        }
      }

      const updatedUser = await this.userService.updateUser(userId, req.body);
      res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      console.error("Update user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  public deleteUser = async (req: Request, res: Response): Promise<void> => {
    try {
      const userId = parseInt(req.params.id);
      if (isNaN(userId)) {
        res.status(400).json({
          success: false,
          message: "Invalid user ID",
        });
        return;
      }

      const deleted = await this.userService.deleteUser(userId);
      if (!deleted) {
        res.status(404).json({
          success: false,
          message: "User not found",
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      console.error("Delete user error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };

  public getUsersByRole = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const role = req.params.role as "gymmer" | "viewer";

      if (!["gymmer", "viewer"].includes(role)) {
        res.status(400).json({
          success: false,
          message: 'Invalid role. Must be either "gymmer" or "viewer"',
        });
        return;
      }

      const users = await this.userService.getUsersByRole(role);
      res.status(200).json({
        success: true,
        message: `${role} users retrieved successfully`,
        data: users,
        count: users.length,
      });
    } catch (error) {
      console.error("Get users by role error:", error);
      res.status(500).json({
        success: false,
        message: "Internal server error",
      });
    }
  };
}
