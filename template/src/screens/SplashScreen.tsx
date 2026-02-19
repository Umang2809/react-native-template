import * as React from "react";
import { Text, View, StyleSheet } from "react-native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { AppStackParams } from "../navigation/AppStackParams";
import { useEffect } from "react";
import { useAppSelector } from "../redux/store";

import { selectAccessToken } from "../redux/slices/authSlice";
type Props = {
  navigation: NativeStackNavigationProp<
    AppStackParams,
    "SplashScreen",
    "SplashScreen"
  >;
  route: RouteProp<AppStackParams, "SplashScreen">;
};

const SplashScreen = ({ navigation }: Props) => {
  const accessToken = useAppSelector(selectAccessToken);

  useEffect(() => {
    setTimeout(() => {
      if (accessToken) {
        navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
      } else {
        navigation.reset({ index: 0, routes: [{ name: "LoginScreen" }] });
      }
    }, 800);
  }, [accessToken]);
  return (
    <View style={styles.container}>
      <Text>SplashScreen</Text>
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {},
});
