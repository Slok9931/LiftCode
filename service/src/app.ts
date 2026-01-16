import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import dotenv from "dotenv";

import routes from "./routes";
import {
  errorHandler,
  notFoundHandler,
  requestLogger,
  corsOptions,
} from "./middleware/common";
import database from "./config/database";

// Load environment variables
dotenv.config();

class App {
  public express: express.Application;
  public port: number;

  constructor() {
    this.express = express();
    this.port = parseInt(process.env.PORT || "3001");

    this.initializeMiddleware();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddleware(): void {
    // Security middleware
    this.express.use(helmet());

    // CORS middleware
    this.express.use(cors(corsOptions));

    // Body parsing middleware
    this.express.use(express.json({ limit: "10mb" }));
    this.express.use(express.urlencoded({ extended: true }));

    // Logging middleware
    if (process.env.NODE_ENV === "development") {
      this.express.use(morgan("dev"));
    }
    this.express.use(requestLogger);
  }

  private initializeRoutes(): void {
    // API routes
    this.express.use("/api", routes);

    // Root endpoint
    this.express.get("/", (req, res) => {
      res.json({
        success: true,
        message: "Welcome to LiftCode API",
        version: "1.0.0",
        endpoints: {
          health: "/api/health",
          users: "/api/users",
          exercises: "/api/exercises",
        },
      });
    });
  }

  private initializeErrorHandling(): void {
    // 404 handler
    this.express.use(notFoundHandler);

    // Global error handler
    this.express.use(errorHandler);
  }

  public listen(): void {
    this.express.listen(this.port, () => {
      console.log(`🚀 LiftCode API is running on port ${this.port}`);
      console.log(`📊 Health check: http://localhost:${this.port}/api/health`);
      console.log(`👥 Users API: http://localhost:${this.port}/api/users`);
      console.log(
        `💪 Exercises API: http://localhost:${this.port}/api/exercises`
      );
      console.log(`🌍 Environment: ${process.env.NODE_ENV || "development"}`);
    });
  }

  public getApp(): express.Application {
    return this.express;
  }
}

export default App;
