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

| Token | Light | Dark | Use |
| --- | --- | --- | --- |
| `background` | `#FFFFFF` | `#000000` | Screen background |
| `card` | `#F4F4F5` | `#18181B` | Cards, inputs, sheets |
| `text` | `#000000` | `#FFFFFF` | Primary text |
| `muted` | `#71717A` | `#A1A1AA` | Secondary text, placeholders |
| `border` | `#E4E4E7` | `#27272A` | Dividers, outlines |
| `primary` | `#4045EF` | `#4045EF` | Brand color |
| `onPrimary` | `#FFFFFF` | `#FFFFFF` | Text/icons on `primary` |
| `secondary` | `#F4F4F4` | `#1A1A1A` | Secondary surfaces |
| `error` | `#DC2626` | `#F87171` | Errors, destructive actions |

## Using the theme

```tsx
import { useTheme } from '../hooks/ThemeContext';

const Card = () => {
  const { theme, mode, preference, setPreference, toggleTheme } = useTheme();

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
| `preference` | `'light' \| 'dark' \| 'system'` | The user's choice (persisted) |
| `setPreference` | `(p) => void` | Sets and saves the choice; `'system'` follows the OS again |
| `toggleTheme` | `() => void` | Pins the opposite of the current mode |

## How the mode is chosen

- The preference is read synchronously from MMKV (`StorageKeys.THEME_MODE`) on startup, so the saved choice applies on the first frame.
- With `system` (the default, and what an empty key means) the mode follows the OS live.
- `setPreference('light' | 'dark')` and `toggleTheme()` save a fixed choice; `setPreference('system')` deletes the key and follows the OS again.

## Adding a token

1. Add it to `lightTheme.ts`. `ThemeType` is inferred from this file, so the new key becomes required.
2. Add the same key to `darkTheme.ts`. It's typed as `ThemeType`, so TypeScript flags a missing key.
3. Use `theme.yourToken` in components.

## Navigation theme and status bar

`Main.tsx` builds React Navigation's theme from yours: it starts from `DarkTheme` or `DefaultTheme` to match the mode, then sets `primary`, `background`, `card`, `text`, `border` and `notification` (`error`) from your palette, so there's no white flash behind screens in dark mode. It also renders `<StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />`.

If you enable Android edge-to-edge (`edgeToEdgeEnabled=true` in `android/gradle.properties`), you can drop that `StatusBar`: content draws behind the system bars and `SafeAreaView` handles the insets.

## Static colors

`src/helper/colors.ts` is a separate, theme-independent palette (`grayColor`, `red`, `green`, `purple`…). Use it for colors that must not change with the theme, such as brand logos or status badges.
