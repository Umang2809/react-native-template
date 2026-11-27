---
name: umang-design-pattern
description: Umang's React Native app pattern from @umang-thakkar/base-template (standard, StyleSheet styling) - folder structure, StyleSheet + theme colors from useTheme(), responsive scaling helpers, Typography presets, API integration (service.ts + single queries.ts + usePaginatedAPI), Redux Toolkit + MMKV, typed native-stack navigation, snackbars. Use when creating a new React Native app or screen from this base template, or when the user says "/new-mobile-app", "create mobile app", "new react native project", or "umang pattern". For the NativeWind variant use the umang-nativewind-pattern skill instead.
---

# Umang Mobile App Pattern (StyleSheet)

Follow this pattern for every React Native app built on `@umang-thakkar/base-template`, so every project has the same structure and conventions. The template already contains everything referenced here; **reuse it, don't re-create it.** (Apps built on `@umang-thakkar/base-template-nativewind` follow the `umang-nativewind-pattern` skill instead.)

**Non-negotiables:**
1. Styles live in `StyleSheet.create` at the bottom of each file. No inline style objects except for dynamic values (theme colors, insets, computed sizes).
2. Colors come from `useTheme().theme` (`theme.background`, `theme.text` ...). Never hex literals in components. Theme-independent colors come from `src/helper/colors.ts`.
3. Text styles start from `Typography` presets (`Typography.title1`, `Typography.body2` ...), with the color added from the theme.
4. Spacing and radii use the scaling helpers from `src/helper/matrics.ts` (`horizontalScale`, `verticalScale`, `moderateScale`).
5. Every API call goes: `constants/API_Routes.ts` → `src/api/service.ts` → `src/api/queries.ts` (single file) → screen.
6. All visible text comes from `constants/AppString.ts`.
7. Repeated UI becomes a component in `src/components/`. Screens compose components; they don't restyle the same thing twice.

## Tech Stack

| Area | Library | Notes |
| --- | --- | --- |
| Runtime | React Native 0.84, React 19.2 | New Architecture, React Compiler-friendly |
| Language | TypeScript | no `any` in new code |
| Styling | React Native `StyleSheet` | + `Typography`, scaling helpers, theme colors |
| Navigation | React Navigation 7 native stack | bottom-tabs when needed |
| State | Redux Toolkit + redux-persist | persisted via MMKV |
| Storage | react-native-mmkv 4 | synchronous (`createMMKV()`) |
| Server state | TanStack Query 5 | all hooks in `src/api/queries.ts` |
| HTTP | Axios | `AxiosClient.ts` + `AxiosActions.ts` |
| Animation | react-native-reanimated 4 + react-native-worklets | pinned `~4.5.5` / `~0.10.4` |
| Icons | react-native-svg | SVG components in `src/assets/svg/` |
| Dates | date-fns | |
| Lint/format | ESLint 8 (`@react-native`) + Prettier | see section 13 |
| Forms (optional) | react-hook-form + yup | add when a project has validated forms |
| i18n (optional) | i18next + react-i18next | only for multi-language apps |

## Folder Structure

