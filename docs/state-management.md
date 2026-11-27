# State Management

The template uses **Redux Toolkit** for client state and **redux-persist** (backed by MMKV) to keep selected slices across app restarts. Server data belongs in React Query, not Redux. See [Networking](./networking.md).

## The store

`src/redux/store.ts`:

```ts
const persistConfig = {
  key: 'root',
  storage: reduxStorage,   // MMKV adapter from constants/StoragePreferences.ts
  whitelist: ['auth'],     // only the auth slice is persisted
};

const rootReducer = combineReducers({
  global: reducer,         // src/redux/slice.ts
  auth: authReducer,       // src/redux/slices/authSlice.ts
});
```

Exports:

| Export | Type | Use |
| --- | --- | --- |
| `store` (default) | Redux store | Passed to `<Provider>`; use `store.getState()` outside React |
| `persistor` | Persistor | Passed to `<PersistGate>`; `persistor.purge()` wipes persisted state |
| `useAppDispatch` | hook | Typed `dispatch` |
| `useAppSelector` | hook | Typed selector over `RootStore` |
| `RootStore` | type | `ReturnType<typeof store.getState>` |
| `AppDispatch` | type | Store dispatch type |

`serializableCheck` is turned off because redux-persist dispatches non-serializable actions. If you want the check back, ignore only the persist actions:

```ts
import { FLUSH, PAUSE, PERSIST, PURGE, REGISTER, REHYDRATE } from 'redux-persist';

middleware: (getDefaultMiddleware) =>
  getDefaultMiddleware({
    serializableCheck: {
      ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
    },
  }),
```

## Using state in a component

```tsx
import { useAppDispatch, useAppSelector } from '../redux/store';
import { setValue, resetValue } from '../redux/slice';

const Counter = () => {
  const value = useAppSelector((state) => state.global.value);
  const dispatch = useAppDispatch();

  return (
    <>
      <Text>{value}</Text>
      <Button title="+1" onPress={() => dispatch(setValue(value + 1))} />
      <Button title="Reset" onPress={() => dispatch(resetValue())} />
    </>
  );
};
```

## The `global` example slice

`src/redux/slice.ts` holds a single number and two actions. It is a placeholder: rename or delete it once you have real slices.

| Action | Payload | Effect |
| --- | --- | --- |
| `setValue` | `number` | Sets `state.value` |
| `resetValue` | none | Sets `state.value` to `0` |

## The `auth` slice

`src/redux/slices/authSlice.ts`

```ts
interface AuthState {
  user: User | null; // User is in src/redux/types.d.ts
  accessToken: string | null;
}
```

| Action | Payload | Effect |
| --- | --- | --- |
| `setCredentials` | `{ user, accessToken }` | Sets both after login |
| `setUser` | `User \| null` | Updates only the user |
| `setAccessToken` | `string \| null` | Updates only the token (e.g. after refresh) |
| `clearAuth` | none | Clears both (logout) |

Selectors (typed with `RootStore`): `selectCurrentUser`, `selectAccessToken`, `selectIsLoggedIn`.

### Auth flow end to end

1. **Login**: `dispatch(setCredentials({ user, accessToken }))`. redux-persist writes the `auth` slice to MMKV.
2. **Relaunch**: `PersistGate` rehydrates `auth` before rendering. `SplashScreen` reads `accessToken` and resets the stack to `HomeScreen`.
3. **Logout**: `dispatch(clearAuth())`, then reset navigation to `LoginScreen`. The empty slice is persisted, so the next launch lands on Login.

```tsx
import { clearAuth } from '../redux/slices/authSlice';
import { navigateAndSimpleReset } from '../helper/navigation-service';

const logout = () => {
  dispatch(clearAuth());
  navigateAndSimpleReset('LoginScreen');
};
```

### Reading the token outside React

Interceptors and services cannot use hooks. Read the store directly:

```ts
import store from '../redux/store';

const token = store.getState().auth.accessToken;
```

See [Networking → attaching the token](./networking.md#attaching-the-auth-token) for the full interceptor.

## Persisting more slices

Add the slice name to `whitelist`:

```ts
whitelist: ['auth', 'settings'],
```

To persist a slice but skip some of its fields, give it its own nested config:

```ts
const settingsPersistConfig = {
  key: 'settings',
  storage: reduxStorage,
  blacklist: ['temporaryFlag'],
};

const rootReducer = combineReducers({
  global: reducer,
  auth: authReducer,
  settings: persistReducer(settingsPersistConfig, settingsReducer),
});
```

When you change the shape of a persisted slice in a release, add a `version` and `migrate` to the persist config, or users upgrading will rehydrate stale data.
