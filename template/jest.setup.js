/* global jest */
// Reanimated and Worklets need native modules; swap them for their official
// JS mocks so components that animate (SnackbarHost ...) render in Jest.
jest.mock('react-native-worklets', () => require('react-native-worklets/src/mock'));
jest.mock('react-native-reanimated', () => require('react-native-reanimated/mock'));
