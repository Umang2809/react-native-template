# Navigation

Navigation uses React Navigation 7. The root is in `Main.tsx`:

```tsx
<NavigationContainer ref={navigationRef}>
  <AppStack />
</NavigationContainer>
```

## The stack

`src/navigation/AppStack.tsx` builds a **JS stack** (`@react-navigation/stack`) from the screen registry, with headers hidden and `SplashScreen` as the initial route.

```tsx
<App.Navigator initialRouteName="SplashScreen">
  {screens.map((item) => (
    <App.Screen key={item.name} name={item.name} component={item.component} options={options} />
  ))}
</App.Navigator>
```

`@react-navigation/native-stack` is also installed, and the screens type their props with `NativeStackNavigationProp`. To switch to the faster native stack, replace `createStackNavigator` with `createNativeStackNavigator` and `StackNavigationOptions` with `NativeStackNavigationOptions`. See [Roadmap](./roadmap.md#known-issues).

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

   You can pass per-screen `options` here as well; note that `AppStack` currently applies the shared `options` and ignores `item.options`. Change it to `options={{ ...options, ...item.options }}` if you need per-screen options.

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
