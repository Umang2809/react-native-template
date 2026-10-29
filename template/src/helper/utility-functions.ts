// utils.ts
import {
  Dimensions,
  Platform,
  PixelRatio,
  Keyboard,
  Alert,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export const isIOS = Platform.OS === "ios";
export const isAndroid = Platform.OS === "android";
export const deviceWidth = SCREEN_WIDTH;
export const deviceHeight = SCREEN_HEIGHT;

const scale = SCREEN_WIDTH / 390;

export const responsiveFontSize = (size: number): number => {
  const newSize = size * scale;
  if (isIOS) {
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 1;
  }
};

export const responsiveHeight = (height: number): number => {
  return Math.round((SCREEN_HEIGHT / 844) * height);
};

export const responsiveWidth = (width: number): number => {
  return Math.round((SCREEN_WIDTH / 390) * width);
};

export const hideKeyboard = () => {
  Keyboard.dismiss();
};

export const showAlert = (
  title: string,
  message: string,
  settingsText = "Open Settings",
  rejectText = "Reject",
  onSettingsPress: () => void,
) => {
  Alert.alert(
    title,
    message,
    [
      {
        text: settingsText,
        onPress: onSettingsPress,
        style: "default",
      },
      {
        text: rejectText,
        style: "destructive",
      },
    ],
    { cancelable: false },
  );
};
