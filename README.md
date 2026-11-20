# 🚀 React Native Base Template

A React Native CLI template with the boilerplate already done: Redux Toolkit, Redux Persist on MMKV, React Navigation, React Query, Axios, light/dark theming and TypeScript.

## Quick start

```sh
npx @react-native-community/cli init MyApp --template @umang-thakkar/base-template
cd MyApp
npm start
```

Then, in another terminal, `npm run android` or `npm run ios`. Requires Node.js 22.11+.

## What's included

- **Redux Toolkit** store with typed hooks and an `auth` slice (`user` + `accessToken`)
- **Redux Persist on MMKV**: login survives app restarts
- **React Navigation 7** stack with a screen registry and a navigation service for use outside components
- **React Query 5** hooks over a layered **Axios** API (client → actions → services → queries)
- **Light/dark themes** that follow the system setting, via `useTheme()`
- **ErrorBoundary** with a dev-only error view
- Responsive scaling, typography presets, date formatting and platform helpers
- ESLint rules for React, TypeScript, React Native and React Query; Jest with an MMKV mock

## Documentation

Full docs are in [`docs/`](./docs/README.md):

- [Getting Started](./docs/getting-started.md)
- [Project Structure](./docs/project-structure.md)
- [State Management](./docs/state-management.md)
- [Storage (MMKV)](./docs/storage.md)
- [Networking](./docs/networking.md)
- [Navigation](./docs/navigation.md)
- [Theming](./docs/theming.md)
- [Helpers & Utilities](./docs/helpers.md)
- [Error Handling](./docs/error-handling.md)
- [Code Quality & Testing](./docs/code-quality.md)
- [Customization Recipes](./docs/customization.md)
- [Roadmap & Known Issues](./docs/roadmap.md)
- [Publishing the Template](./docs/publishing.md)

## Contributing

Fork it and customize it. Pull requests are welcome.

## Author

Created with ❤️ by **[Umang Thakkar](https://github.com/Umang2809)**

## License

MIT © [Umang Thakkar](https://github.com/Umang2809)
