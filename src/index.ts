import './types/global'
import { constants } from './helpers'


export * from './helpers/enums'
export { default as StakeWiseSDK } from './StakeWiseSDK'
export { default as localStorage } from './modules/local-storage'
export { createContract, createErc20Contract } from './contracts'
export { wrapAbortPromise, AbortPromise, AbortRequest, AbortCallback, applySubgraphErrorPolicy } from './modules/gql-module'
export type { SubgraphErrorEvent, SubgraphErrorPolicy } from './modules/gql-module'
export type { Position, PositionData, PositionApyData } from './services/vault/requests'

export {
  configs,
  BigDecimal,
  getGas,
  createProvider,
  mergeRewardsFiat,
  wrapErrorHandler,
  sendWithGasMargin,
  calculateUserStats,
  getDefaultHarvestParams,
} from './helpers'

export const chains = constants.chains
