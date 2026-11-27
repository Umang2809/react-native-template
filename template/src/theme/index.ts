import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export type ThemeType = typeof lightTheme;
export type ThemeMode = 'light' | 'dark';

export const themes: Record<ThemeMode, ThemeType> = {
  light: lightTheme,
  dark: darkTheme,
};
