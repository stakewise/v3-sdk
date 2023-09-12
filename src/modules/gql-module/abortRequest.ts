type Callback<Data, ModifiedData = Data> = (value: Data) => ModifiedData | PromiseLike<ModifiedData>

type SecondCallback<Data> = (value: Data) => Data | void

type AbortRequestInit<Data, ModifiedData> = RequestInit & {
  onSuccess: Callback<Data, ModifiedData>
}

type PendingRequest = {
  count: number
  promise: Promise<any>
}

const requestsQueue: Record<string, PendingRequest | undefined> = {}

const dummyPromise = new Promise(() => {})

// Returns fetch promise that can be aborted
// If we create several promises, only one request will be executed
class AbortRequest<Data, ModifiedData> {
  controller = new AbortController()
  promise: Promise<ModifiedData>
  body: string
  isAborted: boolean

  constructor(url: RequestInfo | URL, abortRequestInit: AbortRequestInit<Data, ModifiedData>) {
    const { onSuccess, ...init } = abortRequestInit

    this.body = init.body as string
    this.isAborted = false

    const pendingRequest = requestsQueue[this.body]

    if (pendingRequest) {
      pendingRequest.count += 1
      this.promise = pendingRequest.promise
    }
    else {
      this.promise = fetch(url, {
        ...init,
        signal: this.controller.signal,
      })
        .then(async (res) => {
          try {
            const { data } = await res.json()

            requestsQueue[this.body] = undefined

            if (this.isAborted) {
              return dummyPromise as Promise<ModifiedData>
            }

            if (typeof onSuccess === 'function') {
              return onSuccess(data) as Promise<ModifiedData>
            }

            return data as Promise<ModifiedData>
          }
          catch (error) {
            return Promise.reject(error)
          }
        })
        .catch((error) => {
          requestsQueue[this.body] = undefined

          if (this.isAborted) {
            return dummyPromise as Promise<ModifiedData>
          }

          return Promise.reject(error)
        })

      requestsQueue[this.body] = {
        promise: this.promise,
        count: 0,
      }
    }
  }

  then(onSuccess: SecondCallback<ModifiedData>, onError?: SecondCallback<ModifiedData>) {
    if (this.isAborted) {
      return dummyPromise
    }

    return this.promise.then(onSuccess, onError)
  }

  catch(callback: SecondCallback<ModifiedData>) {
    return this.promise.catch(callback)
  }

  abort() {
    this.isAborted = true

    if (requestsQueue[this.body]?.count) {
      (requestsQueue[this.body] as PendingRequest).count -= 1
    }
    else {
      requestsQueue[this.body] = undefined
      this.controller.abort()
    }
  }
}


export default AbortRequest
