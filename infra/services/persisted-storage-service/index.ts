class PersistedStorageService {
  private readonly repo: Storage;

  constructor(repo: Storage) {
    this.repo = repo;
  }

  public get(key: string): unknown | undefined {
    const item = this.repo.getItem(key);
    try {
      if (item) {
        return JSON.parse(item) as unknown;
      }
    } catch {
      return item || undefined;
    }
  }

  public put<T>(key: string, value: T): void {
    this.repo.setItem(key, JSON.stringify(value));
  }

  public remove(key: string): void {
    this.repo.removeItem(key);
  }

  public clear(): void {
    this.repo.clear();
  }
}

export const persistedStorageService = new PersistedStorageService(
  window?.localStorage,
);
