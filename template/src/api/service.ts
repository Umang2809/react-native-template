import { API_Routes } from '../../constants/API_Routes';
import type { LoginForm, LoginResponse, TodoItem, TodoListParams } from '../redux/types';
import { deleteAPI, getAPI, postAPI, putAPI, uploadAPI } from './AxiosActions';

/**
 * One function per endpoint, prefixed with `do`. Screens never call these
 * directly: wrap each one in a hook in queries.ts.
 */

// Auth
export const doLogin = (body: LoginForm) => postAPI<LoginResponse>(API_Routes.login, body);

// Todos (demo)
export const doGetTodos = (params: TodoListParams) => getAPI<TodoItem[]>(API_Routes.todos, params);
export const doGetTodoById = (id: number) => getAPI<TodoItem>(`${API_Routes.todos}/${id}`);
export const doAddTodo = (title: string) =>
  postAPI<TodoItem>(API_Routes.todos, { title, completed: false });
export const doUpdateTodo = (id: number, body: Partial<Omit<TodoItem, 'id'>>) =>
  putAPI<TodoItem>(`${API_Routes.todos}/${id}`, body);
export const doDeleteTodo = (id: number) => deleteAPI(`${API_Routes.todos}/${id}`);

// Files
export const doUploadFile = (body: FormData) => uploadAPI(API_Routes.uploadFile, body);
