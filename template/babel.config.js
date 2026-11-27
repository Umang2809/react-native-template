module.exports = {
  presets: ['module:@react-native/babel-preset'],
  // Reanimated 4 runs on react-native-worklets; this plugin must be listed last.
  plugins: ['react-native-worklets/plugin'],
};
