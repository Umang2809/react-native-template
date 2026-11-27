import React, { useState } from 'react';
import { KeyboardAvoidingView, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';

// Types
import { AppStackParams } from '../navigation/AppStackParams';

// Hooks / state
import { useTheme } from '../hooks/ThemeContext';
import { useAppDispatch } from '../redux/store';
import { setCredentials } from '../redux/slices/authSlice';

// Helpers / constants
import { showSnackbar } from '../helper/common-functions';
import { isIOS } from '../helper/utility-functions';
import { Typography } from '../helper/typography';
import { horizontalScale, moderateScale, verticalScale } from '../helper/matrics';
import { AppString } from '../../constants/AppString';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParams, 'LoginScreen'>;
  route: RouteProp<AppStackParams, 'LoginScreen'>;
};

const LoginScreen = ({ navigation }: Props) => {
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const inputStyle = [
    styles.input,
    Typography.body1,
    { backgroundColor: theme.card, borderColor: theme.border, color: theme.text },
  ];

  const onLogin = () => {
    // Demo only: stores dummy credentials. With a real backend, call the
    // mutation instead:
    //   const { mutate: login, isPending } = useLogin();
    //   login({ email, password }, {
    //     onSuccess: res => dispatch(setCredentials(res)),
    //     onError: err => showErrorSnackbar(getErrorMessage(err)),
    //   });
    dispatch(
      setCredentials({
        user: { id: '1', name: 'Demo User', email: email || 'demo@local' },
        accessToken: 'dummy-access-token-123',
      }),
    );
    showSnackbar(AppString.loginSuccess);
    navigation.reset({ index: 0, routes: [{ name: 'HomeScreen' }] });
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <KeyboardAvoidingView behavior={isIOS ? 'padding' : undefined} style={styles.container}>
        <Text style={[Typography.title1, styles.center, { color: theme.text }]}>
          {AppString.welcomeBack}
        </Text>
        <Text style={[Typography.body2, styles.center, styles.subtitle, { color: theme.muted }]}>
          {AppString.signInToContinue}
        </Text>

        <View style={styles.fields}>
          <TextInput
            placeholder={AppString.email}
            placeholderTextColor={theme.muted}
            style={inputStyle}
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
          />
          <TextInput
            placeholder={AppString.password}
            placeholderTextColor={theme.muted}
            style={inputStyle}
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            autoComplete="password"
          />
        </View>

        <Pressable
          onPress={onLogin}
          accessibilityRole="button"
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: theme.primary, opacity: pressed ? 0.8 : 1 },
          ]}>
          <Text style={[Typography.headline, { color: theme.onPrimary }]}>{AppString.login}</Text>
        </Pressable>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(24),
  },
  center: {
    textAlign: 'center',
  },
  subtitle: {
    marginTop: verticalScale(8),
    marginBottom: verticalScale(32),
  },
  fields: {
    gap: moderateScale(12),
  },
  input: {
    height: 48,
    borderRadius: moderateScale(12),
    borderWidth: 1,
    paddingHorizontal: horizontalScale(16),
  },
  button: {
    height: 48,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: verticalScale(24),
  },
});
