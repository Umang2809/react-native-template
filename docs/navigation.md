# Navigation

Navigation uses React Navigation 7 with the **native stack** (`@react-navigation/native-stack`). The root is in `Main.tsx`:

```tsx
<NavigationContainer ref={navigationRef} theme={navigationTheme}>
  <AppStack />
</NavigationContainer>
```

`navigationTheme` is built from the app theme (`useTheme()`): `background`, `card`, `text`, `border`, `primary` and `notification` (→ `error`) come from your palette, and light/dark follows the app's mode. Screens and transitions get the right background, with no white flash in dark mode.

## The stack

`src/navigation/AppStack.tsx` builds a native stack from the screen registry in `screens.ts`, with `SplashScreen` as the initial route. Native stack uses `UINavigationController` on iOS and Fragments on Android, so transitions and the iOS swipe-back gesture run natively instead of in JS.

Default options for every screen (`defaultScreenOptions`):

| Option | Value | Why |
| --- | --- | --- |
| `headerShown` | `false` | Screens draw their own headers |
| `animation` | `'ios_from_right'` | The same slide on iOS and Android (Android's default is a fade from the bottom) |
| `freezeOnBlur` | `true` | Screens that aren't focused stop re-rendering until you return to them |

Per-screen `options` in `screens.ts` are merged over these defaults. The template uses `animation: 'fade'` for Login and Home, because they replace the whole stack (`navigation.reset`) and a slide would suggest you can go back.

Common per-screen options:

```ts
{ name: 'Settings', component: SettingsScreen, options: { headerShown: true, title: 'Settings' } },
{ name: 'Filters', component: FiltersScreen, options: { presentation: 'formSheet' } },   // iOS sheet
{ name: 'Onboarding', component: OnboardingScreen, options: { gestureEnabled: false } },
```

The JS stack (`@react-navigation/stack`) is no longer installed. Native stack covers what the template needs and is faster.

## Adding a screen

1. Create the screen in `src/screens/ProfileScreen.tsx`.
2. Add its params to `src/navigation/AppStackParams.ts`:

   ```ts
   export type AppStackParams = {
     SplashScreen: undefined;
     LoginScreen: undefined;
     HomeScreen: undefined;
     ProfileScreen: { userId: string };
   };
   ```

3. Register it in `src/navigation/screens.ts`:

   ```ts
   { name: 'ProfileScreen', component: ProfileScreen },
   ```

   Add `options` here to override the defaults for that screen.
4. Wrap the screen's content in `SafeAreaView` from `react-native-safe-area-context` with `{ backgroundColor: theme.background }` (see `LoginScreen.tsx`).

## Typed screen props

```tsx
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import type { AppStackParams } from '../navigation/AppStackParams';

type Props = NativeStackScreenProps<AppStackParams, 'ProfileScreen'>;

const ProfileScreen = ({ route, navigation }: Props) => {
  const { userId } = route.params;
  // ...
};
```

Inside nested components, use the hook with the exported type:

```tsx
import { useNavigation } from '@react-navigation/native';
import type { StackNavigation } from '../navigation/AppStack';

const navigation = useNavigation<StackNavigation>();
navigation.navigate('ProfileScreen', { userId: '42' });
```

## Navigation service (outside components)

`src/helper/navigation-service.ts` exposes the container ref so you can navigate from interceptors, Redux listeners or notification handlers.

| Function | Effect |
| --- | --- |
| `navigate(name, params?)` | Navigate to a route |
| `goBack()` | Go back |
| `push(name, params?)` | Push a new copy of a route |
| `pop(count = 1)` | Pop `count` screens |
| `popToTop()` | Back to the first screen in the stack |
| `navigateAndReset(routes, index = 0)` | Replace the whole history with `routes` |
| `navigateAndSimpleReset(name, index = 0)` | Replace history with a single route |

```ts
import { navigateAndSimpleReset } from '../helper/navigation-service';

navigateAndSimpleReset('LoginScreen'); // e.g. after logout or a 401
```

These calls do nothing until the `NavigationContainer` has mounted (`navigationRef.current` is `null` before that).

## Adding tabs or a drawer

Install the navigator, create it in its own file under `src/navigation/`, and register it as a screen in the root stack:

```bash
npm install @react-navigation/bottom-tabs
```

```tsx
// src/navigation/HomeTabs.tsx
const Tabs = createBottomTabNavigator();
export const HomeTabs = () => (
  <Tabs.Navigator screenOptions={{ headerShown: false }}>
    <Tabs.Screen name="Feed" component={FeedScreen} />
    <Tabs.Screen name="Profile" component={ProfileScreen} />
  </Tabs.Navigator>
);
```

Then add `HomeTabs: undefined` to `AppStackParams` and `{ name: 'HomeTabs', component: HomeTabs }` to `screens.ts`.
