import type React from 'react';
import type { NativeStackNavigationOptions } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import { AppStackParams } from './AppStackParams';

export type ScreenConfig = {
  name: keyof AppStackParams;
  component: React.ComponentType<any>;
  /** Merged over `defaultScreenOptions` in AppStack.tsx. */
  options?: NativeStackNavigationOptions;
};

export const screens: ScreenConfig[] = [
  { name: 'SplashScreen', component: SplashScreen },
  // Login and Home replace the whole stack (navigation.reset), so a fade
  // reads better than a slide.
  { name: 'LoginScreen', component: LoginScreen, options: { animation: 'fade' } },
  { name: 'HomeScreen', component: HomeScreen, options: { animation: 'fade' } },
  // Add your other screens here
];
