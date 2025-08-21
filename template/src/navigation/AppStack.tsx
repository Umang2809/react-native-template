// navigation/AppStack.tsx
import React from "react";
import {
    createStackNavigator,
    StackNavigationOptions,
} from "@react-navigation/stack";
import { NavigationProp } from "@react-navigation/native";
import { AppStackParams } from "./AppStackParams";
import { screens } from "./screens";

const App = createStackNavigator<AppStackParams>();
const options: StackNavigationOptions = { headerShown: false };

export type StackNavigation = NavigationProp<AppStackParams>;

const AppStack = () => {
    return (
        <App.Navigator initialRouteName="SplashScreen">
            {screens.map((item) => (
                <App.Screen
                    key={item.name}
                    name={item.name as any}
                    component={item.component as any}
                    options={options}
                />
            ))}
            {/* 🚀 Later you can add HomeDrawer, Tabs, or other screens separately */}
        </App.Navigator>
    );
};

export default AppStack;