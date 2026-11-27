# Project Structure

```
MyApp/
├── App.tsx                    # Root component: provider tree
├── Main.tsx                   # NavigationContainer (theme-synced) + StatusBar + AppStack
├── index.js                   # AppRegistry entry
├── app.json                   # App name / display name
├── babel.config.js            # RN preset + react-native-worklets plugin
├── metro.config.js            # Default Metro config
├── tsconfig.json              # Extends @react-native/typescript-config
├── .eslintrc                  # Lint rules (see code-quality.md)
├── .prettierrc.js             # Formatting (single quotes, printWidth 100)
├── jest.config.js             # Transform list for ESM packages
├── jest.setup.js              # Reanimated / Worklets mocks
├── __mocks__/
│   └── react-native-mmkv.ts   # In-memory MMKV for Jest
├── __tests__/
│   ├── App.test.tsx
│   └── helpers.test.ts        # Formatters, cleanPayload, getErrorMessage, snackbar store
├── constants/
│   ├── API_Routes.ts          # Every endpoint path
│   ├── AppConstants.tsx       # API_BASE_URL and other app constants
│   ├── AppString.ts           # Every user-facing string
│   └── StoragePreferences.ts  # MMKV instance, redux-persist adapter, helpers
├── android/  ios/             # Native projects
└── src/
    ├── api/
    │   ├── AxiosClient.ts     # Axios instance + Bearer-token interceptor
    │   ├── AxiosActions.ts    # getAPI / postAPI / putAPI / patchAPI / deleteAPI / uploadAPI
    │   ├── service.ts         # Endpoint functions (one `do*` per API call)
    │   └── queries.ts         # Every React Query hook, in one file
    ├── assets/
    │   ├── fonts/  images/  svg/
    ├── components/
    │   ├── ErrorBoundary.tsx
    │   └── SnackbarHost.tsx   # Renders showSnackbar / showErrorSnackbar
    ├── helper/
    │   ├── colors.ts          # Static named color palette
    │   ├── common-functions.ts# Snackbars, error messages, formatting, dates, cleanPayload
    │   ├── font-family.ts     # Font name map
    │   ├── matrics.ts         # horizontal/vertical/moderate scale
    │   ├── navigation-service.ts # navigate() etc. outside components
    │   ├── snackbar.ts        # Snackbar store used by showSnackbar
    │   ├── typography.ts      # Text style presets
    │   └── utility-functions.ts  # Platform flags, responsive sizes, alerts
    ├── hooks/
    │   ├── ThemeContext.tsx   # ThemeProvider + useTheme (persisted light/dark/system)
    │   └── usePaginatedAPI.ts # Infinite-scroll helper on useInfiniteQuery
    ├── navigation/
    │   ├── AppStack.tsx       # Native stack built from screens.ts
    │   ├── AppStackParams.ts  # Route param types
    │   └── screens.ts         # Screen registry
    ├── redux/
    │   ├── store.ts           # Store, persistor, typed hooks
    │   ├── slice.ts           # Example "global" slice
    │   ├── slices/authSlice.ts
    │   ├── action.ts          # Empty: place for thunks if you want them
    │   └── types.d.ts         # Shared API types
    ├── screens/
    │   ├── SplashScreen.tsx
    │   ├── LoginScreen.tsx
    │   └── HomeScreen.tsx
    └── theme/
        ├── lightTheme.ts
        ├── darkTheme.ts
        └── index.ts           # themes map, ThemeType, ThemeMode
```

## The provider tree

`App.tsx` wraps the app in this order (outermost first):

```
ErrorBoundary                 catches render errors anywhere below
└── QueryClientProvider       React Query cache
    └── Provider (Redux)      store
        └── PersistGate       waits for MMKV rehydration before rendering
            └── SafeAreaProvider
                └── ThemeProvider
                    ├── Main  NavigationContainer → StatusBar + AppStack
                    └── SnackbarHost  messages from showSnackbar / showErrorSnackbar
```

Why this order matters:

- `PersistGate` sits inside the Redux `Provider` and above everything that reads state, so `SplashScreen` sees the rehydrated `accessToken` on its first render.
- `ThemeProvider` is below `SafeAreaProvider` and above navigation, so every screen can call `useTheme()`.
- `ErrorBoundary` is outermost and does **not** use the theme (it must render even if a provider throws).

## Where new code goes

| You are adding… | Put it in |
| --- | --- |
| A screen | `src/screens/`, then register it in `src/navigation/screens.ts` and `AppStackParams.ts` |
| A reusable component | `src/components/` |
| An API endpoint | `src/api/service.ts` (function) + `src/api/queries.ts` (hook) |
| Global client state | A new slice in `src/redux/slices/` |
| A custom hook | `src/hooks/` |
| A pure helper | `src/helper/` |
| A constant or env value | `constants/AppConstants.tsx` |
