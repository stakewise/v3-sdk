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

type CreateMethodsOutput = ModifyRequests<Methods>

const createRequests = (methods: Methods, params: CreateMethodsParams): CreateMethodsOutput => (
  Object.keys(methods).reduce((acc, method) => {
    const fn = methods[method as keyof typeof methods] as (values: unknown) => unknown

    return {
      ...acc,
    [method]: (values: unknown) => fn({ ...(values || {}), ...params } as any),
    }
  }, {} as CreateMethodsOutput)
)


export default {
  createUtils: (params: CreateMethodsParams) => createRequests(utils, params),
  createVaultMethods: (params: CreateMethodsParams) => createRequests(vault, params),
  createOsTokenMethods: (params: CreateMethodsParams) => createRequests(osToken, params),
}
