/**
 * Every backend endpoint, in one place. Service functions in
 * src/api/service.ts build URLs from these; screens never hard-code paths.
 *
 * Group by feature. For routes with an id, store the base path and append
 * the id in the service function: `${API_Routes.todos}/${id}`.
 */
export const API_Routes = {
  // Auth
  login: '/auth/login',
  register: '/auth/register',
  refreshToken: '/auth/refresh',

  // Todos (demo endpoints on jsonplaceholder.typicode.com)
  todos: '/todos',

  // Files
  uploadFile: '/files',
} as const;
