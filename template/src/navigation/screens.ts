import { StackNavigationOptions } from "@react-navigation/stack";
import HomeScreen from "../screens/HomeScreen";
import SplashScreen from "../screens/SplashScreen";
import LoginScreen from "../screens/LoginScreen";
import { AppStackParams } from "./AppStackParams";

export const screens: Array<{
  name: keyof AppStackParams;
  component: React.ComponentType<any>;
  options?: StackNavigationOptions;
}> = [
  { name: "SplashScreen", component: SplashScreen },
  { name: "LoginScreen", component: LoginScreen },
  { name: "HomeScreen", component: HomeScreen },
  // Add your other screens here
];
