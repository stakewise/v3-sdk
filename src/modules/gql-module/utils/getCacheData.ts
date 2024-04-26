import getCacheKey from './getCacheKey'


const getCacheData = <Data, Variables>(options: ModuleGQL.GetCacheDataInput<Data, Variables>): Data | undefined => {
  const { cache, variables, cacheId } = options

  const cacheRequests = cache.getData()
  const cacheKey = getCacheKey<Variables>({ variables, cacheId })
  const cacheRequest = cacheRequests?.[cacheKey]

  return cacheRequest
}


export default getCacheData