```
App.tsx                         # Providers + <SnackbarHost />
Main.tsx                        # NavigationContainer (theme-synced) + StatusBar following mode
babel.config.js                 # RN preset + react-native-worklets/plugin (last)
.eslintrc / .prettierrc.js      # Lint and formatting
jest.config.js / jest.setup.js  # Jest preset + Reanimated/Worklets mocks

constants/
├── API_Routes.ts               # Endpoint constants
├── AppString.ts                # All UI strings
├── AppConstants.tsx            # App-wide constants (API_BASE_URL ...)
└── StoragePreferences.ts       # MMKV instance, reduxStorage, StorageKeys, get/set helpers

src/
├── api/
│   ├── AxiosClient.ts          # Axios instance; request interceptor adds the Bearer token
│   ├── AxiosActions.ts         # getAPI<T>, postAPI<T>, putAPI<T>, patchAPI<T>, deleteAPI<T>, uploadAPI<T>
│   ├── service.ts              # One `do*` function per endpoint
│   └── queries.ts              # SINGLE FILE: every useQuery / useMutation / paginated hook
├── assets/
│   ├── fonts/  images/  svg/
├── components/
│   ├── ErrorBoundary.tsx
│   ├── SnackbarHost.tsx        # Renders showSnackbar / showErrorSnackbar (mounted in App.tsx)
│   └── *.tsx                   # PrimaryButton, CustomTextField, CustomHeader, PlantCard ...
├── helper/
│   ├── colors.ts               # Static, theme-independent palette
│   ├── common-functions.ts     # showSnackbar, showErrorSnackbar, getErrorMessage, formatWithComma,
│   │                           # formatPrice, toFormattedDate, cleanPayload
│   ├── font-family.ts          # FontFamily name map
│   ├── matrics.ts              # horizontalScale, verticalScale, moderateScale, getResponsiveIconSize, isTablet
│   ├── navigation-service.ts   # navigationRef, navigate, navigateAndSimpleReset ...
│   ├── snackbar.ts             # Snackbar store (pushSnackbar / subscribeSnackbar)
│   ├── typography.ts           # Typography presets + FontWeight
│   └── utility-functions.ts    # isIOS, isAndroid, responsiveFontSize/Width/Height, hideKeyboard, showAlert
├── hooks/
│   ├── ThemeContext.tsx        # ThemeProvider + useTheme() (theme, mode, preference, setPreference, toggleTheme)
│   └── usePaginatedAPI.ts      # Infinite-scroll helper
├── navigation/
│   ├── AppStack.tsx            # Native stack built from screens.ts
│   ├── AppStackParams.ts       # Route params types
│   └── screens.ts              # Array of { name, component, options? }
├── redux/
│   ├── store.ts                # Store, persistor, RootStore, useAppDispatch, useAppSelector
│   ├── types.d.ts              # Shared types (User, LoginForm, API bodies + responses)
│   └── slices/authSlice.ts     # setCredentials, clearAuth, selectCurrentUser ...
├── screens/
│   ├── auth/  <feature>/       # Grouped by feature
│   └── *.tsx                   # Top-level screens (SplashScreen, HomeScreen)
└── theme/
    ├── lightTheme.ts           # Token → hex
    ├── darkTheme.ts            # Same keys (typed as ThemeType)
    └── index.ts                # themes, ThemeType, ThemeMode
```

## 1. Styling

### Theme colors

`const { theme } = useTheme();` gives the active palette:

| Token | Use |
| --- | --- |
| `background` | Screen background |
| `card` | Cards, inputs, sheets |
| `text` | Primary text |
| `muted` | Secondary text, placeholders, captions |
| `border` | Dividers, outlines |
| `primary` | Brand color |
| `onPrimary` | Text/icons on `primary` |
| `secondary` | Secondary surfaces |
| `error` | Errors, destructive actions |

Static layout goes in `StyleSheet.create`; theme colors are added as a second style in the array:

```tsx
<View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]} />
<Text style={[Typography.body2, { color: theme.muted }]}>{AppString.signInToContinue}</Text>
```

When the same themed style is used several times in a component, build it once in the component body (`const inputStyle = [styles.input, { color: theme.text }]`). For many themed styles, use a `makeStyles(theme)` function called once per render.

**Adding a token:** add it to `lightTheme.ts` and `darkTheme.ts` (typed as `ThemeType`, so a missing key fails `tsc`). Use semantic names (`success`, `warning`), never color names.

`src/helper/colors.ts` is only for colors that must not change with the theme (shadow color, brand logos).

### Typography

`Typography` (`src/helper/typography.ts`) is a `StyleSheet` of presets: `header`, `header2`, `title1`–`title6`, `headline`, `body1`, `body2`, `subhead`, `footnote`, `caption1`–`caption4`, `overline`, `link`. Always combine with a theme color:

```tsx
<Text style={[Typography.title1, { color: theme.text }]}>{AppString.welcomeBack}</Text>
<Text style={[Typography.headline, { color: theme.onPrimary }]}>{AppString.login}</Text>
```

Custom fonts: map them in `FontFamily` (`font-family.ts`), add `fontFamily: FontFamily.semibold` in the style. On Android use one family per weight instead of `fontWeight` with a custom font.

### Responsive scaling

Design base: **390 × 844**. On tablets (width ≥ 768) sizes are capped at 550 × 900.

```ts
const styles = StyleSheet.create({
  container: {
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(20),
    gap: moderateScale(12),
  },
  card: {
    borderRadius: moderateScale(16),
    padding: moderateScale(20),
  },
});
```

