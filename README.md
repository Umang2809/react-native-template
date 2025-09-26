# 🚀 React Native Base Template

A React Native boilerplate to kickstart your mobile app development faster, with preconfigured essentials like:

- 🔁 Redux Toolkit for scalable state management
- 📍 React Navigation for robust navigation
- 🔗 React Query for powerful API data fetching and caching
- 🌙 Dark/Light theme support with system preference detection
- 🗂️ Scalable folder structure
- 🧰 Common utility functions
- 📦 Pre-installed useful dependencies
- ⚙️ Optimized project setup for faster development

## 📦 Features

- ✅ Redux Toolkit with example slices and hooks
- ✅ React Navigation with Stack Navigator setup
- ✅ React Query for API management (see `src/api/queries.ts`)
- ✅ Dark/Light theme support with automatic system detection
- ✅ Organized folder structure for features, helpers, navigation, etc.
- ✅ Useful helpers: debouncers, formatters, navigation service
- ✅ TypeScript support
- ✅ Common third-party libraries installed

## 📁 Folder Structure

```
template/
├── App.tsx                # Entry point
├── Main.tsx               # Main app logic
├── app.json               # App config
├── babel.config.js        # Babel config
├── constants/             # App constants
│   ├── AppConstants.tsx
│   └── StoragePreferences.ts
├── __tests__/             # Test files
│   └── App.test.tsx
├── android/               # Android project files
├── ios/                   # iOS project files
├── src/
│   ├── api/               # API clients, actions, and React Query hooks
│   │   ├── AxiosActions.ts
│   │   ├── AxiosClient.ts
│   │   ├── queries.ts      # React Query hooks and API calls
│   │   └── service.ts
│   ├── assets/            # Fonts, images, svg
│   │   ├── fonts/
│   │   ├── images/
│   │   └── svg/
│   ├── helper/            # Utility and helper functions
│   │   ├── colors.ts
│   │   ├── common-functions.ts
│   │   ├── font-family.ts
│   │   ├── navigation-service.ts
│   │   ├── typography.ts
│   │   └── utility-functions.ts
│   ├── hooks/             # Custom hooks
│   │   └── ThemeContext.tsx  # Theme context and provider
│   ├── navigation/        # Navigation setup
│   │   ├── AppStack.tsx
│   │   ├── AppStackParams.ts
│   │   └── screens.ts
│   ├── redux/             # Redux store, slices, types
│   │   ├── action.ts
│   │   ├── slice.ts
│   │   ├── store.ts
│   │   └── types.d.ts
│   ├── screens/           # App screens
│   │   ├── HomeScreen.tsx
│   │   └── SplashScreen.tsx
│   ├── theme/             # Theme configuration
│   │   ├── darkTheme.ts    # Dark theme colors
│   │   ├── lightTheme.ts   # Light theme colors
│   │   └── index.ts        # Theme exports and types
├── vendor/                # Vendor files
│   └── bundle/
├── package.json           # Project dependencies
├── tsconfig.json          # TypeScript config
└── README.md              # Template README
```

## 🚀 Getting Started

1. Create a new project using this template:  
   ```sh
   npx @react-native-community/cli init MyApp --template @umang-thakkar/base-template
   ```
```
Note: Replace MyApp with your own project name.
```

2. Install dependencies:
    ```sh
    npm install
    ```
3. Start Metro server:
    ```sh
    npx react-native start
    ```
4. Run the app:
    ```sh
    # For Android
    npx react-native run-android
    
    # For iOS
    npx react-native run-ios
    ```

> **Note**: With React Native 0.60+, iOS dependencies are automatically linked using autolinking. Manual pod installation is no longer required for most cases.

## 🧠 Usage Instructions

### 📌 Redux Toolkit

- Store is configured in `src/redux/store.ts`.
- Example usage:
  ```tsx
  import { useAppSelector, useAppDispatch } from "../redux/store";
  import { increment } from "../redux/slice";
  const count = useAppSelector((state) => state.counter.value);
  const dispatch = useAppDispatch();
  <Button title="Increment" onPress={() => dispatch(increment())} />;
  ```

### 🌙 Dark/Light Theme Support

The template includes a complete theming system with automatic system preference detection:

- **Theme files**: Located in `src/theme/`
  - `darkTheme.ts` - Dark theme colors
  - `lightTheme.ts` - Light theme colors  
  - `index.ts` - Theme exports and TypeScript types

- **Theme Context**: `src/hooks/ThemeContext.tsx` provides theme management

- **Usage in components**:
  ```tsx
  import { useTheme } from '../hooks/ThemeContext';
  
  const MyComponent = () => {
    const { theme, mode, toggleTheme } = useTheme();
    
    return (
      <View style={{ backgroundColor: theme.background }}>
        <Text style={{ color: theme.text }}>
          Current theme: {mode}
        </Text>
        <TouchableOpacity 
          style={{ backgroundColor: theme.primary }}
          onPress={toggleTheme}
        >
          <Text style={{ color: theme.text }}>Toggle Theme</Text>
        </TouchableOpacity>
      </View>
    );
  };
  ```

- **Features**:
  - Automatic detection of system color scheme preference
  - Manual theme toggle functionality
  - Listens for system theme changes
  - TypeScript support for theme properties

### 🌐 Navigation

- Navigation setup in `src/navigation/`.
- Register screens in `AppStack.tsx`.

### 🔗 React Query

- API calls and React Query hooks are in `src/api/queries.ts`.
- Example usage:
  ```ts
  import { useQuery } from 'react-query';
  import { fetchData } from '../api/queries';
  const { data, isLoading } = useQuery('data', fetchData);
  ```

### 🧰 Utility Functions

- Use helpers from `src/helper/`:
  ```ts
  import { formatDate } from "../helper/common-functions";
  ```

## 🪄 Customization Tips

- Add new slices under `src/redux/`
- Add new API services under `src/api/`
- Organize screens under `src/screens/`
- Keep shared components in a `components/` folder (add as needed)
- Customize theme colors in `src/theme/darkTheme.ts` and `src/theme/lightTheme.ts`
- Extend theme properties by updating the theme type in `src/theme/index.ts`

## 🎨 Theme Customization

To customize the theme colors, edit the theme files:

```ts
// src/theme/lightTheme.ts
export const lightTheme = {
  background: '#FFFFFF',
  text: '#000000', 
  primary: '#4045EF',
  secondary: '#F4F4F4',
  // Add your custom colors here
};

// src/theme/darkTheme.ts  
export const darkTheme = {
  background: '#000000',
  text: '#FFFFFF',
  primary: '#4045EF', 
  secondary: '#1A1A1A',
  // Add your custom colors here
};
```

## 🤝 Contributing

Feel free to fork and customize this template! Pull requests welcome.

## 👨‍💻 Author

Created with ❤️ by **[Umang Thakkar](https://github.com/Umang2809)**

## 📜 License

MIT © [Umang Thakkar](https://github.com/Umang2809)