# Roadmap

Planned additions to the template, most of them taken from patterns in the **vega-app** project, plus known issues in the current template.

> **License note:** vega-app is under the **PolyForm Noncommercial 1.0.0** license (Apache 2.0 only up to commit `9ccc0c8`). This template is **MIT** and meant for commercial apps, so vega code must **not** be copied in. Each item below names the *library or pattern* to adopt; write the implementation from scratch or from the library's own docs.

Legend: 🟢 works in bare React Native CLI as-is · 🟡 needs Expo Modules (`npx install-expo-modules`) or a bare alternative · Priority **P1** (high) to **P3** (nice to have).

## Styling & design system

| # | Feature | What vega-app does | How to bring it to the template | Priority |
| --- | --- | --- | --- | --- |
| 1 | ➡️ **NativeWind v4 (Tailwind CSS)** (moved to the separate `@umang-thakkar/base-template-nativewind` package) 🟢 | `className="bg-m3-surface p-4 rounded-xl"` on 60+ files. Wired via `babel.config.js` (`jsxImportSource: 'nativewind'`), `metro.config.js` (`withNativeWind(config, { input: './src/global.css' })`), `tailwind.config.js` with `nativewind/preset`, `src/global.css` (`@tailwind base/components/utilities`) and `nativewind-env.d.ts`. | Install `nativewind` + `tailwindcss@3` (+ `react-native-css-interop`), add the same five files (bare RN uses `presets: ['module:@react-native/babel-preset', 'nativewind/babel']`), import `global.css` in `App.tsx`. Keep `StyleSheet` working alongside. | **P1** |
| 2 | ➡️ **Theme tokens as CSS variables** (in `@umang-thakkar/base-template-nativewind`) 🟢 | The theme provider publishes every color role with NativeWind's `vars()` (`--m3-surface`, `--m3-on-primary`…), and `tailwind.config.js` maps them to classes (`bg-m3-surface`, `text-m3-on-surface`). Theme switches re-color every `className` with no re-render logic per component. | Make `ThemeProvider` wrap children in a `View` with `style={vars({...})}` built from `lightTheme`/`darkTheme`, and generate the Tailwind `colors` entries from the same token list. One source of truth for JS (`useTheme`) and classes. | **P1** |
| 3 | **Material 3 token set** 🟢 | `src/theme/` has full M3 color roles (primary/onPrimary/containers/surfaceContainer levels…), a type scale (`displayLarge` → `labelSmall`, plus emphasized variants), a shape scale (`extraSmall 4` → `full`), and Reanimated spring presets for motion (`spatial` / `effects` × `fast/default/slow`). | Replace the 5-token theme with role-based tokens (`background`, `surface`, `surfaceContainerHigh`, `onSurface`, `outline`, `error`…). Add `theme/typography.ts`, `theme/shapes.ts`, `theme/motion.ts`. Keep the old `Typography` presets until migrated. | **P1** |
| 4 | **Dynamic accent / seed color** 🟡 | User picks a seed color (or wallpaper colors on Android); the whole palette is generated from it and persisted. | Bare-friendly: generate the palette with `@material/material-color-utilities` (`themeFromSourceColor`). Store the seed with MMKV. | P3 |
| 5 | ✅ **Persisted Light / Dark / System setting** (done: `preference` / `setPreference` in `useTheme()`, saved in MMKV) 🟢 | `themeStore` (Zustand + persist) remembers the user's choice. | Store `THEME_MODE` (`'light' \| 'dark' \| 'system'`) in MMKV; only follow `Appearance` when `system`. Fixes the current "toggle not saved" limitation. | **P1** |
| 6 | **`<Text role="titleMedium">`** 🟢 | `components/ui/Text.tsx` applies a type-scale role by prop. | Add a themed `AppText` that applies `role` + theme `onSurface` color by default. | P2 |

## UI component kit

