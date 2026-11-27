import React from 'react';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { AppStackParams } from './AppStackParams';
import { screens } from './screens';

const Stack = createNativeStackNavigator<AppStackParams>();

/**
 * Defaults for every screen. Native stack uses UINavigationController on iOS
 * and Fragments on Android, so transitions and swipe-back run natively.
 */
export const defaultScreenOptions: NativeStackNavigationOptions = {
  headerShown: false,
  // Same slide on both platforms (Android's default is a fade-from-bottom).
  animation: 'ios_from_right',
  // Off-screen screens stop re-rendering until they're focused again.
  freezeOnBlur: true,
};

/** Use with `useNavigation<StackNavigation>()` in nested components. */
export type StackNavigation = NativeStackNavigationProp<AppStackParams>;

const AppStack = () => (
  <Stack.Navigator initialRouteName="SplashScreen" screenOptions={defaultScreenOptions}>
    {screens.map(item => (
      <Stack.Screen
        key={item.name}
        name={item.name}
        component={item.component}
        options={item.options}
      />
    ))}
    {/* Tabs or a drawer can be registered here as screens (see docs/navigation.md). */}
  </Stack.Navigator>
);

export default AppStack;
