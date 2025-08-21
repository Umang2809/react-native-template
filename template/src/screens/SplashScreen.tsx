import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';

interface Props { }

const SplashScreen = (props: Props) => {
    return (
        <View style={styles.container}>
            <Text>SplashScreen</Text>
        </View>
    );
};

export default SplashScreen;

const styles = StyleSheet.create({
    container: {}
});