| # | Component | Purpose | Priority |
| --- | --- | --- | --- |
| 7 | `Button` | Variants `filled`, `tonal`, `outlined`, `text`, `destructive`, with `compact` and `disabled` | **P1** |
| 8 | `IconButton` | Round icon-only button with ripple/pressed feedback | P2 |
| 9 | `Surface` | Card container with elevation `level` (`lowest` → `highest`) and optional outline | **P1** |
| 10 | `ScreenSafeArea` | Standard screen wrapper with the right safe-area edges (bottom left to the tab bar) | **P1** |
| 11 | `SearchField`, `DropdownField` | Search input; dropdown (vega uses `react-native-element-dropdown`) | P2 |
| 12 | `LoadingIndicator` | Shared loader instead of ad-hoc `ActivityIndicator`s | P2 |
| 13 | `SettingsSection`, `SettingsRow`, `SettingsSwitchRow`, `SettingsSliderRow`, `SettingsPage` | Ready-made settings screen building blocks | P2 |
| 14 | **Global dialog host** | `AppDialogHost` mounted once at the root + a tiny store; call `showAppDialog({ title, message, actions })` from anywhere, including non-React code. Replaces scattered `Alert.alert` calls and supports markdown messages. | **P1** |
| 15 | Custom animated bottom tab bar | `StreamingTabBar` + `AnimatedTabIcon` using `@react-navigation/bottom-tabs` and Reanimated | P3 |

## State & data

| # | Feature | Details | Priority |
| --- | --- | --- | --- |
| 16 | **Zustand for UI state** 🟢 | vega uses ~15 small Zustand stores (theme, dialogs, navigation prefs) with `persist` middleware on MMKV. Good fit for ephemeral/UI state that doesn't need Redux ceremony. Keep Redux for auth/app state; document when to use which. | P2 |
| 17 | **Hardened React Query client** 🟢 | Move the client to `src/api/queryClient.ts`. Smart `retry` (no retry on `AbortError` or real 4xx), exponential backoff `min(1000 × 2^n, 30s)`, `refetchOnWindowFocus: false`, `refetchOnReconnect: 'always'`, mutation `retry: 1`, plus a dev-only client that logs cache events and a `getCacheStats()` helper. | **P1** |
| 18 | **Domain storage services** 🟢 | A `StorageService` class wrapping MMKV with typed `getObject/setObject/getArray/setArray/getBool(default)`, separate instances per domain (`settingsStorage`, `cacheStorage`), and a Zustand-compatible `StateStorage` adapter. Extend `StoragePreferences` this way (keep `react-native-mmkv`, vega uses the different `react-native-mmkv-storage`). | P2 |
| 19 | `zustand/react/shallow` selectors | Avoid re-renders when selecting multiple fields | P3 |

## Native capabilities

| # | Feature | Library | Priority |
| --- | --- | --- | --- |
| 20 | **Native splash screen** 🟢 | `react-native-bootsplash`: generate assets from a logo, call `BootSplash.hide()` once navigation is ready. Replaces the 800 ms JS `SplashScreen` delay and the white flash at launch. | **P1** |
| 21 | **Edge-to-edge + system bars** 🟢 | `react-native-edge-to-edge` `<SystemBars style="auto" />`; required for Android 15+ (targetSdk 35) behavior. | **P1** |
| 22 | **Firebase Analytics + Crashlytics (optional)** 🟢 | `@react-native-firebase/*`. vega wraps them in "safe" accessors that return `null` when `google-services.json` is missing, so the app still builds without Firebase. Report errors from `ErrorBoundary` with app/build version attributes. | **P1** |
| 23 | Local notifications 🟢 | `@notifee/react-native` with `onBackgroundEvent` registered in `index.js` | P2 |
| 24 | Haptics 🟢 | `react-native-haptic-feedback` on button presses / toggles | P2 |
| 25 | Bottom sheet 🟢 | `@gorhom/bottom-sheet` (Reanimated + Gesture Handler are already installed) | P2 |
| 26 | Fast lists 🟢 | `@shopify/flash-list` for long lists | P2 |
| 27 | Permissions 🟢 | `react-native-permissions` + the existing `showAlert` "Open Settings" helper | P2 |
| 28 | Gradients / blur 🟢 | `react-native-linear-gradient`, `@react-native-community/blur` | P3 |
| 29 | Markdown rendering 🟢 | `react-native-markdown-display` (used by the dialog host) | P3 |
| 30 | Expo modules in bare RN 🟡 | vega uses `expo-constants`, `expo-application`, `expo-updates` (OTA), `expo-file-system`, `@expo/vector-icons`. Optional: run `npx install-expo-modules` to unlock these. Bare alternatives: `react-native-device-info`, `react-native-vector-icons`, `react-native-fs`. | P3 |

