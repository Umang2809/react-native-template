import {
  cleanPayload,
  formatPrice,
  formatWithComma,
  getErrorMessage,
} from '../src/helper/common-functions';
import { pushSnackbar, subscribeSnackbar } from '../src/helper/snackbar';

describe('common-functions', () => {
  it('formats numbers', () => {
    expect(formatWithComma(1234567)).toBe('1,234,567');
    expect(formatPrice(1234.5)).toBe('1,234.50');
  });

  it('removes empty values from payloads', () => {
    expect(cleanPayload({ a: 1, b: '', c: null, d: undefined, e: 0, f: false })).toEqual({
      a: 1,
      e: 0,
      f: false,
    });
  });

  it('reads error messages from API errors', () => {
    expect(getErrorMessage({ message: 'Invalid token' })).toBe('Invalid token');
    expect(getErrorMessage('Plain')).toBe('Plain');
  });
});

describe('snackbar store', () => {
  it('delivers messages to subscribers until they unsubscribe', () => {
    const listener = jest.fn();
    const unsubscribe = subscribeSnackbar(listener);

    pushSnackbar('Saved', { type: 'success' });
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Saved', type: 'success' }),
    );

    unsubscribe();
    pushSnackbar('Ignored');
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
