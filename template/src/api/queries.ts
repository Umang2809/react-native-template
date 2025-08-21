import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { addTodo, deleteTodo, fetchTodoById, fetchTodos } from "./service";
const queryClient = useQueryClient()

export const useTodos = useQuery({ queryKey: ['todos'], queryFn: fetchTodos });

export const useTodoById = (id: number) => useQuery({ queryKey: ['todo', id], queryFn: () => fetchTodoById(id) })

export const useAddTodo = useMutation({
    mutationFn: addTodo,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
})

export const deleteTodoMutation = useMutation({
    mutationFn: deleteTodo,
    onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['todos'] });
    }
});

