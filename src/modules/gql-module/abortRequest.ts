import AbortPromise from './abortPromise'


type ModifyCallback<Data, ModifiedData = Data> = (value: Data) => ModifiedData | PromiseLike<ModifiedData>

type FirstCallback<Data> = (value: Data) => Data | any

type EmptyCallback = () => void

type ErrorCallback<Data, ModifiedData = Data> = (error: Error | any) => Promise<void> | AbortRequest<Data, ModifiedData>

type AbortRequestInit<Data, ModifiedData> = RequestInit & {
  onSuccess: ModifyCallback<Data, ModifiedData>
  onError?: ErrorCallback<Data, ModifiedData>
}

type PendingRequest = {
  count: number
  promise: Promise<any>
}

const requestsQueue: Record<string, PendingRequest | undefined> = {}

// Returns fetch promise that can be aborted
// If we create several promises, only one request will be executed
class AbortRequest<Data, ModifiedData> {
  private controller = new AbortController()
  request: Promise<Data>
  promise: AbortPromise<ModifiedData>
  body: string
  isAborted: boolean

  constructor(url: RequestInfo | URL, abortRequestInit: AbortRequestInit<Data, ModifiedData>) {
    const { onSuccess, onError, ...init } = abortRequestInit

    this.body = init.body as string
    this.isAborted = false

    const pendingRequest = requestsQueue[this.body]

    if (pendingRequest) {
      pendingRequest.count += 1
      this.request = pendingRequest.promise
    }
    else {
      this.request = fetch(url, {
        ...init,
        signal: this.controller.signal,
      })
        .then((res) => res.json())
        .then((json) => {
          requestsQueue[this.body] = undefined

          if (json?.errors) {
            throw new Error(json.errors[0].message)
          }

          return json?.data as Data
        })
        .catch((error) => {
          requestsQueue[this.body] = undefined

          if (typeof onError === 'function') {
            onError(error)
          }

          return Promise.reject(error)
        })

      requestsQueue[this.body] = {
        promise: this.request,
        count: 1,
      }
    }

    this.promise = new AbortPromise<ModifiedData>(async (resolve, reject) => {
      try {
        const result = await this.request

        if (typeof onSuccess === 'function') {
          return resolve(onSuccess(result) as ModifiedData)
        }

        return resolve(result as ModifiedData)
      }
      catch (error) {
        if (typeof onError === 'function') {
          // ATTN use resolve because onError can return a promise
          return resolve(onError(error) as ModifiedData)
        }

        return reject(error)
      }
    }, this.abort.bind(this))
  }

  then(onSuccess: FirstCallback<ModifiedData>, onError?: FirstCallback<ModifiedData>) {
    return this.promise.then(onSuccess, onError)
  }

  catch(callback: FirstCallback<ModifiedData>) {
    return this.promise.catch(callback)
  }

  finally(callback: EmptyCallback) {
    return this.promise.catch(callback)
  }

  abort() {
    this.isAborted = true

    const count = requestsQueue[this.body]?.count || 0

    if (count > 1) {
      (requestsQueue[this.body] as PendingRequest).count -= 1
    }
    else {
      requestsQueue[this.body] = undefined
      this.controller.abort()
    }
  }
}


export default AbortRequest
