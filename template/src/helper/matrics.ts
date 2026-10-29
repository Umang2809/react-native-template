import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const guidelineBaseWidth: number = 390;
const guidelineBaseHeight: number = 844;

export const isTablet = width >= 768;
const tabletMaxWidth = 550;
const tabletMaxHeight = 900;

const effectiveWidth = isTablet ? Math.min(width, tabletMaxWidth) : width;
const effectiveHeight = isTablet ? Math.min(height, tabletMaxHeight) : height;

const horizontalScale = (size: number): number =>
  (effectiveWidth / guidelineBaseWidth) * size;

const verticalScale = (size: number): number =>
  (effectiveHeight / guidelineBaseHeight) * size;

const moderateScale = (size: number, factor: number = 0.5): number =>
  size + (horizontalScale(size) - size) * factor;

const getResponsiveIconSize = (baseSize = 100) => {
  const scaleFactor = Math.min(
    effectiveWidth / guidelineBaseWidth,
    effectiveHeight / guidelineBaseHeight,
  );
  return baseSize * scaleFactor;
};

export { horizontalScale, verticalScale, moderateScale, getResponsiveIconSize };
