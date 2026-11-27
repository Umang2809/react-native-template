import React, { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { AppStackParams } from '../navigation/AppStackParams';
import { useAppSelector } from '../redux/store';
import { selectAccessToken } from '../redux/slices/authSlice';
import { useTheme } from '../hooks/ThemeContext';
import { Typography } from '../helper/typography';
import { verticalScale } from '../helper/matrics';
import { name as appName } from '../../app.json';

type Props = {
  navigation: NativeStackNavigationProp<AppStackParams, 'SplashScreen'>;
  route: RouteProp<AppStackParams, 'SplashScreen'>;
};

const SPLASH_DELAY_MS = 800;

const SplashScreen = ({ navigation }: Props) => {
  const accessToken = useAppSelector(selectAccessToken);
  const { theme } = useTheme();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.reset({
        index: 0,
        routes: [{ name: accessToken ? 'HomeScreen' : 'LoginScreen' }],
      });
    }, SPLASH_DELAY_MS);
    return () => clearTimeout(timer);
  }, [accessToken, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Text style={[Typography.title1, { color: theme.text }]}>{appName}</Text>
      <ActivityIndicator style={styles.loader} color={theme.primary} />
    </View>
  );
};

export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loader: {
    marginTop: verticalScale(24),
  },
});
