import AbortCallback from './abortCallback'


type FirstCallback<Data> = (value: Data) => Data | any

type EmptyCallback = () => void

type AbortPromiseCallback<Data> = (
  resolve: (data: Data) => void,
  reject: (error: any) => void,
) => void

const dummyPromise = new Promise(() => {})

// Wrapper for promise that can be aborted to be not resolved or rejected
class AbortPromise<Data> {
  private promise: Promise<Data>
  private isAborted: boolean
  private onAbort?: () => void

  constructor(callback: AbortPromiseCallback<Data>, onAbort?: () => void) {
    this.isAborted = false
    this.onAbort = onAbort

    this.promise = new Promise(callback)
      .then((data) => {
        try {
          if (this.isAborted) {
            return dummyPromise as Promise<Data>
          }

          return data
        }
        catch (error) {
          return Promise.reject(error)
        }
      })
  }

  then(onSuccess: FirstCallback<Data>, onError?: FirstCallback<Data>) {
    return new AbortCallback(this.promise.then(onSuccess, onError), this.abort.bind(this))
  }

  catch(callback: FirstCallback<Data>) {
    return new AbortCallback(this.promise.catch(callback), this.abort.bind(this))
  }

  finally(callback: EmptyCallback) {
    return new AbortCallback(this.promise.finally(callback), this.abort.bind(this))
  }

  static all<T>(promises: (Promise<T> | AbortPromise<T>)[]) {
    let isAborted = false

    const handleAbort = () => {
      isAborted = false

      promises.forEach((promise) => {
        if (typeof (promise as AbortPromise<T>).abort === 'function') {
          (promise as AbortPromise<T>).abort()
        }
      })
    }

    const allPromises = Promise.all(promises).then((data) => {
      if (isAborted) {
        return dummyPromise as Promise<T[]>
      }

      return data
    })

    return new AbortCallback(allPromises, handleAbort)
  }

  static race<T>(promises: (Promise<T> | AbortPromise<T>)[]) {
    let isAborted = false

    const handleAbort = () => {
      isAborted = false

      promises.forEach((promise) => {
        if (typeof (promise as AbortPromise<T>).abort === 'function') {
          (promise as AbortPromise<T>).abort()
        }
      })
    }

    const allPromises = Promise.race(promises).then((data) => {
      if (isAborted) {
        return dummyPromise as Promise<T>
      }

      return data
    })

    return new AbortCallback(allPromises, handleAbort)
  }

  abort() {
    this.isAborted = true

    if (typeof this.onAbort === 'function') {
      this.onAbort()
    }
  }
}


export default AbortPromise
