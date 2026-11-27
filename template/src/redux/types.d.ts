/**
 * Shared types: API request bodies, response models and app entities.
 * Component props stay in their component file; route params live in
 * src/navigation/AppStackParams.ts.
 */

// ---------- API envelopes ----------

export interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  code?: string;
  details?: Record<string, unknown>;
}

export interface ApiSuccessResponse<T> {
  data: T;
  message?: string;
  statusCode?: number;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginationOptions {
  page: number;
  limit: number;
}

// ---------- Auth ----------

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
}

export interface LoginForm {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  accessToken: string;
  refreshToken?: string;
}

// ---------- Todos (demo) ----------

export interface TodoItem {
  id: number;
  title: string;
  completed: boolean;
}

export interface TodoListParams {
  _page: number;
  _limit: number;
  q?: string;
}
