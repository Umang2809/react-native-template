import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Appearance } from 'react-native';
import { themes, ThemeMode, ThemeType } from '../theme';
import { StorageKeys, StoragePreferences } from '../../constants/StoragePreferences';

/** What the user picked: a fixed mode, or follow the OS. */
export type ThemePreference = ThemeMode | 'system';

interface ThemeContextProps {
  /** Colors of the active theme. Use them in styles: `{ color: theme.text }`. */
  theme: ThemeType;
  /** The mode actually shown. */
  mode: ThemeMode;
  /** The user's choice, persisted in MMKV. */
  preference: ThemePreference;
  setPreference: (preference: ThemePreference) => void;
  /** Switches between light and dark (pins the choice). */
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

const readSystemMode = (): ThemeMode => (Appearance.getColorScheme() === 'dark' ? 'dark' : 'light');

const readStoredPreference = (): ThemePreference => {
  const stored = StoragePreferences.getString(StorageKeys.THEME_MODE);
  return stored === 'light' || stored === 'dark' ? stored : 'system';
};

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [systemMode, setSystemMode] = useState<ThemeMode>(readSystemMode);
  // MMKV is synchronous, so the saved choice applies on the first frame.
  const [preference, setPreferenceState] = useState<ThemePreference>(readStoredPreference);
  const mode: ThemeMode = preference === 'system' ? systemMode : preference;

  useEffect(() => {
    const listener = Appearance.addChangeListener(({ colorScheme }) => {
      if (colorScheme === 'light' || colorScheme === 'dark') {
        setSystemMode(colorScheme);
      }
    });
    return () => listener.remove();
  }, []);

  const value = useMemo<ThemeContextProps>(() => {
    const setPreference = (next: ThemePreference) => {
      if (next === 'system') {
        StoragePreferences.remove(StorageKeys.THEME_MODE);
      } else {
        StoragePreferences.setString(StorageKeys.THEME_MODE, next);
      }
      setPreferenceState(next);
    };

    return {
      theme: themes[mode],
      mode,
      preference,
      setPreference,
      toggleTheme: () => setPreference(mode === 'light' ? 'dark' : 'light'),
    };
  }, [mode, preference]);

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};
