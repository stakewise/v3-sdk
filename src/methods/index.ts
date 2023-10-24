import vault from './vault'
import * as utils from './utils'
import * as osToken from './osToken'


type Methods = typeof utils | typeof osToken | typeof vault.requests | typeof vault.transactions

type CommonParams = {
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

type CheckArgs<Obj extends Record<PropertyKey, unknown>> = [ keyof Obj ] extends [ never ] ? [] : [ Obj ]

type ModifyMethods<T extends Record<string, any>> = {
  [K in keyof T]: (...values: CheckArgs<Omit<Parameters<T[K]>[0], 'options' | 'contracts' | 'provider'>>) => ReturnType<T[K]>
}

type CreateMethodsOutput<T extends Methods> = ModifyMethods<T>

const createMethods = <T extends Methods>(methods: T, params: CommonParams): CreateMethodsOutput<T> => (
  Object.keys(methods).reduce((acc, method) => {
    const fn = methods[method as keyof typeof methods] as (values: unknown) => unknown

    return {
      ...acc,
      [method]: (values: unknown) => fn({ ...(values || {}), ...params }),
    }
  }, {} as CreateMethodsOutput<T>)
)


const methods = {
  createUtils: (params: CommonParams) => createMethods<typeof utils>(utils, params),
  createVaultMethods: (params: CommonParams) => ({
    ...createMethods<typeof vault.requests>(vault.requests, params),
    ...createMethods<typeof vault.transactions>(vault.transactions, params),
  }),
  createOsTokenMethods: (params: CommonParams) => createMethods<typeof osToken>(osToken, params),
}


export default methods
