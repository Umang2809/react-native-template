import * as React from 'react';
import { Text, View, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../hooks/ThemeContext';

interface Props { }

const HomeScreen = (props: Props) => {
    const { theme, toggleTheme, mode } = useTheme();
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
            <View style={[styles.container, { backgroundColor: theme.background }]}>
                <Text style={{ color: theme.text }}>Current theme: {mode}</Text>
                <TouchableOpacity
                    style={[styles.button, { backgroundColor: theme.primary }]}
                    onPress={toggleTheme}
                >
                    <Text style={{ color: theme.text }}>Toggle Theme</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    button: {
        marginTop: 20,
        padding: 12,
        borderRadius: 8,
    },
});
