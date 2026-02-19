/**
 * API Error Response Type
 */
export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  code?: string;
  details?: Record<string, any>;
}

/**
 * API Success Response Type
 */
export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

/**
 * Todo Item Type
 */
export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

/**
 * Pagination Type
 */
export interface PaginationOptions {
  page: number;
  limit: number;
}

/**
 * Generic API Response
 */
export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
