import { createMMKV, MMKV } from "react-native-mmkv";
import type { Storage } from "redux-persist";

/**
 * MMKV storage instance.
 * Supports MMKV v4 (createMMKV) and v3 (new MMKV()).
 */
export const storage =
  typeof createMMKV === "function" ? createMMKV() : new (MMKV as any)();

/**
 * Predefined storage keys used across the application.
 */
export const StorageKeys = {
  AUTH_TOKEN: "auth_token",
  USER_DATA: "user_data",
  THEME_MODE: "theme_mode",
  LANGUAGE: "language",
  IS_FIRST_TIME: "is_first_time",
} as const;

export type StorageKey = (typeof StorageKeys)[keyof typeof StorageKeys] | string;

/**
 * Redux-persist compatible storage engine backed by MMKV.
 * Adapts MMKV's synchronous API to the Promise-based interface expected by redux-persist.
 */
export const reduxStorage: Storage = {
  setItem: (key: string, value: string): Promise<boolean> => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string): Promise<string | null> => {
    const value = storage.getString(key);
    return Promise.resolve(value ?? null);
  },
  removeItem: (key: string): Promise<void> => {
    if (typeof (storage as any).remove === "function") {
      (storage as any).remove(key);
    } else if (typeof (storage as any).delete === "function") {
      (storage as any).delete(key);
    }
    return Promise.resolve();
  },
};

/**
 * Retrieves data from MMKV with optional JSON parsing (Synchronous).
 * @param key - The key of the item to retrieve.
 * @param parseJSON - Whether to parse the value as JSON (default: false).
 * @returns The stored value or null if not found.
 */
export const getData = <T = string>(
  key: string,
  parseJSON: boolean = false
): T | null => {
  try {
    const value = storage.getString(key);

    if (value === undefined || value === null) {
      return null;
    }

    if (parseJSON) {
      try {
        return JSON.parse(value) as T;
      } catch (parseError) {
        console.warn(`Failed to parse JSON for key "${key}":`, parseError);
        return value as unknown as T;
      }
    }

    return value as unknown as T;
  } catch (error) {
    console.error(`Error retrieving data for key "${key}":`, error);
    return null;
  }
};

/**
 * Stores data in MMKV with automatic JSON stringification for objects/arrays (Synchronous).
 * @param key - The key to store the item under.
 * @param value - The value to store.
 * @returns True if successful, false otherwise.
 */
export const setData = <T>(key: string, value: T): boolean => {
  try {
    if (typeof value === "string") {
      storage.set(key, value);
    } else if (typeof value === "number") {
      storage.set(key, value);
    } else if (typeof value === "boolean") {
      storage.set(key, value);
    } else {
      storage.set(key, JSON.stringify(value));
    }
    return true;
  } catch (error) {
    console.error(`Error storing data for key "${key}":`, error);
    return false;
  }
};

/**
 * Removes a single item from MMKV (Synchronous).
 * @param key - The key of the item to remove.
 * @returns True if successful, false otherwise.
 */
export const removeData = (key: string): boolean => {
  try {
    if (typeof (storage as any).remove === "function") {
      (storage as any).remove(key);
    } else if (typeof (storage as any).delete === "function") {
      (storage as any).delete(key);
    }
    return true;
  } catch (error) {
    console.error(`Error removing data for key "${key}":`, error);
    return false;
  }
};

/**
 * Clears all data from MMKV (Synchronous).
 * @returns True if successful, false otherwise.
 */
export const removeAll = (): boolean => {
  try {
    storage.clearAll();
    return true;
  } catch (error) {
    console.error("Error clearing all storage:", error);
    return false;
  }
};

/**
 * Checks if a key exists in MMKV (Synchronous).
 * @param key - The key to check.
 * @returns True if key exists, false otherwise.
 */
export const hasKey = (key: string): boolean => {
  try {
    return storage.contains(key);
  } catch (error) {
    console.error(`Error checking key "${key}":`, error);
    return false;
  }
};

/**
 * Helper object providing convenient type-safe access to MMKV.
 */
export const StoragePreferences = {
  storage,
  reduxStorage,
  keys: StorageKeys,
  get: getData,
  set: setData,
  getString: (key: string): string | undefined => storage.getString(key),
  setString: (key: string, value: string): void => storage.set(key, value),
  getNumber: (key: string): number | undefined => storage.getNumber(key),
  setNumber: (key: string, value: number): void => storage.set(key, value),
  getBoolean: (key: string): boolean | undefined => storage.getBoolean(key),
  setBoolean: (key: string, value: boolean): void => storage.set(key, value),
  remove: removeData,
  removeAll,
  hasKey,
  getAllKeys: (): string[] => storage.getAllKeys(),
};

export default StoragePreferences;
