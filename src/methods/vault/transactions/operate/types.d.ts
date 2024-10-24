import multicallGas from './multicallGas'
import multicallEncode from './multicallEncode'

import type { UploadMetadataInput } from '../util/metadata/uploadMetadata'
import type { SetMetadataParams } from '../util/params/getMetadataParams'
import type { UpdateBlocklistParams } from '../util/params/getBlocklistParams'
import type { UpdateWhitelistParams } from '../util/params/getWhitelistParams'
import type { SetWhitelisterParams } from '../util/params/getWhitelisterParams'
import type { SetFeeRecipientParams } from '../util/params/getFeeRecipientParams'
import type { SetBlocklistManagerParams } from '../util/params/getBlocklistManagerParams'
import type { SetValidatorsManagerParams } from '../util/params/getValidatorsManagerParams'
import type { SetRestakeOperatorsManagerParams } from '../util/params/getRestakeOperatorsManagerParams'
import type { SetRestakeWithdrawalsManagerParams } from '../util/params/getRestakeWithdrawalsManagerParams'

type BaseInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
  provider: StakeWise.Provider
}

type MulticallCommonParams =
  SetWhitelisterParams
  & SetFeeRecipientParams
  & UpdateBlocklistParams
  & UpdateWhitelistParams
  & SetBlocklistManagerParams
  & SetValidatorsManagerParams
  & SetRestakeOperatorsManagerParams
  & SetRestakeWithdrawalsManagerParams

type MulticallParams = Partial<
  UploadMetadataInput
  & MulticallCommonParams
>

type MulticallTransactionParams = Partial<
  SetMetadataParams
  & MulticallCommonParams
>

export type MulticallTransactionInput = BaseInput & MulticallTransactionParams

export type MulticallInput = BaseInput & MulticallParams

export interface Multicall {
  (values: MulticallInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof multicallGas
  encode: typeof multicallEncode
}
