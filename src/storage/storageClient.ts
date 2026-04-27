import AsyncStorage from '@react-native-async-storage/async-storage';

export async function readJson<T>(
  key: string,
  validate: (value: unknown) => value is T
): Promise<T | null> {
  try {
    const raw = await AsyncStorage.getItem(key);

    if (raw === null) {
      return null;
    }

    const parsed: unknown = JSON.parse(raw);

    return validate(parsed) ? parsed : null;
  } catch (error) {
    console.warn(`Failed to read ${key} from storage`, error);
    return null;
  }
}

export async function writeJson<T>(key: string, value: T): Promise<void> {
  try {
    await AsyncStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.warn(`Failed to write ${key} to storage`, error);
  }
}

export async function readString(key: string): Promise<string | null> {
  try {
    return await AsyncStorage.getItem(key);
  } catch (error) {
    console.warn(`Failed to read ${key} from storage`, error);
    return null;
  }
}

export async function writeString(key: string, value: string): Promise<void> {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (error) {
    console.warn(`Failed to write ${key} to storage`, error);
  }
}

export async function removeStorageItem(key: string): Promise<void> {
  try {
    await AsyncStorage.removeItem(key);
  } catch (error) {
    console.warn(`Failed to remove ${key} from storage`, error);
  }
}
