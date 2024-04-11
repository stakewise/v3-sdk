import multicallGas from './multicallGas'
import multicallEncode from './multicallEncode'

import type { SetMetadataParams } from '../util/params/getMetadataParams'
import type { UpdateBlocklistParams } from '../util/params/getBlocklistParams'
import type { UpdateWhitelistParams } from '../util/params/getWhitelistParams'
import type { SetWhitelisterParams } from '../util/params/getWhitelisterParams'
import type { SetFeeRecipientParams } from '../util/params/getFeeRecipientParams'
import type { SetValidatorsRootParams } from '../util/params/getValidatorsRootParams'
import type { SetBlocklistManagerParams } from '../util/params/getBlocklistManagerParams'
import type { SetValidatorsManagerParams } from '../util/params/getValidatorsManagerParams'
import type { SetDepositDataManagerParams } from '../util/params/getDepositDataManagerParams'

type BaseInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
  provider: StakeWise.Provider
}

type MulticallParams = Partial<
  SetMetadataParams
  & SetWhitelisterParams
  & SetFeeRecipientParams
  & UpdateBlocklistParams
  & UpdateWhitelistParams
  & SetValidatorsRootParams
  & SetBlocklistManagerParams
  & SetValidatorsManagerParams
  & SetDepositDataManagerParams
>

export type MulticallInput = BaseInput & MulticallParams

export interface Multicall {
  (values: MulticallInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof multicallGas
  encode: typeof multicallEncode
}
