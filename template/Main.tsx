import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import AppStack from './src/navigation/AppStack';


const Main = () => {
    return (
        <NavigationContainer>
            <AppStack />
        </NavigationContainer>
    )
}

export default Main