import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

// Hooks / state
import { useTheme } from '../hooks/ThemeContext';
import { useAppDispatch, useAppSelector } from '../redux/store';
import { clearAuth, selectCurrentUser } from '../redux/slices/authSlice';

// Helpers / constants
import { navigateAndSimpleReset } from '../helper/navigation-service';
import { Typography } from '../helper/typography';
import { horizontalScale, moderateScale, verticalScale } from '../helper/matrics';
import { AppString } from '../../constants/AppString';

const HomeScreen = () => {
  const { theme, mode, preference, toggleTheme, setPreference } = useTheme();
  const user = useAppSelector(selectCurrentUser);
  const dispatch = useAppDispatch();

  const onLogout = () => {
    dispatch(clearAuth());
    navigateAndSimpleReset('LoginScreen');
  };

  const outlineButton = [styles.button, styles.outline, { borderColor: theme.border }];

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
      <View style={styles.container}>
        <Text style={[Typography.title1, { color: theme.text }]}>
          {AppString.hello}
          {user?.name ? `, ${user.name}` : ''}
        </Text>

        <View style={[styles.card, { backgroundColor: theme.card, borderColor: theme.border }]}>
          <Text style={[Typography.caption1, styles.overline, { color: theme.muted }]}>
            {AppString.currentTheme}
          </Text>
          <Text style={[Typography.headline, styles.capitalize, { color: theme.text }]}>
            {mode} · {preference}
          </Text>
        </View>

        <View style={styles.actions}>
          <Pressable
            onPress={toggleTheme}
            accessibilityRole="button"
            style={[styles.button, { backgroundColor: theme.primary }]}>
            <Text style={[Typography.headline, { color: theme.onPrimary }]}>
              {AppString.toggleTheme}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPreference('system')}
            disabled={preference === 'system'}
            accessibilityRole="button"
            style={[outlineButton, preference === 'system' && styles.disabled]}>
            <Text style={[Typography.headline, { color: theme.text }]}>
              {AppString.followSystem}
            </Text>
          </Pressable>
          <Pressable onPress={onLogout} accessibilityRole="button" style={outlineButton}>
            <Text style={[Typography.headline, { color: theme.error }]}>{AppString.logout}</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: horizontalScale(24),
  },
  card: {
    marginTop: verticalScale(32),
    borderRadius: moderateScale(16),
    borderWidth: 1,
    padding: moderateScale(20),
  },
  overline: {
    textTransform: 'uppercase',
  },
  capitalize: {
    marginTop: verticalScale(4),
    textTransform: 'capitalize',
  },
  actions: {
    marginTop: verticalScale(24),
    gap: moderateScale(12),
  },
  button: {
    height: 48,
    borderRadius: moderateScale(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  outline: {
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.5,
  },
});
