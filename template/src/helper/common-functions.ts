import axios from 'axios';
import { format, isValid, parseISO } from 'date-fns';
import { AppString } from '../../constants/AppString';
import { pushSnackbar } from './snackbar';

// ---------- Feedback ----------

/** Neutral/success message at the bottom of the screen. */
export const showSnackbar = (title: string, message?: string) =>
  pushSnackbar(title, { message, type: 'success' });

/** Error message. Pass the error's message, or nothing for the generic one. */
export const showErrorSnackbar = (message?: string) =>
  pushSnackbar(message || AppString.somethingWentWrong, { type: 'error' });

/**
 * Best human-readable message from anything thrown by an API call:
 * a backend error body ({ message }), an AxiosError, an Error or a string.
 */
export const getErrorMessage = (error: unknown): string => {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message || error.message;
  }
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message);
  }
  if (typeof error === 'string') {
    return error;
  }
  return AppString.somethingWentWrong;
};

// ---------- Formatting ----------

/** 1234567 -> "1,234,567" */
export const formatWithComma = (value: number, locale = 'en-US') =>
  new Intl.NumberFormat(locale, { maximumFractionDigits: 0 }).format(value);

/** 1234.5 -> "1,234.50" */
export const formatPrice = (value: number, locale = 'en-US') =>
  new Intl.NumberFormat(locale, { minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(
    value,
  );

/** ISO string -> formatted date (date-fns tokens), or null when invalid. */
export function toFormattedDate(dateString: string, formatStr: string): string | null {
  if (!dateString) {
    return null;
  }
  const date = parseISO(dateString);
  if (!isValid(date)) {
    return null;
  }
  return format(date, formatStr);
}

// ---------- Payloads ----------

/** Drops null, undefined and empty-string values before sending a request body/params. */
export const cleanPayload = <T extends Record<string, unknown>>(payload: T): Partial<T> =>
  Object.fromEntries(
    Object.entries(payload).filter(
      ([, value]) => value !== null && value !== undefined && value !== '',
    ),
  ) as Partial<T>;
