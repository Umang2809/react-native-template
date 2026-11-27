import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  doAddTodo,
  doDeleteTodo,
  doGetTodoById,
  doGetTodos,
  doLogin,
  doUpdateTodo,
} from './service';
import { usePaginatedAPI } from '../hooks/usePaginatedAPI';
import type { TodoItem } from '../redux/types';

/**
 * SINGLE FILE for every React Query hook in the app.
 * - Cache invalidation goes here (in the mutation's onSuccess).
 * - UI reactions (snackbar, navigation) go in the screen's
 *   `mutate(vars, { onSuccess, onError })`.
 */

// ---------- Auth ----------

export const useLogin = () => useMutation({ mutationFn: doLogin });

// ---------- Todos (demo) ----------

export const useTodoList = () =>
  usePaginatedAPI({
    queryKey: ['todos'],
    queryFn: ({ pageParam, limit, search }) =>
      doGetTodos({ _page: pageParam, _limit: limit, q: search || undefined }),
    select: (pages: TodoItem[][]) => pages.flat(),
    limit: 20,
  });

export const useTodoById = (id: number) =>
  useQuery({
    queryKey: ['todo', id],
    queryFn: () => doGetTodoById(id),
    enabled: !!id,
  });

export const useAddTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doAddTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
};

export const useUpdateTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...body }: Pick<TodoItem, 'id'> & Partial<Omit<TodoItem, 'id'>>) =>
      doUpdateTodo(id, body),
    onSuccess: (_data, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
      queryClient.invalidateQueries({ queryKey: ['todo', id] });
    },
  });
};

export const useDeleteTodo = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doDeleteTodo,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['todos'] }),
  });
};
