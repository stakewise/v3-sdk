class AbortCallback {
  private isAborted: boolean
  callback: Promise<any>
  onAbort: () => void

  constructor(callback: Promise<any>, onAbort: () => void) {
    this.isAborted = false
    this.callback = callback
    this.onAbort = onAbort
  }

  then(onSuccess: (data: any) => any, onError?: (error: any) => any) {
    if (this.isAborted) {
      const dummyPromise = new Promise(() => {})

      return new AbortCallback(dummyPromise, this.onAbort)
    }

    return new AbortCallback(this.callback.then(onSuccess, onError), this.onAbort)
  }

  catch(onError: (error: any) => any) {
    return new AbortCallback(this.callback.catch(onError), this.onAbort)
  }

  finally(onFinally: () => any) {
    return new AbortCallback(this.callback.finally(onFinally), this.onAbort)
  }

  abort() {
    this.isAborted = true
    this.onAbort()
  }
}


export default AbortCallback
