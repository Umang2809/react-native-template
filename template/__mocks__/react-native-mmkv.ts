const mockStorage = new Map<string, any>();

export class MMKVMock {
  set(key: string, value: boolean | string | number | Uint8Array) {
    mockStorage.set(key, value);
  }

  getString(key: string): string | undefined {
    const val = mockStorage.get(key);
    return typeof val === "string" ? val : undefined;
  }

  getBoolean(key: string): boolean | undefined {
    const val = mockStorage.get(key);
    return typeof val === "boolean" ? val : undefined;
  }

  getNumber(key: string): number | undefined {
    const val = mockStorage.get(key);
    return typeof val === "number" ? val : undefined;
  }

  getBuffer(key: string): Uint8Array | undefined {
    const val = mockStorage.get(key);
    return val instanceof Uint8Array ? val : undefined;
  }

  contains(key: string): boolean {
    return mockStorage.has(key);
  }

  remove(key: string) {
    mockStorage.delete(key);
  }

  delete(key: string) {
    mockStorage.delete(key);
  }

  clearAll() {
    mockStorage.clear();
  }

  getAllKeys(): string[] {
    return Array.from(mockStorage.keys());
  }

  addOnValueChangedListener() {
    return { remove: () => {} };
  }
}

export const MMKV = MMKVMock;

export function createMMKV() {
  return new MMKVMock();
}

export default createMMKV;
