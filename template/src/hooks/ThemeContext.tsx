import React, { createContext, useContext, useEffect, useState } from 'react';
import { Appearance } from 'react-native';
import { themes, ThemeType } from '../theme';

type ThemeMode = 'light' | 'dark';

interface ThemeContextProps {
    theme: ThemeType;
    mode: ThemeMode;
    toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextProps | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const systemColorScheme = Appearance.getColorScheme() as ThemeMode;
    const [mode, setMode] = useState<ThemeMode>(systemColorScheme || 'light');

    const toggleTheme = () => setMode(prev => (prev === 'light' ? 'dark' : 'light'));

    useEffect(() => {
        const listener = Appearance.addChangeListener(({ colorScheme }) => {
            if (colorScheme) {
                setMode(colorScheme as ThemeMode);
            }
        });
        return () => listener.remove();
    }, []);

    return (
        <ThemeContext.Provider value={{ theme: themes[mode], mode, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within ThemeProvider');
    }
    return context;
};
