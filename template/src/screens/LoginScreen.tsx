import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTheme } from "../hooks/ThemeContext";
import { useAppDispatch } from "../redux/store";
import { setCredentials } from "../redux/slices/authSlice";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { RouteProp } from "@react-navigation/native";
import { AppStackParams } from "../navigation/AppStackParams";

type Props = {
  navigation: NativeStackNavigationProp<AppStackParams, "LoginScreen">;
  route: RouteProp<AppStackParams, "LoginScreen">;
};

const LoginScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onLogin = () => {
    // store dummy data in auth reducer
    dispatch(
      setCredentials({
        user: { id: "1", name: "Demo User", email: email || "demo@local" },
        accessToken: "dummy-access-token-123",
      }),
    );
    navigation.reset({ index: 0, routes: [{ name: "HomeScreen" }] });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={[styles.container, { backgroundColor: theme.background }]}>
        <Text style={[styles.title, { color: theme.text }]}>Welcome back</Text>
        <TextInput
          placeholder="Email"
          placeholderTextColor={theme.text + "88"}
          style={[
            styles.input,
            { backgroundColor: theme.card, color: theme.text },
          ]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor={theme.text + "88"}
          style={[
            styles.input,
            { backgroundColor: theme.card, color: theme.text },
          ]}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.primary }]}
          onPress={onLogin}
        >
          <Text style={{ color: theme.text }}>Sign in</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: "600",
    marginBottom: 24,
    textAlign: "center",
  },
  input: {
    height: 48,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  button: {
    height: 48,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 12,
  },
});
