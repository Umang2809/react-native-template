# Helpers & Utilities

Everything in `src/helper/`.

## Responsive scaling (`matrics.ts`)

Scales sizes relative to a **390 × 844** design (iPhone 12–15). On tablets (width ≥ 768) the effective size is capped at 550 × 900 so layouts don't blow up.

| Export | Use for |
| --- | --- |
| `horizontalScale(size)` | Widths, horizontal padding/margin |
| `verticalScale(size)` | Heights, vertical padding/margin |
| `moderateScale(size, factor = 0.5)` | Font sizes, border radius: scales only partly |
| `getResponsiveIconSize(base = 100)` | Icons and illustrations, scaled by the smaller axis |
| `isTablet` | `true` when window width ≥ 768 |

```ts
const styles = StyleSheet.create({
  card: {
    width: horizontalScale(320),
    paddingVertical: verticalScale(16),
    borderRadius: moderateScale(12),
  },
  title: { fontSize: moderateScale(18) },
});
```

Dimensions are read once at import time, so values do not update on rotation or split-screen. Use `useWindowDimensions()` for layouts that must react to size changes.

## Platform & device (`utility-functions.ts`)

| Export | Description |
| --- | --- |
| `isIOS`, `isAndroid` | Platform flags |
| `deviceWidth`, `deviceHeight` | Window size at startup |
| `responsiveFontSize(size)` | Font size scaled to width, rounded to the pixel grid (1 px smaller on Android) |
| `responsiveWidth(w)`, `responsiveHeight(h)` | Simple linear scale against 390 × 844 |
| `hideKeyboard()` | `Keyboard.dismiss()` |
| `showAlert(title, message, settingsText?, rejectText?, onSettingsPress)` | Non-cancelable two-button alert, intended for "permission denied, open Settings?" prompts |

```ts
import { Linking } from 'react-native';
import { showAlert } from '../helper/utility-functions';

showAlert(
  'Camera access needed',
  'Enable camera access in Settings to scan documents.',
  'Open Settings',
  'Not now',
  () => Linking.openSettings(),
);
```

`matrics.ts` and `utility-functions.ts` overlap. Pick one per project and stick to it; `matrics.ts` handles tablets better.

## Typography (`typography.ts`)

`Typography` is a `StyleSheet` of text presets; `FontWeight` maps names to numeric weights.

| Style | Size | Weight |
| --- | --- | --- |
| `header` | 34 | bold |
| `title1` | 28 | bold |
| `title2` | 22 | bold |
| `title3` | 20 | bold |
| `title4` / `header2` | 20 | semibold |
| `title5` | 17.5 | semibold |
| `title6` | 51 | semibold |
| `headline` | 17 | bold |
| `body1` | 17 | regular |
| `subhead` | 15 | regular |
| `body2` | 14 | regular |
| `caption4` | 14 | medium |
| `footnote` | 13 | regular |
| `caption1` | 12 | regular |
| `caption3` | 12 | medium |
| `caption2` | 11 | regular |
| `overline` | 10 | regular |
| `link` | – | underline |

```tsx
<Text style={[Typography.title2, { color: theme.text }]}>Settings</Text>
```

## Fonts

`font-family.ts` maps roles to font names. The defaults are General Sans:

```ts
export const FontFamily = {
  regular: 'GeneralSans-Regular',
  medium: 'GeneralSans-Medium',
  semibold: 'GeneralSans-Semibold',
  bold: 'GeneralSans-Bold',
};
```

The template does **not** bundle these font files. To use custom fonts:

1. Put the `.ttf`/`.otf` files in `src/assets/fonts/`.
2. Create `react-native.config.js` at the project root:

   ```js
   module.exports = {
     assets: ['./src/assets/fonts/'],
   };
   ```

3. Link them:

   ```bash
   npx react-native-asset
   ```

4. Update the names in `FontFamily` to match each font's PostScript name, then rebuild both apps.

## Feedback (`common-functions.ts`, `snackbar.ts`)

| Export | Description |
| --- | --- |
| `showSnackbar(title, message?)` | Success message at the bottom of the screen |
| `showErrorSnackbar(message?)` | Error message; without a message it shows `AppString.somethingWentWrong` |
| `getErrorMessage(error)` | Best readable message from a backend error body, `AxiosError`, `Error` or string |

They work from anywhere (screens, mutation callbacks, interceptors). `<SnackbarHost />` (`src/components/SnackbarHost.tsx`), mounted once in `App.tsx`, renders them: one at a time, for 3 seconds or until tapped, above the bottom safe area, animated with Reanimated.

## Formatting & payloads (`common-functions.ts`)

| Export | Example |
| --- | --- |
| `formatWithComma(value, locale?)` | `1234567` → `"1,234,567"` |
| `formatPrice(value, locale?)` | `1234.5` → `"1,234.50"` |
| `cleanPayload(object)` | Drops `null`, `undefined` and `''` values before a request |

## Dates (`common-functions.ts`)

`toFormattedDate(isoString, formatStr)` parses an ISO string with date-fns and formats it. Returns `null` for empty or invalid input.

```ts
toFormattedDate('2026-11-20T10:30:00Z', 'dd MMM yyyy'); // "20 Nov 2026"
toFormattedDate('not a date', 'dd MMM yyyy');           // null
```

Format tokens: see the [date-fns `format` docs](https://date-fns.org/docs/format).
