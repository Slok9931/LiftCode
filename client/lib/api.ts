import {
  ApiResponse,
  PaginatedResponse,
  User,
  CreateUserDTO,
  Exercise,
  CreateExerciseDTO,
  ExerciseFilters,
  Set,
  CreateSetDTO,
  SetWithExercises,
  UserWorkoutStats,
} from "./types";

const API_BASE_URL = "http://localhost:5000/api";

class ApiService {
  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || `HTTP error! status: ${response.status}`
        );
      }

      return data;
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      return {
        success: false,
        error:
          error instanceof Error ? error.message : "Unknown error occurred",
      };
    }
  }

  // Health check
  async healthCheck(): Promise<
    ApiResponse<{ message: string; timestamp: string }>
  > {
    return this.request("/health");
  }

  // User APIs
  async getAllUsers(): Promise<ApiResponse<User[]>> {
    return this.request("/users");
  }

  async getUserById(id: number): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`);
  }

  async getUsersByRole(
    role: "gymmer" | "viewer"
  ): Promise<ApiResponse<User[]>> {
    return this.request(`/users/role/${role}`);
  }

  async createUser(userData: CreateUserDTO): Promise<ApiResponse<User>> {
    return this.request("/users", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  async updateUser(
    id: number,
    userData: Partial<CreateUserDTO>
  ): Promise<ApiResponse<User>> {
    return this.request(`/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  async deleteUser(id: number): Promise<ApiResponse<void>> {
    return this.request(`/users/${id}`, {
      method: "DELETE",
    });
  }

  // Exercise APIs
  async getAllExercises(
    filters?: ExerciseFilters
  ): Promise<ApiResponse<Exercise[]>> {
    const queryParams = new URLSearchParams();
    if (filters?.category) queryParams.append("category", filters.category);
    if (filters?.equipment) queryParams.append("equipment", filters.equipment);
    if (filters?.difficulty)
      queryParams.append("difficulty", filters.difficulty);
    if (filters?.search) queryParams.append("search", filters.search);

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/exercises?${queryString}` : "/exercises";

    return this.request(endpoint);
  }

  async getExerciseById(id: number): Promise<ApiResponse<Exercise>> {
    return this.request(`/exercises/${id}`);
  }

  async createExercise(
    exerciseData: CreateExerciseDTO
  ): Promise<ApiResponse<Exercise>> {
    return this.request("/exercises", {
      method: "POST",
      body: JSON.stringify(exerciseData),
    });
  }

  async updateExercise(
    id: number,
    exerciseData: Partial<CreateExerciseDTO>
  ): Promise<ApiResponse<Exercise>> {
    return this.request(`/exercises/${id}`, {
      method: "PUT",
      body: JSON.stringify(exerciseData),
    });
  }

  async deleteExercise(id: number): Promise<ApiResponse<void>> {
    return this.request(`/exercises/${id}`, {
      method: "DELETE",
    });
  }

  async getExerciseStats(): Promise<ApiResponse<any>> {
    return this.request("/exercises/stats");
  }

  // Set APIs
  async createSet(setData: CreateSetDTO): Promise<ApiResponse<Set>> {
    return this.request("/sets", {
      method: "POST",
      body: JSON.stringify(setData),
    });
  }

  async bulkCreateSets(setsData: CreateSetDTO[]): Promise<ApiResponse<Set[]>> {
    return this.request("/sets/bulk", {
      method: "POST",
      body: JSON.stringify(setsData),
    });
  }

  async getSetById(id: number): Promise<ApiResponse<SetWithExercises>> {
    return this.request(`/sets/${id}`);
  }

  async updateSet(
    id: number,
    setData: Partial<CreateSetDTO>
  ): Promise<ApiResponse<Set>> {
    return this.request(`/sets/${id}`, {
      method: "PUT",
      body: JSON.stringify(setData),
    });
  }

  async deleteSet(id: number): Promise<ApiResponse<void>> {
    return this.request(`/sets/${id}`, {
      method: "DELETE",
    });
  }

  async getSetsByUserId(
    userId: number
  ): Promise<ApiResponse<SetWithExercises[]>> {
    return this.request(`/sets/user/${userId}`);
  }

  async getSetsByExercise(
    userId: number,
    exerciseId: number
  ): Promise<ApiResponse<SetWithExercises[]>> {
    return this.request(`/sets/user/${userId}/exercise/${exerciseId}`);
  }

  async getSetsByWorkoutSession(
    workoutSessionId: number
  ): Promise<ApiResponse<SetWithExercises[]>> {
    return this.request(`/sets/session/${workoutSessionId}`);
  }

  async getUserWorkoutStats(
    userId: number
  ): Promise<ApiResponse<UserWorkoutStats>> {
    return this.request(`/sets/user/${userId}/stats`);
  }
}

export const apiService = new ApiService();
export default apiService;
