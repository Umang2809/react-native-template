# Base Template Documentation

Documentation for `@umang-thakkar/base-template`, a React Native CLI template with Redux Toolkit, Redux Persist on MMKV, React Navigation, React Query, Axios and light/dark theming already wired up. Styles use plain `StyleSheet`. For Tailwind-style `className` styling, see the NativeWind variant, [`@umang-thakkar/base-template-nativewind`](https://www.npmjs.com/package/@umang-thakkar/base-template-nativewind).

## Contents

| Guide | What it covers |
| --- | --- |
| [Getting Started](./getting-started.md) | Requirements, creating a project, running on Android and iOS |
| [Project Structure](./project-structure.md) | What every folder and file is for, and the provider tree in `App.tsx` |
| [State Management](./state-management.md) | Redux store, typed hooks, slices, the auth slice and persistence |
| [Storage (MMKV)](./storage.md) | `StoragePreferences`, the redux-persist adapter, storage keys |
| [Networking](./networking.md) | Axios client, request helpers, services, React Query hooks, pagination |
| [Navigation](./navigation.md) | Stack setup, adding screens, typed params, navigation service |
| [Theming](./theming.md) | Light/dark themes, `useTheme`, adding colors |
| [Helpers & Utilities](./helpers.md) | Responsive scaling, typography, fonts, colors, snackbars, error messages, formatting, dates |
| [Error Handling](./error-handling.md) | The `ErrorBoundary` component and API errors |
| [Code Quality & Testing](./code-quality.md) | ESLint rules, Prettier, Jest setup, mocks |
| [Customization Recipes](./customization.md) | Common tasks: new slice, new API, persist another slice, add fonts |
| [Roadmap](./roadmap.md) | Features planned for the template and known issues |
| [Publishing the Template](./publishing.md) | How the package is laid out and how to release a new version |

## Stack at a glance

| Concern | Library | Version |
| --- | --- | --- |
| Runtime | React Native | 0.84.0 |
| UI library | React | 19.2.3 |
| State | Redux Toolkit + React Redux | 2.12 / 9.3 |
| Persistence | redux-persist on react-native-mmkv | 6.0 / 4.3 |
| Server state | TanStack React Query | 5.x |
| HTTP | Axios | 1.x |
| Navigation | React Navigation (native stack) | 7.x |
| Animation | Reanimated + Worklets | 4.5 / 0.10 (pinned with `~`; newer versions need RN 0.86+) |
| Dates | date-fns | 4.x |
| Language | TypeScript | 5.8 |

Node.js 22.11 or newer is required (see `engines` in `template/package.json`).
