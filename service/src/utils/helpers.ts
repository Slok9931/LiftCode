export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  count?: number;
  details?: string;
}

export interface PaginationOptions {
  page: number;
  limit: number;
  offset: number;
}

export interface QueryFilters {
  search?: string;
  role?: "gymmer" | "viewer";
  sortBy?: string;
  sortOrder?: "ASC" | "DESC";
}

export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

export const createResponse = <T>(
  success: boolean,
  message: string,
  data?: T,
  count?: number,
  details?: string
): ApiResponse<T> => ({
  success,
  message,
  ...(data !== undefined && { data }),
  ...(count !== undefined && { count }),
  ...(details && { details }),
});

export const calculatePagination = (
  page: number,
  limit: number
): PaginationOptions => {
  const normalizedPage = Math.max(1, page);
  const normalizedLimit = Math.min(Math.max(1, limit), 100); // Max 100 items per page
  const offset = (normalizedPage - 1) * normalizedLimit;

  return {
    page: normalizedPage,
    limit: normalizedLimit,
    offset,
  };
};
