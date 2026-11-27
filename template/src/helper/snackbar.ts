/**
 * Tiny snackbar store. `showSnackbar` / `showErrorSnackbar` (re-exported from
 * common-functions.ts) can be called from anywhere: screens, mutation
 * callbacks, axios interceptors. <SnackbarHost /> in App.tsx renders them.
 */
export type SnackbarType = 'success' | 'error' | 'info';

export interface SnackbarMessage {
  id: number;
  title: string;
  message?: string;
  type: SnackbarType;
  duration: number;
}

type Listener = (snack: SnackbarMessage) => void;

const DEFAULT_DURATION_MS = 3000;
const listeners = new Set<Listener>();
let nextId = 1;

export const subscribeSnackbar = (listener: Listener) => {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
};

export const pushSnackbar = (
  title: string,
  options: { message?: string; type?: SnackbarType; duration?: number } = {},
) => {
  const snack: SnackbarMessage = {
    id: nextId++,
    title,
    message: options.message,
    type: options.type ?? 'info',
    duration: options.duration ?? DEFAULT_DURATION_MS,
  };
  listeners.forEach(listener => listener(snack));
};