- `horizontalScale` for widths / horizontal spacing, `verticalScale` for heights / vertical spacing, `moderateScale` for radii, gaps and font sizes, `getResponsiveIconSize` for icons and illustrations.
- Fixed touch targets (button/input `height: 48`) stay unscaled so they never drop below 44 dp.
- Use either `matrics.ts` or the `responsive*` functions in `utility-functions.ts` within one project, not both. Prefer `matrics.ts` (handles tablets).
- Helpers read the window size at startup; for layouts that must react to rotation or split-screen, use `useWindowDimensions()`.

### Common style patterns

```ts
safeArea: { flex: 1 },                                   // + { backgroundColor: theme.background }
row: { flexDirection: 'row', alignItems: 'center', gap: moderateScale(10) },
centered: { justifyContent: 'center', alignItems: 'center' },
button: { height: 48, borderRadius: moderateScale(12), alignItems: 'center', justifyContent: 'center' },
cardShadow: {
  elevation: 2,
  shadowColor: colors.black,
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.15,
  shadowRadius: 4,
},
```

Pressed state: `style={({ pressed }) => [styles.button, { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 }]}`.

## 2. Screen Pattern

Reference implementation: `src/screens/LoginScreen.tsx`.

```tsx
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Types
import { AppStackParams } from '../../navigation/AppStackParams';

// Hooks / state / API
import { useTheme } from '../../hooks/ThemeContext';
import { usePlantDetails } from '../../api/queries';

// Helpers / constants
import { Typography } from '../../helper/typography';
import { horizontalScale, moderateScale, verticalScale } from '../../helper/matrics';
import { AppString } from '../../../constants/AppString';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParams, 'PlantDetailScreen'>;
  route: RouteProp<AppStackParams, 'PlantDetailScreen'>;
};

const PlantDetailScreen = ({ navigation, route }: Props) => {
  const { theme } = useTheme();
  const { data: plant, isLoading } = usePlantDetails(route.params.id);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <CustomHeader title={AppString.plantDetails} onBackPress={navigation.goBack} />
      <View style={styles.container}>
        <Text style={[Typography.title2, { color: theme.text }]}>{plant?.name}</Text>
        <Text style={[Typography.body2, styles.subtitle, { color: theme.muted }]}>
          {plant?.scientificName}
        </Text>
      </View>
      <CustomLoader isLoading={isLoading} />
    </SafeAreaView>
  );
};

export default PlantDetailScreen;

const styles = StyleSheet.create({
  safeArea: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: horizontalScale(24),
    paddingVertical: verticalScale(20),
    gap: moderateScale(12),
  },
  subtitle: { marginTop: verticalScale(4) },
});
```

Import order: React/RN → navigation → libraries → types → components → hooks/state/API → helpers/constants → assets.

Common shapes:
- **Form screen:** `SafeAreaView` → header → inputs → primary button → submit handler.
- **List screen:** `SafeAreaView` → header/filters (siblings) → `FlatList` with feature card → pagination footer.
- **Detail screen:** `useQuery(id)` → `ScrollView` → media + info sections → action buttons → loader.

## 3. Components

The template ships `ErrorBoundary` and `SnackbarHost`. Build the rest per project in `src/components/`, all with `StyleSheet`, theme colors and `Typography`:

| Component | Props (suggested) |
| --- | --- |
| `PrimaryButton` / `SecondaryButton` | `text`, `onPress`, `disabled`, `loading`, `startIcon`, `endIcon`, `style` |
| `CustomTextField` | `label`, `isRequired`, `isPassword`, `isLast`, `startIcon`, `error`, all `TextInputProps` (with react-hook-form: `control`, `name`) |
| `CustomHeader` | `title`, `onBackPress`, `endIcon`, `onEndIconPress` |
| `CustomLoader` | `isLoading` (fullscreen overlay) |
| `CustomDialog`, `CustomBottomSheet`, `CustomDropdown`, `CustomCheckBox`, `CustomSwitch` | as needed |
| `ListPlaceholder` | empty state: `title`, `icon`, optional action |
| Feature cards | one per data type (`PlantCard`, `EventCard` ...), `React.memo` |

Rules for every component: typed `interface Props`; accept a `style` prop merged last (`style={[styles.root, style]}`); colors from `useTheme()`; accessibility props (`accessibilityRole`, `accessibilityLabel`, `accessibilityState`); default export.

### Snackbars