## Performance

| # | Feature | Details | Priority |
| --- | --- | --- | --- |
| 31 | `enableScreens(true)` + `enableFreeze(true)` | From `react-native-screens`; freezes off-screen screens so they stop re-rendering | P2 |
| 32 | Idle-work scheduler | `scheduleWhenIdle(job)` defers non-urgent work (sync, cache cleanup) until navigation transitions and gestures finish; jobs are cancellable via `AbortSignal` | P3 |
| 33 | Release console stripping | In release builds, replace `console.log/trace` with no-ops (or `babel-plugin-transform-remove-console`) | **P1** |
| 34 | Exportable log file | Keep info/warn/error lines on disk so users can attach logs to bug reports | P3 |

## Tooling & delivery

| # | Feature | Details | Priority |
| --- | --- | --- | --- |
| 35 | ✅ **Prettier config** (done: `.prettierrc.js`) | `.prettierrc.js` (`singleQuote`, `trailingComma: 'all'`, `arrowParens: 'avoid'`, `bracketSpacing: false`). Also fixes the ESLint/Prettier quote conflict. | **P1** |
| 36 | **Pre-commit hook** | `simple-git-hooks` + `pretty-quick --staged` (format staged files on commit) | P2 |
| 37 | **patch-package** | `"postinstall": "patch-package"` so library fixes live in `patches/` and survive installs | **P1** |
| 38 | **Path aliases** | `babel-plugin-module-resolver` + `tsconfig` `paths` (`@/components/...` instead of `../../../`) | **P1** |
| 39 | GitHub Actions | Lint + test on PR; build APK artifact; issue templates (`.github/ISSUE_TEMPLATE/report.yml`, `request.yml`) | P2 |
| 40 | Build variants | vega switches package name, scheme and Firebase per `APP_VARIANT`. Bare-RN equivalent: Android product flavors + iOS schemes with `react-native-config`. | P2 |
| 41 | Release signing helper | Script to place the keystore and wire `signingConfigs` from env vars | P3 |
| 42 | Test patterns | vega has ~160 test files: store tests, hook tests with `@testing-library/react-native`, mocks under `__mocks__/`. Add `@testing-library/react-native` and example tests for a slice, a hook and a screen. | P2 |

Not proposed for the template (app-specific to vega): video player, downloads/HLS, casting, torrent, provider sandbox, WebRTC, Android TV focus system.

## Suggested order

1. Tooling first: ~~Prettier~~ (done), path aliases, patch-package, release console stripping (#35, #38, #37, #33).
2. ~~Persisted mode (#5)~~ (done). NativeWind styling now lives in its own package, [`@umang-thakkar/base-template-nativewind`](https://www.npmjs.com/package/@umang-thakkar/base-template-nativewind).
3. UI kit + global dialog host (#7, #9, #10, #14).
4. Hardened query client, bootsplash, edge-to-edge, optional Firebase (#17, #20, #21, #22).
5. The P2/P3 items as needed.

## Known issues

Found while writing these docs.

Fixed in 1.2.0: dark theme `card` color, theme choice not persisted, JS stack instead of the native stack (and per-screen `options` ignored), request interceptor not attaching the token, unexported `errorMessage` helper (now `getErrorMessage`), `SplashScreen` timer not cleared, navigation theme not following the app theme, double quotes in sources (Prettier config added), unused `styles` in `App.tsx`, `npm run lint` crashing on the missing `@react-native-community` config and the `import/order` rule, the `tsc` error from the MMKV v3 fallback, Jest failing on ESM packages, and `react-native-reanimated@^4.4.1` resolving to a version that needs RN 0.87 (now pinned `~4.5.5` with Worklets `~0.10.4`).

Still open:

| Issue | Where | Fix |
| --- | --- | --- |
| `react-native-gesture-handler` is installed but the app isn't wrapped in `GestureHandlerRootView` | `App.tsx` | Wrap the tree (required by bottom-sheet, swipeables) |
| Persisted access token is stored unencrypted | `constants/StoragePreferences.ts` | MMKV encryption key or Keychain/Keystore |
| Fonts referenced in `FontFamily` aren't bundled, and there's no `react-native.config.js` | `src/helper/font-family.ts` | See [Helpers → Fonts](./helpers.md#fonts) |
