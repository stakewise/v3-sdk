import './types/global'
import { constants } from './helpers'


export * from './helpers/enums'
export { default as StakeWiseSDK } from './StakeWiseSDK'
export { createContract, createErc20Contract } from './contracts'
export { default as localStorage } from './modules/local-storage'
export { wrapAbortPromise, AbortPromise, AbortRequest } from './modules/gql-module'

export {
  configs,
  BigDecimal,
  getGas,
  createProvider,
  mergeRewardsFiat,
  wrapErrorHandler,
  calculateUserStats,
} from './helpers'

export const chains = constants.chains
