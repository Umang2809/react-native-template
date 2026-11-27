# Getting Started

## Requirements

- **Node.js 22.11+**
- A working React Native environment for your target platforms. Follow the official [Set Up Your Environment](https://reactnative.dev/docs/set-up-your-environment) guide (Android Studio + JDK 17 for Android, Xcode + CocoaPods for iOS).
- Ruby + Bundler for iOS (the template ships a `Gemfile` that pins CocoaPods).

## Create a project

```bash
npx @react-native-community/cli init MyApp --template @umang-thakkar/base-template
```

Replace `MyApp` with your app name. The CLI replaces the placeholder name `BaseTemplate` (set in `template.config.js`) everywhere, including the native Android and iOS projects.

## Install dependencies

```bash
cd MyApp
npm install
```

### iOS pods

The CLI installs pods during `init` on macOS. Run it again whenever you add or update a library with native code:

```bash
bundle install
```

```bash
cd ios && bundle exec pod install && cd ..
```

## Run the app

Start Metro:

```bash
npm start
```

In a second terminal:

```bash
npm run android
```

```bash
npm run ios
```

## What you should see

1. **SplashScreen** shows for ~800 ms and checks Redux for an `accessToken`.
2. With no token you land on **LoginScreen**. Pressing *Sign in* saves a dummy user and token to the `auth` slice (no real API call).
3. **HomeScreen** shows the current theme with *Toggle theme*, *Follow system* and *Log out* buttons. The theme choice is saved, so it survives a relaunch.
4. Kill and relaunch the app: you go straight to HomeScreen because the `auth` slice was persisted to MMKV.

## Available scripts

| Script | Command | Purpose |
| --- | --- | --- |
| `start` | `react-native start` | Start the Metro bundler |
| `android` | `react-native run-android` | Build and run on Android |
| `ios` | `react-native run-ios` | Build and run on iOS |
| `lint` | `eslint .` | Lint the project |
| `test` | `jest` | Run unit tests |

## First things to change

- `constants/AppConstants.tsx`: set `API_BASE_URL` to your backend (it points at `jsonplaceholder.typicode.com`).
- `src/screens/LoginScreen.tsx`: replace the dummy `setCredentials` call with a real login mutation. See [Networking](./networking.md).
- `src/theme/lightTheme.ts` and `darkTheme.ts`: your brand colors. See [Theming](./theming.md).
- `src/helper/font-family.ts`: your font names. See [Helpers](./helpers.md#fonts).
