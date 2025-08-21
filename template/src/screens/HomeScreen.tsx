import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

interface Props { }

const HomeScreen = (props: Props) => {
    return (
        <SafeAreaView>
            <View style={styles.container}>
                <Text>HomeScreen</Text>
            </View>
        </SafeAreaView>
    );
};

export default HomeScreen;

const styles = StyleSheet.create({
    container: {}
});
