import React, { useMemo } from 'react';
import { StatusBar } from 'react-native';
import { DarkTheme, DefaultTheme, NavigationContainer, type Theme } from '@react-navigation/native';
import AppStack from './src/navigation/AppStack';
import { navigationRef } from './src/helper/navigation-service';
import { useTheme } from './src/hooks/ThemeContext';

const Main = () => {
  const { theme, mode } = useTheme();

  // Gives the native screens and transitions the app's colors, so there's no
  // white flash behind screens in dark mode.
  const navigationTheme = useMemo<Theme>(() => {
    const base = mode === 'dark' ? DarkTheme : DefaultTheme;
    return {
      ...base,
      colors: {
        ...base.colors,
        primary: theme.primary,
        background: theme.background,
        card: theme.card,
        text: theme.text,
        border: theme.border,
        notification: theme.error,
      },
    };
  }, [mode, theme]);

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
      {/* Status bar icons follow the active theme (light icons on dark backgrounds). */}
      <StatusBar barStyle={mode === 'dark' ? 'light-content' : 'dark-content'} />
      <AppStack />
    </NavigationContainer>
  );
};

export default Main;
