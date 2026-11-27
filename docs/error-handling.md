# Error Handling

## ErrorBoundary

`src/components/ErrorBoundary.tsx` wraps the whole app in `App.tsx`. When any component below it throws during render, it shows a fallback screen instead of a blank crash.

What it shows:

- A "Something Went Wrong" card with a **Try Again** button that resets the boundary and re-renders the children.
- In development (`__DEV__`) only: the error message and component stack.

It logs the error with `console.error` in `componentDidCatch`. That's the hook point for a crash reporter:

```tsx
componentDidCatch(error: Error, errorInfo: ErrorInfo) {
  console.error('ErrorBoundary caught an error:', error);
  // crashlytics().recordError(error);
  // Sentry.captureException(error, { extra: errorInfo });
  this.setState({ error, errorInfo });
}
```

What it does **not** catch (React limitation):

- Errors in event handlers (`onPress`), timers and promises: wrap those in `try/catch`.
- Native crashes: you need a native crash reporter (Crashlytics, Sentry).

You can also wrap individual features so one broken widget doesn't take down the whole screen:

```tsx
<ErrorBoundary>
  <RecommendationsCarousel />
</ErrorBoundary>
```

The fallback uses fixed colors on purpose, since the theme provider may be the thing that crashed.

## API errors

`AxiosActions` throws the server's response body when there is one (`err.response?.data`), otherwise the original error. With React Query, read it from `error`:

```tsx
import { getErrorMessage, showErrorSnackbar } from '../helper/common-functions';

const { error } = useTodoById(id);
const message = error ? getErrorMessage(error) : null;

// In a mutation:
mutate(vars, { onError: err => showErrorSnackbar(getErrorMessage(err)) });
```

Shared response types live in `src/redux/types.d.ts`:

```ts
interface ApiErrorResponse {
  message: string;
  statusCode?: number;
  code?: string;
  details?: Record<string, unknown>;
}
```

For a consistent shape, normalize errors in one place: a response interceptor in `AxiosClient.ts` that always rejects with an `ApiErrorResponse`.
