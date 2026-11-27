/**
 * All user-facing text. Screens and components read strings from here
 * instead of hard-coding them. (Multi-language apps: move these into
 * locales/*.json with i18next and keep the same keys.)
 */
export const AppString = {
  // Auth
  welcomeBack: 'Welcome back',
  signInToContinue: 'Sign in to continue',
  login: 'Sign in',
  logout: 'Log out',
  email: 'Email',
  enterEmail: 'Enter your email',
  password: 'Password',
  enterPassword: 'Enter your password',
  show: 'Show',
  hide: 'Hide',

  // Home
  hello: 'Hello',
  currentTheme: 'Current theme',
  toggleTheme: 'Toggle theme',
  followSystem: 'Follow system',

  // Validation
  emailRequired: 'Email is required',
  invalidEmail: 'Enter a valid email',
  passwordRequired: 'Password is required',
  passwordMin: 'Password must be at least 6 characters',

  // Common
  loading: 'Loading…',
  noDataFound: 'No data found',
  somethingWentWrong: 'Something went wrong. Please try again.',
  loginSuccess: 'Signed in successfully',
} as const;
