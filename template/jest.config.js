module.exports = {
  preset: 'react-native',
  // Packages shipped as untranspiled ESM/JSX that Jest must run through Babel.
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native(-[a-z-]+)?|@react-native(-community)?|@react-navigation|react-redux|redux-persist|@reduxjs/toolkit|immer|@tanstack)/)',
  ],
  setupFiles: ['react-native-gesture-handler/jestSetup', '<rootDir>/jest.setup.js'],
};
