import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, deleteTodo, fetchTodoById, fetchTodos } from "./service";
const queryClient = useQueryClient()

export const useTodos = () => {
    return useQuery({
        queryKey: ['todos'],
        queryFn: fetchTodos
    });
};

export const useTodoById = (id: number) => {
    return useQuery({
        queryKey: ['todo', id],
        queryFn: () => fetchTodoById(id)
    });
};

export const useAddTodo = () => {
    return useMutation({
        mutationFn: addTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
};

export const useDeleteTodo = () => {
    return useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
};

