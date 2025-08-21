import AsyncStorage from "@react-native-async-storage/async-storage";

/**
 * Retrieves data from AsyncStorage with optional JSON parsing.
 * @param key - The key of the item to retrieve.
 * @param parseJSON - Whether to parse the value as JSON (default: false).
 * @returns The stored value or null if not found.
 */
export const getData = async <T = string>(
    key: string,
    parseJSON: boolean = false
): Promise<T | null> => {
    try {
        const value = await AsyncStorage.getItem(key);

        if (value === null) return null;

        if (parseJSON) {
            try {
                return JSON.parse(value) as T;
            } catch (parseError) {
                console.warn(`Failed to parse JSON for key "${key}":`, parseError);
                return value as T;
            }
        }

        return value as T;
    } catch (error) {
        console.error(`Error retrieving data for key "${key}":`, error);
        return null;
    }
};

/**
 * Stores data in AsyncStorage with automatic JSON stringification for objects.
 * @param key - The key to store the item under.
 * @param value - The value to store.
 * @returns True if successful, false otherwise.
 */
export const setData = async<T>(key: string, value: T) : Promise<boolean> => {
  try {
    const stringValue =
    typeof value === "string" ? value : JSON.stringify(value);
    await AsyncStorage.setItem(key, stringValue);
    return true;
  } catch (error) {
        console.error(`Error storing data for key "${key}":`, error);
    return false;
  }
};

    /**
     * Removes a single item from AsyncStorage.
     * @param key - The key of the item to remove.
     * @returns True if successful, false otherwise.
     */
    export const removeData = async (key: string): Promise<boolean> => {
  try {
            await AsyncStorage.removeItem(key);
        return true;
  } catch (error) {
            console.error(`Error removing data for key "${key}":`, error);
        return false;
  }
};

        /**
         * Clears all data from AsyncStorage.
         * @returns True if successful, false otherwise.
         */
        export const removeAll = async (): Promise<boolean> => {
  try {
                await AsyncStorage.clear();
            return true;
  } catch (error) {
                console.error("Error clearing all storage:", error);
            return false;
  }
};

            /**
             * Checks if a key exists in AsyncStorage.
             * @param key - The key to check.
             * @returns True if key exists, false otherwise.
             */
            export const hasKey = async (key: string): Promise<boolean> => {
  try {
    const value = await AsyncStorage.getItem(key);
                return value !== null;
  } catch (error) {
                    console.error(`Error checking key "${key}":`, error);
                return false;
  }
};
