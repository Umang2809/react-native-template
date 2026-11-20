# Customization Recipes

## Add a Redux slice

```ts
// src/redux/slices/settingsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface SettingsState {
  language: string;
  notifications: boolean;
}

const initialState: SettingsState = { language: 'en', notifications: true };

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
    toggleNotifications(state) {
      state.notifications = !state.notifications;
    },
  },
});

export const { setLanguage, toggleNotifications } = settingsSlice.actions;
export default settingsSlice.reducer;
```

Register it in `src/redux/store.ts`:

```ts
const rootReducer = combineReducers({
  global: reducer,
  auth: authReducer,
  settings: settingsReducer,
});
```

Add `'settings'` to `whitelist` if it should survive restarts.

## Add an API endpoint

1. `src/api/service.ts`: `export const fetchProfile = (id: string) => getAPI(`/users/${id}`);`
2. `src/api/queries.ts`:

   ```ts
   export const useProfile = (id: string) =>
     useQuery({ queryKey: ['profile', id], queryFn: () => fetchProfile(id), enabled: !!id });
   ```

3. Use `useProfile(id)` in a screen.

## Switch environments (dev / staging / prod)

`API_BASE_URL` is a hard-coded constant. The simplest option is `__DEV__`:

```ts
export const API_BASE_URL = __DEV__
  ? 'https://staging.api.example.com'
  : 'https://api.example.com';
```

For more than two environments, use [react-native-config](https://github.com/lugg/react-native-config) with `.env.staging` / `.env.production` files and Android product flavors / iOS schemes.

## Rename the app or bundle ID

The CLI sets the name at creation. To change the bundle ID later, use:

```bash
npx react-native-rename "New Name" -b com.company.newname
```

## Add an icon library

```bash
npm install react-native-vector-icons
```

Or use SVGs: `react-native-svg` is already installed. Add `react-native-svg-transformer` to import `.svg` files from `src/assets/svg/` as components.

## Clear everything on logout

```ts
import { persistor } from '../redux/store';
import { removeAll } from '../../constants/StoragePreferences';
import { queryClient } from '../../App'; // export it first

dispatch(clearAuth());
await persistor.purge();
queryClient.clear();
removeAll(); // only if nothing else in MMKV should survive logout
```

## Remove what you don't need

| To remove | Delete / change |
| --- | --- |
| Todos example | `service.ts` / `queries.ts` contents, `TodoItem` in `types.d.ts` |
| `global` example slice | `src/redux/slice.ts` and its entry in `store.ts` |
| Demo login | Replace `LoginScreen` body; keep `setCredentials` |
| React Query | `QueryClientProvider` in `App.tsx`, `src/api/queries.ts`, the package and ESLint plugin |
