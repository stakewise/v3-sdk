import vault from './vault'
import * as utils from './utils'
import * as osToken from './osToken'


type Methods = (
  typeof utils
  | typeof osToken
  | typeof vault.requests
  | typeof vault.transactions
)

interface UnknownMethod {
  (values: unknown): unknown
  encode?: (values: any) => any
}

type CheckArgs<Obj extends Record<PropertyKey, unknown>> = [ keyof Obj ] extends [ never ] ? [] : [ Obj ]

type WithoutEncode<M extends UnknownMethod> = (
  (...values: CheckArgs<Omit<Parameters<M>[0], 'options' | 'contracts' | 'provider'>>) => ReturnType<M>
)

type WithEncode<M extends UnknownMethod> = WithoutEncode<M> & {
  encode: (...values: CheckArgs<Omit<Parameters<NonNullable<M['encode']>>[0], 'options' | 'contracts' | 'provider'>>) => (
    ReturnType<NonNullable<M['encode']>>
  )
}

type ModifiedMethod<M extends UnknownMethod> = 'encode' extends keyof M ? WithEncode<M> : WithoutEncode<M>;

type CommonParams = {
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

type ModifyMethods<T extends Record<string, any>> = {
  [K in keyof T]: ModifiedMethod<T[K]>
}

type CreateMethodsOutput<T extends Methods> = ModifyMethods<T>

const createMethods = <T extends Methods>(methods: T, params: CommonParams): CreateMethodsOutput<T> => (
  Object.keys(methods).reduce((acc, method) => {
    const fn = methods[method as keyof typeof methods] as UnknownMethod

    const wrapper = (values: unknown) => fn({ ...(values || {}), ...params })

    if (typeof fn.encode === 'function') {
      wrapper.encode = (values: unknown) => {
        return (fn.encode as NonNullable<UnknownMethod['encode']>)({ ...(values || {}), ...params })
      }
    }

    return {
      ...acc,
      [method]: wrapper,
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
