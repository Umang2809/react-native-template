# Networking

API code is split into four layers, each in `src/api/`:

```
AxiosClient.ts   →  AxiosActions.ts  →  service.ts      →  queries.ts       →  screen
(instance,          (getAPI, postAPI,   (one function     (React Query
 interceptors)       putAPI, deleteAPI)   per endpoint)     hooks)
```

## 1. Axios client

`src/api/AxiosClient.ts` creates one instance:

```ts
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,   // constants/AppConstants.tsx
  timeout: 60000,
});
```

The request interceptor is a pass-through today. It is where you attach headers.

### Attaching the auth token

```ts
import store from '../redux/store';

axiosClient.interceptors.request.use((config) => {
  const token = store.getState().auth.accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Handling 401s

```ts
import { clearAuth } from '../redux/slices/authSlice';
import { navigateAndSimpleReset } from '../helper/navigation-service';

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      store.dispatch(clearAuth());
      navigateAndSimpleReset('LoginScreen');
    }
    return Promise.reject(error);
  },
);
```

> Importing `store` into `AxiosClient.ts` can create a circular import if a slice later imports from `api/`. If that happens, inject a token getter at startup instead (`setTokenGetter(() => store.getState().auth.accessToken)`).

## 2. Request helpers

`src/api/AxiosActions.ts`:

| Function | Request |
| --- | --- |
| `getAPI(url, params?)` | `GET` with query params |
| `postAPI(url, payload)` | `POST` with JSON body |
| `putAPI(url, payload)` | `PUT` with JSON body |
| `deleteAPI(url, params?)` | `DELETE` with query params |

Each returns `response.data` and, on failure, throws `err.response?.data` (the server's error body) or the original error if there was no response.

## 3. Services

`src/api/service.ts` holds one small function per endpoint. The template ships a Todos example against JSONPlaceholder:

```ts
export const fetchTodos = () => getAPI('/todos');
export const fetchTodoById = (id: number) => getAPI(`/todos/${id}`);
export const addTodo = (title: string) => postAPI('/todos', { title, completed: false });
export const updateTodo = (id: number, payload: { title?: string; completed?: boolean }) =>
  putAPI(`/todos/${id}`, payload);
export const deleteTodo = (id: number) => deleteAPI(`/todos/${id}`);
```

Type the return values once you have real endpoints, using the shared types in `src/redux/types.d.ts`:

```ts
import type { TodoItem } from '../redux/types';
export const fetchTodos = (): Promise<TodoItem[]> => getAPI('/todos');
```

## 4. React Query hooks

`src/api/queries.ts`:

| Hook | Kind | Query key | Invalidates |
| --- | --- | --- | --- |
| `useTodos()` | query | `['todos']` | |
| `useTodoById(id)` | query | `['todo', id]` | |
| `useAddTodo()` | mutation | | `['todos']` |
| `useDeleteTodo()` | mutation | | `['todos']` |

```tsx
const TodoList = () => {
  const { data, isLoading, error, refetch } = useTodos();
  const addTodo = useAddTodo();

  if (isLoading) return <ActivityIndicator />;
  if (error) return <Text>Failed to load</Text>;

  return (
    <>
      <FlatList data={data} renderItem={({ item }) => <Text>{item.title}</Text>} />
      <Button title="Add" onPress={() => addTodo.mutate('New todo')} />
    </>
  );
};
```

### Query client defaults

Set in `App.tsx`:

| Option | Value |
| --- | --- |
| `retry` | 1 |
| `staleTime` | 5 minutes |
| `gcTime` | 10 minutes |

## A real login, replacing the demo

```ts
// service.ts
export const login = (body: { email: string; password: string }) =>
  postAPI('/auth/login', body);

// queries.ts
export const useLogin = () => {
  const dispatch = useAppDispatch();
  return useMutation({
    mutationFn: login,
    onSuccess: ({ user, accessToken }) => {
      dispatch(setCredentials({ user, accessToken }));
    },
  });
};
```

```tsx
// LoginScreen.tsx
const loginMutation = useLogin();

const onLogin = () =>
  loginMutation.mutate(
    { email, password },
    { onSuccess: () => navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] }) },
  );
```

## Error messages

`src/helper/common-functions.ts` contains an `errorMessage(error)` helper that pulls `response.data.message` from Axios errors. It is not exported yet; export it if you want to use it in screens. Note that because `AxiosActions` rethrows the response body, errors that reach React Query are usually the server body itself, not an `AxiosError`.
