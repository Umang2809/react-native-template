# Storage (MMKV)

Local storage uses [react-native-mmkv](https://github.com/mrousavy/react-native-mmkv) v4, a synchronous key-value store that is much faster than AsyncStorage. It runs on Nitro Modules (`react-native-nitro-modules` is installed for this reason).

Everything lives in `constants/StoragePreferences.ts`.

## Exports

| Export | What it is |
| --- | --- |
| `storage` | The raw MMKV instance (`createMMKV()`, react-native-mmkv v4). |
| `reduxStorage` | A redux-persist `Storage` adapter. Wraps the synchronous MMKV calls in Promises. |
| `StorageKeys` | Shared key names (see below). |
| `getData(key, parseJSON?)` | Read a string, optionally `JSON.parse` it. Returns `null` if missing. |
| `setData(key, value)` | Write a string, number or boolean as-is; objects and arrays are JSON-stringified. |
| `removeData(key)` | Delete one key. |
| `removeAll()` | Clear every key, **including persisted Redux state**. |
| `hasKey(key)` | Whether the key exists. |
| `StoragePreferences` (default) | One object bundling all of the above plus typed getters/setters. |

### `StorageKeys`

```ts
AUTH_TOKEN:    'auth_token'
USER_DATA:     'user_data'
THEME_MODE:    'theme_mode'
LANGUAGE:      'language'
IS_FIRST_TIME: 'is_first_time'
```

These are reserved names. The template itself does not write to them yet (auth lives in the persisted Redux slice under `persist:root`). Add your own keys here instead of using string literals around the app.

### `StoragePreferences` methods

| Method | Signature |
| --- | --- |
| `get` / `set` | Same as `getData` / `setData` |
| `getString` / `setString` | `(key) => string \| undefined` / `(key, value: string) => void` |
| `getNumber` / `setNumber` | `(key) => number \| undefined` / `(key, value: number) => void` |
| `getBoolean` / `setBoolean` | `(key) => boolean \| undefined` / `(key, value: boolean) => void` |
| `remove`, `removeAll`, `hasKey` | As above |
| `getAllKeys` | `() => string[]` |
| `storage`, `reduxStorage`, `keys` | The instance, adapter and `StorageKeys` |

## Examples

```ts
import StoragePreferences, { getData, setData, StorageKeys } from '../../constants/StoragePreferences';

// primitives
setData(StorageKeys.IS_FIRST_TIME, false);
StoragePreferences.getBoolean(StorageKeys.IS_FIRST_TIME); // false

// objects
setData('last_filters', { sort: 'date', tags: ['a', 'b'] });
const filters = getData<{ sort: string; tags: string[] }>('last_filters', true);
```

> `getData` reads with `getString`. Values written as numbers or booleans by `setData` must be read back with `getNumber` / `getBoolean`, not `getData`.

## Redux vs. MMKV: which to use

| Use the persisted Redux slice when… | Use MMKV directly when… |
| --- | --- |
| UI must re-render when the value changes | The value is read once (e.g. onboarding flag at startup) |
| The value is part of app state (auth, settings) | It's a cache or large blob you don't want in the store |
| You want devtools/time-travel | You need it before the store exists |

## Security note

MMKV is **not encrypted** by default, so the persisted `accessToken` sits in plain storage. For production apps either create the instance with an encryption key or move tokens to the Keychain/Keystore (e.g. `react-native-keychain`). This is tracked in the [Roadmap](./roadmap.md).

## Testing

`__mocks__/react-native-mmkv.ts` replaces MMKV with an in-memory `Map` in Jest, so storage code runs in tests without native modules.
