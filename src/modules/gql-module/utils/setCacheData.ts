import getCacheData from './getCacheData'
import getCacheKey from './getCacheKey'


const setCacheData = <Data, Variables>(options: ModuleGQL.SetCacheDataInput<Data, Variables>): Data => {
  const { data, cache, variables, cacheId } = options

  const cacheKey = getCacheKey<Variables>({ variables, cacheId })

  cache.setData((cacheData) => ({
    ...cacheData,
    [cacheKey]: data,
  }))

  return getCacheData({ cache, variables, cacheId }) as Data
}


export default setCacheData
