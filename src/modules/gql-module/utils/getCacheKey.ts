type CacheKey<T> = { cacheId: string | undefined, variables: T | undefined }

const getCacheKey = <Variables>(values: CacheKey<Variables>) => {
  const { variables, cacheId } = values || {}

  const sortedVariables = Object.keys(variables || {})
    .sort()
    .reduce((acc, key) => {
      acc[key] = variables?.[key as keyof typeof variables]

      return acc
    }, {} as Record<string, any>)

  return JSON.stringify({ variables: sortedVariables, cacheId })
}


export default getCacheKey
