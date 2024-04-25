class AbortCallback {
  callback: Promise<any>
  onAbort: () => void

  constructor(callback: Promise<any>, onAbort: () => void) {
    this.callback = callback
    this.onAbort = onAbort
  }

  then(onSuccess: (data: any) => any, onError?: (error: any) => any) {
    return new AbortCallback(this.callback.then(onSuccess, onError), this.onAbort)
  }

  catch(onError: (error: any) => any) {
    return new AbortCallback(this.callback.catch(onError), this.onAbort)
  }

  finally(onFinally: () => any) {
    return new AbortCallback(this.callback.finally(onFinally), this.onAbort)
  }

  abort() {
    this.onAbort()
  }
}


export default AbortCallback
