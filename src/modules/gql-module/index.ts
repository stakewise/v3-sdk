export { default as graphqlFetch } from './graphqlFetch'
export { default as AbortPromise } from './abortPromise'
export { default as AbortRequest } from './abortRequest'
export { default as AbortCallback } from './abortCallback'
export type { FetchCodegenInput, FetchInput } from './types'
export { default as wrapAbortPromise } from './wrapAbortPromise'

export type Cancellable<T = any> = {
  then: (onSuccess: (value: T) => any, onError?: (error: any) => any) => any
  catch: (callback: (error: any) => any) => any
  finally: (callback: () => void) => any
  abort: () => void
}


export type AssertCancellable<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => infer R
    ? [R] extends [Promise<any>]
      ? [R] extends [Cancellable] ? T[K] : never
      : T[K]
    : T[K]
}
