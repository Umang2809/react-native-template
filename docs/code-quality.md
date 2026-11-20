# Code Quality & Testing

## ESLint

Config: `.eslintrc`. It extends `@react-native`, `@react-native-community` and the TanStack Query recommended rules.

```bash
npm run lint
```

Notable rules:

| Rule | Level | Why |
| --- | --- | --- |
| `react-hooks/rules-of-hooks` | error | Hooks must be called unconditionally |
| `react-hooks/exhaustive-deps` | warn | Missing effect dependencies |
| `@tanstack/query/exhaustive-deps` | error | Everything a `queryFn` uses must be in the `queryKey` |
| `@typescript-eslint/no-explicit-any` | warn | Prefer real types |
| `react-native/no-inline-styles` | warn | Use `StyleSheet.create` |
| `react-native/no-color-literals` | warn | Use theme tokens or `colors.ts` |
| `react-native/no-unused-styles` | warn | Dead styles |
| `no-console` | warn | `console.warn`, `error` and `info` are allowed |
| `eqeqeq`, `curly`, `prefer-const`, `no-var` | error | General hygiene |
| `quotes` | error | Single quotes |
| `semi` | error | Semicolons required |
| `indent` | error | 2 spaces |

Test files (`__tests__/**`, `*.test.ts(x)`) get the Jest environment and allow `any`.

> Some template files still use double quotes and inline styles, so a fresh project reports lint errors. Run `npx eslint . --fix` once after creating the project.

## Prettier

Prettier 2.8.8 is installed but there is no `.prettierrc`, so it uses defaults (double quotes), which conflicts with the ESLint `quotes` rule. Add one that matches:

```js
// .prettierrc.js
module.exports = {
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
};
```

## Testing

Jest runs with the React Native preset.

```bash
npm test
```

- `__tests__/App.test.tsx` renders the full app tree with `react-test-renderer`.
- `__mocks__/react-native-mmkv.ts` swaps MMKV for an in-memory `Map`, so the store and persistence run in Jest.

Example test for a slice:

```ts
import reducer, { setCredentials, clearAuth } from '../src/redux/slices/authSlice';

test('login then logout', () => {
  let state = reducer(undefined, setCredentials({ user: { id: '1' }, accessToken: 't' }));
  expect(state.accessToken).toBe('t');
  state = reducer(state, clearAuth());
  expect(state).toEqual({ user: null, accessToken: null });
});
```

Native modules you add later (Reanimated, Gesture Handler, etc.) may need their own Jest mocks. Most libraries document a `jest/setup` file to add under `setupFiles` in `jest.config.js`.
