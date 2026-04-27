import { readString, writeString } from './storageClient';
import { STORAGE_KEYS, STORAGE_VERSION } from './storageKeys';

export async function runStorageMigrations(): Promise<void> {
  const currentVersion = await readString(STORAGE_KEYS.version);

  if (currentVersion === STORAGE_VERSION) {
    return;
  }

  if (!currentVersion) {
    await writeString(STORAGE_KEYS.version, STORAGE_VERSION);
    return;
  }

  await writeString(STORAGE_KEYS.version, STORAGE_VERSION);
}
