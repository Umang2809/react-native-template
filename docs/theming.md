# Theming

The template ships a small light/dark theme system based on React context.

## Files

| File | Purpose |
| --- | --- |
| `src/theme/lightTheme.ts` | Light palette |
| `src/theme/darkTheme.ts` | Dark palette |
| `src/theme/index.ts` | `themes` map and the `ThemeType` type (inferred from `lightTheme`) |
| `src/hooks/ThemeContext.tsx` | `ThemeProvider` and `useTheme()` |

## Theme tokens

| Token | Light | Dark |
| --- | --- | --- |
| `background` | `#FFFFFF` | `#000000` |
| `text` | `#000000` | `#FFFFFF` |
| `primary` | `#4045EF` | `#4045EF` |
| `secondary` | `#F4F4F4` | `#1A1A1A` |
| `card` | `#FFFF` | `#FFFF` |

> `card` is white in **both** themes, so in dark mode the Login inputs show white text on a white field. Change the dark value (e.g. `#1A1A1A`) when you set your palette.

## Using the theme

```tsx
import { useTheme } from '../hooks/ThemeContext';

const Card = () => {
  const { theme, mode, toggleTheme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.card }}>
      <Text style={{ color: theme.text }}>Mode: {mode}</Text>
      <Pressable onPress={toggleTheme}>
        <Text style={{ color: theme.primary }}>Switch</Text>
      </Pressable>
    </View>
  );
};
```

`useTheme()` throws if it's called outside `ThemeProvider`.

| Value | Type | Description |
| --- | --- | --- |
| `theme` | `ThemeType` | The active palette |
| `mode` | `'light' \| 'dark'` | The active mode |
| `toggleTheme` | `() => void` | Flips the mode |

## How the mode is chosen

1. On start, the provider reads `Appearance.getColorScheme()` and falls back to `light`.
2. It listens for system appearance changes and follows them.
3. `toggleTheme` flips the mode in memory.

Current limits:

- The manual choice is **not persisted**. It resets on relaunch.
- A system appearance change overrides a manual toggle.

To add a persisted *Light / Dark / System* setting, store the preference with `StorageKeys.THEME_MODE` and only follow `Appearance` when the preference is `system`. This is on the [Roadmap](./roadmap.md).

## Adding a token

1. Add it to `lightTheme.ts`. `ThemeType` is inferred from this file, so the new key becomes required.
2. Add the same key to `darkTheme.ts`. TypeScript will not flag it if you forget, because `darkTheme` is not typed against `ThemeType`; type it explicitly to get that check:

   ```ts
   import type { ThemeType } from './index';
   export const darkTheme: ThemeType = { /* ... */ };
   ```

3. Use `theme.yourToken` in components.

## Navigation theme

`NavigationContainer` uses React Navigation's default theme, so screen transitions can flash white in dark mode. Pass a theme derived from yours:

```tsx
import { DarkTheme, DefaultTheme, NavigationContainer } from '@react-navigation/native';

const { theme, mode } = useTheme();
const base = mode === 'dark' ? DarkTheme : DefaultTheme;

<NavigationContainer
  ref={navigationRef}
  theme={{ ...base, colors: { ...base.colors, background: theme.background, primary: theme.primary } }}>
```

## Static colors

`src/helper/colors.ts` is a separate, theme-independent palette (`grayColor`, `red`, `green`, `purple`…). Use it for colors that must not change with the theme, such as brand logos or status badges.
