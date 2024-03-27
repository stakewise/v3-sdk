import vault from './vault'
import osToken from './osToken'
import * as utils from './utils'


type Methods = (
  typeof utils

  | typeof vault.requests
  | typeof vault.operations
  | typeof vault.transactions

  | typeof osToken.requests
  | typeof osToken.transactions
)

interface UnknownMethod {
  (values: unknown): unknown
  encode?: (values: unknown) => unknown
  estimateGas?: (values: unknown) => unknown
}

type CheckArgs<Obj extends Record<PropertyKey, unknown>> = [keyof Obj] extends [never] ? [] : [Obj]

type WithoutEncode<M extends UnknownMethod> = (
  (...values: CheckArgs<Omit<Parameters<M>[0], 'options' | 'contracts' | 'provider'>>) => ReturnType<M>
)

type WithEncode<M extends UnknownMethod> = WithoutEncode<M> & {
  encode: (...values: CheckArgs<Omit<Parameters<NonNullable<M['encode']>>[0], 'options' | 'contracts' | 'provider'>>) => (
    ReturnType<NonNullable<M['encode']>>
  )
}

type WithEstimateGas<M extends UnknownMethod> = WithoutEncode<M> & {
  estimateGas: (...values: CheckArgs<Omit<Parameters<NonNullable<M['estimateGas']>>[0], 'options' | 'contracts' | 'provider'>>) => (
    ReturnType<NonNullable<M['estimateGas']>>
  )
}

type ModifiedMethod<M extends UnknownMethod> = 'encode' extends keyof M
  ? 'estimateGas' extends keyof M
    ? WithEstimateGas<M>
    : WithoutEncode<M>
  : WithEncode<M>

type CommonParams = {
  options: StakeWise.Options
  provider: StakeWise.Provider
  contracts: StakeWise.Contracts
}

type ModifyMethods<T extends Record<string, any>> = {
  [K in keyof T]: ModifiedMethod<T[K]>
}

type CreateMethodsOutput<T extends Methods> = ModifyMethods<T>

const generateSubMethods = (fn: UnknownMethod, wrapper: UnknownMethod, params: CommonParams) => {
  const submethods = [ 'encode', 'estimateGas' ] as const

  submethods.forEach((submethod) => {
    if (typeof fn[submethod] === 'function') {
      wrapper[submethod] = (values: unknown) => {
        return (fn[submethod] as NonNullable<UnknownMethod['encode']>)({ ...(values || {}), ...params })
      }
    }
  })
}

const createMethods = <T extends Methods>(methods: T, params: CommonParams): CreateMethodsOutput<T> => (
  Object.keys(methods).reduce((acc, method) => {
    const fn = methods[method as keyof typeof methods] as UnknownMethod

    const wrapper = (values: unknown) => fn({ ...(values || {}), ...params })

    generateSubMethods(fn, wrapper, params)

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
    operate: createMethods<typeof vault.operations>(vault.operations, params),
  }),
  createOsTokenMethods: (params: CommonParams) => ({
    ...createMethods<typeof osToken.requests>(osToken.requests, params),
    ...createMethods<typeof osToken.transactions>(osToken.transactions, params),
  }),
}


export default methods
