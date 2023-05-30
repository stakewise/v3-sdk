declare namespace ModuleGQL {

  // cache-first: default, first fetch data and store it in the cache, next requests will return data from cache
  // cache-and-network: same as cache-first, but on subsequent requests after returning data will make request and update cache
  // network-only: skip cache check, make request and update cache
  // no-cache: skip cache check, make request and don't update cache
  type RequestPolicy = 'cache-first' | 'cache-and-network' | 'network-only' | 'no-cache'

  type GetCacheDataInput<Data, Variables> = {
    cache: CacheStorage.Cache<Record<string, Data>>
    variables?: Variables
  }

  type SetCacheDataInput<Data, Variables> = GetCacheDataInput<Data, Variables> & {
    data: Data
  }

  type FetchInput<Data, Variables, ModifiedData> = {
    url: string
    cache: CacheStorage.Cache<Record<string, Data>>
    query: string
    variables?: Variables
    requestPolicy?: RequestPolicy
    modifyResult?: (data: Data) => ModifiedData
  }

  type FetchCodegenInput<Data, Variables, ModifiedData> = {
    url: string
    variables?: Variables
    requestPolicy?: RequestPolicy
    modifyResult?: (data: Data) => ModifiedData
  }

  type UseQueryInput<Data, Variables, ModifiedData> = {
    clientName: ClientGQL
    cache: CacheStorage.Cache<Record<string, Data>>
    query: string
    pause?: boolean
    variables?: Variables
    modifyResult: (data: Data) => ModifiedData
  }

  type UseQueryCodegenInput<Data, Variables, ModifiedData> = {
    variables?: Variables
    pause?: boolean
    modifyResult?: (data: Data) => ModifiedData
  }

  type UseQueryOutput<Data> = {
    data: Data | null
    isFetching: boolean
    executeQuery: (requestPolicy?: RequestPolicy) => void
  }

  type UseQueryState<Data> = {
    data: Data | null
    error: string | null
    isFetching: boolean
    forceRequest:
      | null
      | {
        count: number
        requestPolicy: RequestPolicy
      }
  }

  type UseMutationInput<Variables> = {
    clientName: ClientGQL
    query: string
  }

  type UseMutationState<Data> = {
    data: Data | null
    errors: any
    isSubmitting: boolean
  }

  type UseMutationOutput<Data, Variables> = {
    data: Data | null
    errors: any
    isSubmitting: boolean
    submit: (variables?: Variables) => Promise<Data | void>
  }
}
