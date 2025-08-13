import vault from './vault'
import boost from './boost'
import osToken from './osToken'
import * as utils from './utils'
import rewardSplitter from './rewardSplitter'
import distributorRewards from './distributorRewards'


type Methods = (
  typeof utils

  | typeof vault.requests
  | typeof vault.transactions

  | typeof boost.requests
  | typeof boost.transactions

  | typeof osToken.requests
  | typeof osToken.transactions

  | typeof rewardSplitter.requests
  | typeof rewardSplitter.transactions

  | typeof distributorRewards.requests
  | typeof distributorRewards.transactions
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

type WithEstimateGas<M extends UnknownMethod> = WithEncode<M> & {
  estimateGas: (...values: CheckArgs<Omit<Parameters<NonNullable<M['estimateGas']>>[0], 'options' | 'contracts' | 'provider'>>) => (
    ReturnType<NonNullable<M['estimateGas']>>
  )
}

type ModifiedMethod<M extends UnknownMethod> = 'encode' extends keyof M
  ? 'estimateGas' extends keyof M
    ? WithEstimateGas<M>
    : WithEncode<M>
  : WithoutEncode<M>

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
  }),
  createBoostMethods: (params: CommonParams) => ({
    ...createMethods<typeof boost.requests>(boost.requests, params),
    ...createMethods<typeof boost.transactions>(boost.transactions, params),
  }),
  createOsTokenMethods: (params: CommonParams) => ({
    ...createMethods<typeof osToken.requests>(osToken.requests, params),
    ...createMethods<typeof osToken.transactions>(osToken.transactions, params),
  }),
  createRewardSplitterMethods: (params: CommonParams) => ({
    ...createMethods<typeof rewardSplitter.requests>(rewardSplitter.requests, params),
    ...createMethods<typeof rewardSplitter.transactions>(rewardSplitter.transactions, params),
  }),
  createDistributorRewardsMethods: (params: CommonParams) => ({
    ...createMethods<typeof distributorRewards.requests>(distributorRewards.requests, params),
    ...createMethods<typeof distributorRewards.transactions>(distributorRewards.transactions, params),
  }),
}


export default methods
