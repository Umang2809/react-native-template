// utils.ts
import { Dimensions, Platform, PixelRatio, Keyboard, Alert } from "react-native";
const { width, height } = Dimensions.get("window");

// Get device dimensions
export const deviceWidth = width;
export const deviceHeight = height;

// Platform checks
export const isAndroid = Platform.OS === "android";
export const isIOS = Platform.OS === "ios";

// Responsive font size
export function responsiveFontSize(size: number) {
    const scale = width / 375; // base width: iPhone 11
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
}

export const responsiveHeight = (value: number) => {
    let temp = value;
    if (deviceHeight != 896) {
        let temp2 = (value / 896).toFixed(4);
        temp = PixelRatio.roundToNearestPixel(deviceHeight * Number(temp2));
    }
    return temp;
};

export const responsiveWidth = (value: number) => {
    let temp = value;
    if (deviceWidth !== 414) {
        let temp2 = (value / 414).toFixed(4); // 414 is a common base width (e.g., iPhone 11)
        temp = PixelRatio.roundToNearestPixel(deviceWidth * Number(temp2));
    }
    return temp;
};

// Check if device is small, medium, large (useful for UI adjustments)
export function getDeviceType() {
    if (width < 360) return "small";
    if (width < 768) return "medium";
    return "large";
}

// Example: normalize size for both iOS/Android
export function normalize(size: number) {
    const scale = width / 375;
    const newSize = size * scale;
    if (isIOS) {
        return Math.round(PixelRatio.roundToNearestPixel(newSize));
    } else {
        return Math.round(PixelRatio.roundToNearestPixel(newSize)) - 2;
    }
}

export const hideKeyboard = () => {
    Keyboard.dismiss();
};

export const showAlert = (
    title: string,
    message: string,
    settingsText = 'Open Settings',
    rejectText = 'Reject',
    onSettingsPress: () => void
) => {
    Alert.alert(
        title,
        message,
        [
            {
                text: settingsText,
                onPress: onSettingsPress,
                style: 'default',
            },
            {
                text: rejectText,
                style: 'destructive',
            },
        ],
        { cancelable: false }
    );
};


