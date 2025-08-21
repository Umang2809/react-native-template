import { getAPI, postAPI, putAPI, deleteAPI } from './AxiosActions';

// Todos API
export const fetchTodos = () => getAPI('/todos');
export const fetchTodoById = (id: number) => getAPI(`/todos/${id}`);
export const addTodo = (title: string) => postAPI('/todos', { title, completed: false });
export const updateTodo = (id: number, payload: { title?: string; completed?: boolean }) =>
    putAPI(`/todos/${id}`, payload);
export const deleteTodo = (id: number) => deleteAPI(`/todos/${id}`);
