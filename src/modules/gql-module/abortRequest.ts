import AbortPromise from './abortPromise'


type ModifyCallback<Data, ModifiedData = Data> = (value: Data) => ModifiedData | PromiseLike<ModifiedData>

type FirstCallback<Data> = (value: Data) => Data | any

type EmptyCallback = () => void

type AbortRequestInit<Data, ModifiedData> = RequestInit & {
  onSuccess?: ModifyCallback<Data, ModifiedData>
  onError?: (error: any) => Promise<any> | AbortRequest<Data, ModifiedData>
}

type PendingRequest = {
  count: number
  promise: Promise<any>
}

const requestsQueue: Record<string, PendingRequest | undefined> = {}

const dummyPromise = new Promise(() => {})

// Returns fetch promise that can be aborted
// If we create several promises, only one request will be executed
class AbortRequest<Data, ModifiedData = Data> {
  private controller = new AbortController()
  request: Promise<Data>
  promise: AbortPromise<ModifiedData>
  body: string
  isAborted: boolean
  requestId: string

  constructor(url: RequestInfo | URL, abortRequestInit: AbortRequestInit<Data, ModifiedData>) {
    const { onSuccess, onError, ...init } = abortRequestInit

    this.body = init.body as string
    this.isAborted = false

    this.requestId = `${url}_${this.body}`
    const pendingRequest = requestsQueue[this.requestId]

    if (pendingRequest) {
      pendingRequest.count += 1
      this.request = pendingRequest.promise
    }
    else {
      this.request = fetch(url, {
        ...init,
        signal: this.controller.signal,
      })
        .then((response) => {
          if (response.ok) {
            return response.json()
          }

          return response.json().then((json) => Promise.reject(json))
        })
        .then((json) => {
          requestsQueue[this.requestId] = undefined

          if (json?.errors) {
            throw new Error(json.errors[0].message)
          }

          // Subgraph encountered indexing errors at some past block
          if (json?.data?._meta?.hasIndexingErrors) {
            throw new Error('Subgraph indexing error')
          }

          return (json?.data || json) as Data
        })
        .catch((error) => {
          if (!this.isAborted) {
            requestsQueue[this.requestId] = undefined

            if (typeof onError === 'function') {
              onError(error)
            }

            return Promise.reject(error)
          }

          return dummyPromise as Data
        })

      requestsQueue[this.requestId] = {
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
    return this.promise.finally(callback)
  }

  abort() {
    this.isAborted = true

    const count = requestsQueue[this.requestId]?.count || 0

    if (count > 1) {
      (requestsQueue[this.requestId] as PendingRequest).count -= 1
    }
    else {
      requestsQueue[this.requestId] = undefined
      this.controller.abort('aborted')
    }
  }
}


export default AbortRequest
