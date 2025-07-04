import MemoryStorage from './MemoryStorage'


const ffErrors = [
  'NS_ERROR_FAILURE', // has max size
  'NS_ERROR_FILE_CORRUPTED', // is crashed
  'NS_ERROR_FILE_NO_DEVICE_SPACE',
]

class LocalStorage {
  readonly memoryLocalStorage?: MemoryStorage
  readonly memorySessionStorage?: MemoryStorage

  constructor() {
    if (!LocalStorage.isSupported(() => localStorage)) {
      this.memoryLocalStorage = new MemoryStorage()
    }

    if (!LocalStorage.isSupported(() => sessionStorage)) {
      this.memorySessionStorage = new MemoryStorage()
    }
  }

  // we should check it like this, to avoid "Operation Insecure" errors
  // add replace it with MemoryStorage
  private static isSupported(getStorage: () => Storage) {
    try {
      const testKey = '__some_random_key_you_are_not_going_to_use__'
      getStorage().setItem(testKey, testKey)
      getStorage().removeItem(testKey)
      return true
    }
    catch (error) {
      return false
    }
  }

  private getLocalStorage(): Storage {
    return this.memoryLocalStorage || localStorage
  }

  private getSessionStorage(): Storage {
    return this.memorySessionStorage || sessionStorage
  }

  private get<T>(name: string, storage: Storage): T | null {
    try {
      const value = storage.getItem(name)

      return value && JSON.parse(value)
    }
    catch (error: any) {
      if (ffErrors.includes(error.name)) {
        this.clear(storage)

        return null
      }

      this.remove(name, storage) // remove invalid data

      return null
    }
  }

  private set<T>(name: string, value: T, storage: Storage) {
    try {
      storage.setItem(name, JSON.stringify(value))
    }
    catch (error: any) {
      if (ffErrors.includes(error.name)) {
        this.clear(storage)
      }
    }
  }

  private remove(name: string, storage: Storage) {
    try {
      storage.removeItem(name)
    }
    catch (error) {
      console.error(error, name)
    }
  }

  // to show error alert only once
  private corruptedAlertWasShowed = false

  private clear(storage: Storage) {
    // Firefox corrupted file error, try to clean up the storage, and ignore error
    // https://stackoverflow.com/questions/18877643/error-in-local-storage-ns-error-file-corrupted-firefox
    try {
      storage.clear()
    }
    catch (error: any) {
      if (ffErrors.includes(error.name) && !this.corruptedAlertWasShowed) {
        // eslint-disable-next-line max-len
        alert('Oops, looks like your browser storage got corrupted. Follow the steps at https://support.mozilla.org/en-US/kb/storage to fix it.')

        this.corruptedAlertWasShowed = true
      }
    }
  }

  private keys(storage: Storage): string[] {
    const result: string[] = []

    for (let i = 0; i < storage.length; i++) {
      const key = storage.key(i)

      if (key) {
        result.push()
      }
    }

    return result
  }

  // localStorage
  public getItem<T>(name: string): T | null {
    return this.get<T>(name, this.getLocalStorage())
  }

  public setItem<T>(name: string, value: T) {
    this.set<T>(name, value, this.getLocalStorage())
  }

  public removeItem(name: string) {
    this.remove(name, this.getLocalStorage())
  }

  public getKeys(): string[] {
    return this.keys(this.getLocalStorage())
  }

  public clearAll() {
    const storage = this.getLocalStorage()

    this.clear(storage)
  }

  // session storage
  public getSessionItem<T>(name: string): T | null {
    return this.get(name, this.getSessionStorage())
  }

  public setSessionItem<T>(name: string, value: T) {
    this.set(name, value, this.getSessionStorage())
  }

  public removeSessionItem(name: string) {
    this.remove(name, this.getSessionStorage())
  }

  public getSessionKeys(): string[] {
    return this.keys(this.getSessionStorage())
  }

  public clearAllSession() {
    const storage = this.getSessionStorage()

    this.clear(storage)
  }
}


export default LocalStorage
