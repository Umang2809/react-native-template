import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import AppStack from "./src/navigation/AppStack";
import { navigationRef } from "./src/helper/navigation-service";

const Main = () => {
  return (
    <NavigationContainer ref={navigationRef}>
      <AppStack />
    </NavigationContainer>
  );
};

export default Main;