```ts
import { showSnackbar, showErrorSnackbar, getErrorMessage } from '../helper/common-functions';

showSnackbar(AppString.loginSuccess);          // success; optional 2nd arg = detail line
showErrorSnackbar(getErrorMessage(err));        // error; no argument = generic message
```

Works from anywhere (screens, mutation callbacks, interceptors). Don't use `Alert.alert` for feedback.

## 4. API Integration

**Step 1 - `constants/API_Routes.ts`:**
```ts
export const API_Routes = {
  login: '/auth/login',
  plants: '/plants', // used as /plants/:id too
} as const;
```

**Step 2 - `src/api/service.ts`** (prefix `do`, typed body + response):
```ts
export const doLogin = (body: LoginForm) => postAPI<LoginResponse>(API_Routes.login, body);
export const doGetPlantList = (params: PlantListParams) => getAPI<PlantListResponse>(API_Routes.plants, params);
export const doGetPlantDetails = (id: number) => getAPI<Plant>(`${API_Routes.plants}/${id}`);
export const doUploadFile = (body: FormData) => uploadAPI<UploadResponse>(API_Routes.uploadFile, body);
```

`AxiosActions` return `response.data` and reject with the backend's error body when present, so `getErrorMessage(err)` gives the server message. `AxiosClient.ts` sends `Authorization: Bearer <accessToken>` from the auth slice; add refresh / 401 handling as a response interceptor there.

**Step 3 - `src/api/queries.ts`** (single file, prefix `use`):
```ts
export const usePlantDetails = (id: number) =>
  useQuery({ queryKey: ['plant', id], queryFn: () => doGetPlantDetails(id), enabled: !!id });

export const useLogin = () => useMutation({ mutationFn: doLogin });

export const useAddCartItem = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: doAddCartItem,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['cart'] }),
  });
};

export const usePlantList = (plantTypeId?: number) =>
  usePaginatedAPI({
    queryKey: ['plants'],
    queryFn: ({ pageParam, limit, search, dynamicParams }) =>
      doGetPlantList({ page: pageParam, pageSize: limit, search, plantTypeId: dynamicParams?.plantTypeId }),
    select: (pages: PlantListResponse[]) => pages.flatMap(p => p.plants),
    limit: 10,
    dynamicParams: { plantTypeId },
  });
```

Rules:
- Everything a `queryFn` reads must be in the `queryKey`. `usePaginatedAPI` appends `search`, `limit` and `dynamicParams` for you.
- Cache invalidation lives in the mutation hook; UI reactions (snackbar, navigation) live in the screen's `mutate(vars, { onSuccess, onError })`. Don't handle API results in `useEffect`.
- Never call `service.ts` functions directly from screens.

**`usePaginatedAPI`** returns `{ data, isLoading, isFetchingNextPage, isRefreshing, hasNextPage, error, handleScrollToBottom, handleRefetch, search, handleSearch (debounced 400 ms), resetSearch, query }`. Options: `queryKey`, `queryFn`, `select`, `limit` (10), `firstPage` (1), `dynamicParams`, `hasNextPage(lastPage, allPages, limit)`, `staleTime`, `enabled`.

## 5. Lists

```tsx
<FlatList
  data={data}
  keyExtractor={item => String(item.id)}
  renderItem={({ item }) => <PlantCard item={item} onPress={() => openPlant(item.id)} />}
  contentContainerStyle={[styles.listContent, { paddingBottom: insets.bottom + verticalScale(20) }]}
  showsVerticalScrollIndicator={false}
  refreshing={isRefreshing}
  onRefresh={handleRefetch}
  onEndReached={handleScrollToBottom}
  onEndReachedThreshold={0.4}
  ListFooterComponent={isFetchingNextPage ? <ActivityIndicator color={theme.primary} /> : null}
  ListEmptyComponent={!isLoading ? <ListPlaceholder title={AppString.noDataFound} /> : null}
/>
```

- `ListHeaderComponent` / `ListFooterComponent` only for content tied to list behavior (pagination loader, content that must scroll with items). Static banners/titles are plain siblings above the `FlatList`.
- Don't define complex renderers inline in the screen; extract a component. Cards are `React.memo`; keys are stable ids.

## 6. Theme & Dark Mode

