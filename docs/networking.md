# Networking

API code is split into four layers, each in `src/api/`:

```
AxiosClient.ts   →  AxiosActions.ts  →  service.ts      →  queries.ts       →  screen
(instance,          (getAPI, postAPI,   (one function     (React Query
 interceptors)       put/patch/delete,    per endpoint)     hooks, one file)
 uploadAPI)
```

## 1. Axios client

`src/api/AxiosClient.ts` creates one instance:

```ts
export const axiosClient = axios.create({
  baseURL: API_BASE_URL,   // constants/AppConstants.tsx
  timeout: 60000,
});
```

### Attaching the auth token

Already done: the request interceptor reads `accessToken` from the auth slice and sends `Authorization: Bearer <token>` when there is one.

```ts
axiosClient.interceptors.request.use(config => {
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
| `getAPI<T>(url, params?)` | `GET` with query params |
| `postAPI<T>(url, payload?)` | `POST` with JSON body |
| `putAPI<T>(url, payload?)` | `PUT` with JSON body |
| `patchAPI<T>(url, payload?)` | `PATCH` with JSON body |
| `deleteAPI<T>(url, params?)` | `DELETE` with query params |
| `uploadAPI<T>(url, formData, config?)` | Multipart `POST` |

`T` is the response type (defaults to `unknown`).

Each returns `response.data` and, on failure, throws `err.response?.data` (the server's error body) or the original error if there was no response.

## 3. Services

Paths live in `constants/API_Routes.ts`. `src/api/service.ts` holds one small `do*` function per endpoint, typed with the shared types in `src/redux/types.d.ts`. The template ships a Todos example against JSONPlaceholder:

```ts
export const doLogin = (body: LoginForm) => postAPI<LoginResponse>(API_Routes.login, body);
export const doGetTodos = (params: TodoListParams) => getAPI<TodoItem[]>(API_Routes.todos, params);
export const doGetTodoById = (id: number) => getAPI<TodoItem>(`${API_Routes.todos}/${id}`);
export const doAddTodo = (title: string) =>
  postAPI<TodoItem>(API_Routes.todos, { title, completed: false });
export const doUpdateTodo = (id: number, body: Partial<Omit<TodoItem, 'id'>>) =>
  putAPI<TodoItem>(`${API_Routes.todos}/${id}`, body);
export const doDeleteTodo = (id: number) => deleteAPI(`${API_Routes.todos}/${id}`);
export const doUploadFile = (body: FormData) => uploadAPI(API_Routes.uploadFile, body);
```

## 4. React Query hooks

`src/api/queries.ts`:

| Hook | Kind | Query key | Invalidates |
| --- | --- | --- | --- |
Every hook lives in this one file. Cache invalidation goes in the hook; UI reactions (snackbar, navigation) go in the screen's `mutate(vars, { onSuccess, onError })`.

| Hook | Kind | Query key | Invalidates |
| --- | --- | --- | --- |
| `useLogin()` | mutation | | |
| `useTodoList()` | paginated (`usePaginatedAPI`) | `['todos', { search, limit }]` | |
| `useTodoById(id)` | query | `['todo', id]` | |
| `useAddTodo()` | mutation | | `['todos']` |
| `useUpdateTodo()` | mutation | | `['todos']`, `['todo', id]` |
| `useDeleteTodo()` | mutation | | `['todos']` |

```tsx
const TodoList = () => {
  const { theme } = useTheme();
  const { data, isRefreshing, isFetchingNextPage, handleScrollToBottom, handleRefetch } =
    useTodoList();
  const { mutate: addTodo } = useAddTodo();

  return (
    <FlatList
      data={data}
      keyExtractor={item => String(item.id)}
      renderItem={({ item }) => <Text style={{ color: theme.text }}>{item.title}</Text>}
      refreshing={isRefreshing}
      onRefresh={handleRefetch}
      onEndReached={handleScrollToBottom}
      ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={theme.primary} /> : null}
      ListHeaderComponent={
        <Button
          title="Add"
          onPress={() => addTodo('New todo', { onError: err => showErrorSnackbar(getErrorMessage(err)) })}
        />
      }
    />
  );
};
```

### Pagination (`usePaginatedAPI`)

`src/hooks/usePaginatedAPI.ts` wraps `useInfiniteQuery`:

```ts
export const useTodoList = () =>
  usePaginatedAPI({
    queryKey: ['todos'],
    queryFn: ({ pageParam, limit, search }) =>
      doGetTodos({ _page: pageParam, _limit: limit, q: search || undefined }),
    select: (pages: TodoItem[][]) => pages.flat(),
    limit: 20,
  });
```

| Option | Meaning |
| --- | --- |
| `queryKey` | Base key; `search`, `limit` and `dynamicParams` are appended |
| `queryFn({ pageParam, limit, search, dynamicParams })` | Fetches one page |
| `select(pages)` | Flattens pages into items |
| `limit` (10), `firstPage` (1) | Page size / first page |
| `dynamicParams` | Filters the request depends on |
| `hasNextPage(lastPage, allPages, limit)` | Override when the API returns a total or `hasMore`; default is "the last page had `limit` items" |
| `staleTime`, `enabled` | Passed through |

It returns `data` (flattened), `isLoading`, `isFetchingNextPage`, `isRefreshing`, `hasNextPage`, `error`, `handleScrollToBottom`, `handleRefetch`, `search`, `handleSearch` (debounced 400 ms), `resetSearch` and the raw `query`.

### Query client defaults

Set in `App.tsx`:

| Option | Value |
| --- | --- |
| `retry` | 1 |
| `staleTime` | 5 minutes |
| `gcTime` | 10 minutes |

## A real login, replacing the demo

`doLogin` and `useLogin` already exist. Point `API_Routes.login` at your backend, adjust `LoginResponse` in `types.d.ts`, then in `LoginScreen.tsx` replace the demo `dispatch` with the mutation:

```tsx
const { mutate: login, isPending } = useLogin();

const onLogin = () =>
  login({ email, password }, {
    onSuccess: res => {
      dispatch(setCredentials({ user: res.user, accessToken: res.accessToken }));
      navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
    },
    onError: err => showErrorSnackbar(getErrorMessage(err)),
  });

<Pressable onPress={onLogin} disabled={isPending}>…</Pressable>
```

`AxiosClient.ts` then sends `Authorization: Bearer <accessToken>` on every request.

## Error messages

Use `getErrorMessage(error)` from `src/helper/common-functions.ts`. It handles the server's error body (`{ message }`, which is what `AxiosActions` rethrows), an `AxiosError`, an `Error` or a string, and falls back to `AppString.somethingWentWrong`. Show it with `showErrorSnackbar(getErrorMessage(err))`.
