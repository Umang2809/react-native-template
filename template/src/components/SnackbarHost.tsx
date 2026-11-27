import React, { useEffect, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { subscribeSnackbar, type SnackbarMessage } from '../helper/snackbar';
import { useTheme } from '../hooks/ThemeContext';
import { Typography } from '../helper/typography';
import { horizontalScale, moderateScale, verticalScale } from '../helper/matrics';
import { colors } from '../helper/colors';

/**
 * Renders messages sent with showSnackbar / showErrorSnackbar. Mounted once
 * in App.tsx inside ThemeProvider; one message at a time, newest wins.
 */
const SnackbarHost = () => {
  const insets = useSafeAreaInsets();
  const { theme } = useTheme();
  const [snack, setSnack] = useState<SnackbarMessage | null>(null);

  useEffect(() => subscribeSnackbar(setSnack), []);

  useEffect(() => {
    if (!snack) {
      return;
    }
    const timer = setTimeout(() => setSnack(null), snack.duration);
    return () => clearTimeout(timer);
  }, [snack]);

  const isError = snack?.type === 'error';
  const backgroundColor = isError ? theme.error : theme.text;
  const color = isError ? theme.onPrimary : theme.background;

  return (
    <View
      pointerEvents="box-none"
      style={[styles.container, { paddingBottom: insets.bottom + verticalScale(16) }]}>
      {snack ? (
        <Animated.View key={snack.id} entering={FadeInDown} exiting={FadeOutDown}>
          <Pressable
            onPress={() => setSnack(null)}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            style={[styles.snack, { backgroundColor }]}>
            <Text style={[Typography.subhead, styles.title, { color }]}>{snack.title}</Text>
            {snack.message ? (
              <Text style={[Typography.footnote, styles.message, { color }]}>{snack.message}</Text>
            ) : null}
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
};

export default SnackbarHost;

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: horizontalScale(16),
  },
  snack: {
    width: '100%',
    maxWidth: 560,
    alignSelf: 'center',
    borderRadius: moderateScale(12),
    paddingHorizontal: horizontalScale(16),
    paddingVertical: verticalScale(12),
    elevation: 4,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  title: {
    fontWeight: '600',
  },
  message: {
    marginTop: verticalScale(2),
    opacity: 0.8,
  },
});
