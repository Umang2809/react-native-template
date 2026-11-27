# Code Quality & Testing

## ESLint

Config: `.eslintrc`. It extends `@react-native` and the TanStack Query recommended rules.

```bash
npm run lint          # or: npx eslint . --fix
npx tsc --noEmit      # type check
```

Notable rules:

| Rule | Level | Why |
| --- | --- | --- |
| `react-hooks/rules-of-hooks` | error | Hooks must be called unconditionally |
| `react-hooks/exhaustive-deps` | warn | Missing effect dependencies |
| `@tanstack/query/exhaustive-deps` | error | Everything a `queryFn` uses must be in the `queryKey` |
| `@typescript-eslint/no-explicit-any` | warn | Prefer real types |
| `react-native/no-inline-styles` | warn | Use `StyleSheet.create` (computed style arrays are fine) |
| `react-native/no-color-literals` | warn | Use theme colors from `useTheme()` or `colors.ts` |
| `react-native/no-unused-styles` | warn | Dead styles |
| `no-console` | warn | `console.warn`, `error` and `info` are allowed |
| `eqeqeq`, `curly`, `prefer-const`, `no-var` | error | General hygiene |

Test files (`__tests__/**`, `*.test.ts(x)`) get the Jest environment and allow `any`. `ErrorBoundary.tsx`, `colors.ts` and the theme files may use literal colors.

Formatting rules (quotes, semicolons, indent) are left to Prettier.

## Prettier

`.prettierrc.js`:

```js
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'avoid',
  bracketSpacing: true,
  bracketSameLine: true,
  printWidth: 100,
};
```

```bash
npx prettier --write .
```

## Testing

Jest runs with the React Native preset.

```bash
npm test
```

- `__tests__/App.test.tsx` renders the full app tree with `react-test-renderer`, then unmounts it so the splash timer is cleared.
- `__tests__/helpers.test.ts` covers the formatters, `cleanPayload`, `getErrorMessage` and the snackbar store.
- `__mocks__/react-native-mmkv.ts` swaps MMKV for an in-memory `Map`, so the store and persistence run in Jest.

Example test for a slice:

```ts
import reducer, { setCredentials, clearAuth } from '../src/redux/slices/authSlice';

test('login then logout', () => {
  let state = reducer(
    undefined,
    setCredentials({ user: { id: '1', name: 'A', email: 'a@b.c' }, accessToken: 't' }),
  );
  expect(state.accessToken).toBe('t');
  state = reducer(state, clearAuth());
  expect(state).toEqual({ user: null, accessToken: null });
});
```

### Jest configuration

| Setting | Why |
| --- | --- |
| `transformIgnorePatterns` | Runs `react-native-*`, `@react-navigation`, `react-redux`, `redux-persist`, `@reduxjs/toolkit`, `immer` and `@tanstack` through Babel, since they ship ESM or JSX. Add a package here if Jest reports "Cannot use import statement outside a module" for it. |
| `setupFiles` | `react-native-gesture-handler/jestSetup`, and `jest.setup.js`, which swaps Reanimated and Worklets for their JS mocks |

Other native modules you add later may need their own Jest mocks. Most libraries document a `jest/setup` file to add under `setupFiles`.