- `useTheme()` → `{ theme, mode, preference, setPreference, toggleTheme }`. `preference` (`'light' | 'dark' | 'system'`) is persisted in MMKV (`StorageKeys.THEME_MODE`) and applied on the first frame; `setPreference('system')` follows the OS again.
- `Main.tsx` maps the theme into React Navigation's theme (no white flash) and renders a `StatusBar` whose `barStyle` follows `mode`. If the app enables Android edge-to-edge, remove that `StatusBar` and rely on `SafeAreaView` insets.
- `ErrorBoundary` sits above `ThemeProvider`, so it is the only component with fixed colors.

## 7. Navigation

- `AppStackParams.ts` types every route; `screens.ts` lists `{ name, component, options? }`; `AppStack.tsx` maps them onto a native stack with `defaultScreenOptions` (`headerShown: false`, `ios_from_right`, `freezeOnBlur`) and per-screen `options` on top.
- Adding a screen = params type + one entry in `screens.ts`.
- Auth transitions use `navigation.reset(...)` or `navigateAndSimpleReset(...)`; outside components use `navigation-service.ts`.
- Screens type `navigation` / `route` with `NativeStackNavigationProp` / `RouteProp`; nested components use `useNavigation<StackNavigation>()`.

## 8. Redux

- Only app/session state in Redux; server data stays in React Query.
- `store.ts` persists the `auth` slice via MMKV (`reduxStorage`, `whitelist: ['auth']`).
- `authSlice`: `setCredentials({ user, accessToken })`, `setUser`, `setAccessToken`, `clearAuth`; selectors `selectCurrentUser`, `selectAccessToken`, `selectIsLoggedIn`, typed with `RootStore` (import with `import type`).

## 9. Types

- Shared types (API bodies, responses, `User`, form types) in `src/redux/types.d.ts`.
- Route params in `AppStackParams.ts`; component props as `interface Props` in the component file.
- No `any`; use `unknown` + narrowing (`getErrorMessage(err)`).

## 10. Icons

- Components in `src/assets/svg/` built with `react-native-svg`, accepting `color`, `width`, `height`.
- When generating code, import by descriptive name and add `// ⚠️ Manual SVG conversion required`.
- Colors from `useTheme()`: `<CartIcon color={theme.primary} width={24} height={24} />`.

## 11. Animation

- Reanimated 4 (`useSharedValue`, `useAnimatedStyle`, `entering={FadeIn}`).
- `react-native-worklets/plugin` is the last Babel plugin. Reanimated/Worklets are mocked in `jest.setup.js`.

## 12. Strings & Constants

- All visible text in `constants/AppString.ts`; storage keys in `StorageKeys`; non-styling magic numbers in `AppConstants.tsx` or a named constant at the top of the file (`const SPLASH_DELAY_MS = 800`).

## 13. Tooling & Code Quality

```bash
npx tsc --noEmit
npx eslint . --fix
npm test
```

- ESLint: `@react-native` + TanStack Query. `react-native/no-inline-styles`, `no-color-literals` and `no-unused-styles` are on (off for `ErrorBoundary.tsx`, `colors.ts` and theme files).
- Prettier (`.prettierrc.js`): single quotes, trailing commas, `arrowParens: 'avoid'`, `bracketSameLine`, `printWidth: 100`.
- Tests: `App.test.tsx` renders the app; `helpers.test.ts` covers formatters and the snackbar store. Add a test when you add a helper.

**Rules:** no magic numbers in styles (scale them or name them); type everything; React 19 / React Compiler: no `useCallback` / `useMemo` by default; `React.memo` for list items; `useWindowDimensions()` instead of `Dimensions.get()` inside components; touch targets ≥ 44 dp.

## 14. New Project Checklist

1. `npx @react-native-community/cli init MyApp --template @umang-thakkar/base-template`
2. `constants/AppConstants.tsx`: `API_BASE_URL`
3. Brand colors → `src/theme/lightTheme.ts` + `darkTheme.ts`
4. Fonts → `src/assets/fonts`, link, update `FontFamily`
5. `constants/API_Routes.ts`, `constants/AppString.ts`
6. Replace the demo `todos` service/queries and demo login
7. `AppStackParams.ts` + `screens.ts`
8. Shared components (`PrimaryButton`, `CustomTextField`, `CustomHeader`, `CustomLoader`)
9. Replace placeholder SVG icons
10. `npx tsc --noEmit && npx eslint . && npm test`, then test light + dark + system on a small phone and a tablet
