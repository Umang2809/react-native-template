import * as React from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppStackParams } from '../navigation/AppStackParams';
import { useEffect } from 'react';
type Props = {
    navigation: NativeStackNavigationProp<
        AppStackParams,
        'SplashScreen',
        'SplashScreen'
    >;
    route: RouteProp<AppStackParams, 'SplashScreen'>;
};

const SplashScreen = ({ navigation }: Props) => {
    useEffect(() => {
        setTimeout(() => {
            navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] })
        }, 1500);
    }, [])
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
