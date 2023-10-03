import * as osToken from './osToken'
import * as vault from './vault'
import * as utils from './utils'


type Methods = typeof utils | typeof osToken | typeof vault

type CheckArgs<Obj extends Record<PropertyKey, unknown>> = [ keyof Obj ] extends [ never ] ? [] : [ Obj ]

type ModifyRequests<T extends Record<string, any>> = {
  [K in keyof T]: (...values: CheckArgs<Omit<Parameters<T[K]>[0], 'options' | 'contracts'>>) => ReturnType<T[K]>
}

type CreateMethodsParams = {
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

type CreateMethodsOutput<T extends Methods> = ModifyRequests<T>

const createRequests = <T extends Methods>(methods: T, params: CreateMethodsParams): CreateMethodsOutput<T> => (
  Object.keys(methods).reduce((acc, method) => {
    const fn = methods[method as keyof typeof methods] as (values: unknown) => unknown

    return {
      ...acc,
    [method]: (values: unknown) => fn({ ...(values || {}), ...params }),
    }
  }, {} as CreateMethodsOutput<T>)
)


const methods = {
  createUtils: (params: CreateMethodsParams) => createRequests<typeof utils>(utils, params),
  createVaultMethods: (params: CreateMethodsParams) => createRequests<typeof vault>(vault, params),
  createOsTokenMethods: (params: CreateMethodsParams) => createRequests<typeof osToken>(osToken, params),
}


export default methods
