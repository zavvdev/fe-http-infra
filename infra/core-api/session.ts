import { persistedStorageService } from "../services/persisted-storage-service";
import { PERSISTED_STORAGE_KEYS } from "../services/persisted-storage-service/config";

export const sessionToken = {
  set: (token: string) =>
    persistedStorageService.put(PERSISTED_STORAGE_KEYS.sessionToken, token),

  get: () => persistedStorageService.get(PERSISTED_STORAGE_KEYS.sessionToken),

  remove: () =>
    persistedStorageService.remove(PERSISTED_STORAGE_KEYS.sessionToken),

  exists: () =>
    Boolean(persistedStorageService.get(PERSISTED_STORAGE_KEYS.sessionToken)),
};

export const terminateSession = () => {
  if (sessionToken.exists()) {
    sessionToken.remove();
    window.location.href = "/login";
  }
};
