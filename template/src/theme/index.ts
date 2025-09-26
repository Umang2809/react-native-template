import { lightTheme } from './lightTheme';
import { darkTheme } from './darkTheme';

export type ThemeType = typeof lightTheme;

export const themes = {
    light: lightTheme,
    dark: darkTheme,
};
