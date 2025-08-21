import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, deleteTodo, fetchTodoById, fetchTodos } from "./service";


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
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: addTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
};

export const useDeleteTodo = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: deleteTodo,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['todos'] });
        }
    });
};

