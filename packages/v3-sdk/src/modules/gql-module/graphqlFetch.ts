import AbortRequest from './abortRequest'


const getCacheKey = <Variables>(variables?: Variables) => {
  const sortedVariables = Object.keys(variables || {})
    .sort((a, b) => {
      if ([ a, b ].includes('skip')) {
        return a === 'skip' ? 1 : -1
      }

      return a > b ? 1 : -1
    })
    .reduce((acc, key) => {
      acc[key] = variables?.[key as keyof typeof variables]

      return acc
    }, {} as Record<string, any>)

  return JSON.stringify(sortedVariables)
}

const getMethodName = <T>(cacheData: T) => {
  return Object.keys(cacheData as Record<string, any>)?.[0] || ''
}

const getCacheData = <Data, Variables>(options: ModuleGQL.GetCacheDataInput<Data, Variables>): Data | undefined => {
  const { cache, variables } = options

  // @ts-ignore
  const skip = variables?.skip

  const cacheRequests = cache.getData()
  const cacheKey = getCacheKey<Variables>(variables)
  const cacheRequest = cacheRequests?.[cacheKey]

  if (skip && cacheRequest) {
    const methodName = getMethodName<Data>(cacheRequest)
    const cacheItems = cacheRequest?.[methodName as keyof typeof cacheRequest]

    if (Array.isArray(cacheItems)) {
      const skipRegExp = /(.*)"skip":(\d+)}$/

      const keyTemplate = cacheKey.replace(skipRegExp, '$1"skip":')
      const skipRequests = Object.keys(cacheRequests)
        .filter((key) => key.startsWith(keyTemplate))
        .sort((a, b) => {
          const skipA = Number(a.replace(skipRegExp, '$2'))
          const skipB = Number(b.replace(skipRegExp, '$2'))

          return skipA > skipB ? 1 : -1
        })

      const filteredCacheItems = skipRequests
        // @ts-ignore
        .map((cacheKey) => cacheRequests[cacheKey][methodName])
        .reduce((acc, cacheData) => acc.concat(cacheData), [])

      return {
        [methodName]: filteredCacheItems,
      } as Data
    }
  }

  return cacheRequest
}

const setCacheData = <Data, Variables>(options: ModuleGQL.SetCacheDataInput<Data, Variables>): Data => {
  const { data, cache, variables } = options

  const cacheKey = getCacheKey<Variables>(variables)

  cache.setData((cacheData) => ({
    ...cacheData,
    [cacheKey]: data,
  }))

  return getCacheData({ cache, variables }) as Data
}

// eslint-disable-next-line max-len
const graphqlFetch = <Data, Variables, ModifiedData>(options: ModuleGQL.FetchInput<Data, Variables, ModifiedData>): AbortRequest<Data, ModifiedData> => {
  const {
    url, query, variables,
    cache, requestPolicy = 'cache-first',
    modifyResult,
  } = options

  const operationName = query
    .replace(/^(query|mutation)\s/, '')
    .replace(/[({].*/, '')
    .trim()

  const opName = operationName ? `?opName=${operationName}` : ''
  const requestUrl = `${url}${opName}`

  const isSkipCacheSet = requestPolicy === 'no-cache'
  const isSkipCacheCheck = isSkipCacheSet || requestPolicy === 'network-only'
  const cacheData = getCacheData<Data, Variables>({ cache, variables })
  const withModify = typeof modifyResult === 'function'

  const handleRequest = () => (
    new AbortRequest<Data, ModifiedData>(requestUrl, {
      method: 'POST',
      headers: {
        'content-type': 'application/json; charset=utf-8',
      },
      body: JSON.stringify({
        query,
        variables,
        operationName,
      }),
      onSuccess: (data: Data) => {
        if (isSkipCacheSet) {
          return withModify
            ? modifyResult(data)
            // @ts-ignore
            : data as ModifiedData
        }

        const cacheData = setCacheData<Data, Variables>({
          data: data as Data,
          cache,
          variables,
        })

        return withModify
          ? modifyResult(cacheData)
          // @ts-ignore
          : cacheData as ModifiedData
      },
    })
  )

  if (cacheData && !isSkipCacheCheck) {
    if (requestPolicy === 'cache-and-network') {
      handleRequest()
    }

    const result = withModify ? modifyResult(cacheData) : cacheData

    // @ts-ignore
    return Promise.resolve(result) as Promise<ModifiedData>
  }

  return handleRequest()
}


export {
  graphqlFetch,
  getCacheData,
  setCacheData,
  getCacheKey,
}
