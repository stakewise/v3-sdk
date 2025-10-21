import multicallGas from './multicallGas'
import multicallEncode from './multicallEncode'

import type { SetAdminParams } from '../util/params/getAdminParams'
import type { UploadMetadataInput } from '../util/metadata/uploadMetadata'
import type { SetMetadataParams } from '../util/params/getMetadataParams'
import type { SetFeePercentParams } from '../util/params/getFeePercentParams'
import type { UpdateBlocklistParams } from '../util/params/getBlocklistParams'
import type { UpdateWhitelistParams } from '../util/params/getWhitelistParams'
import type { SetWhitelisterParams } from '../util/params/getWhitelisterParams'
import type { SetFeeRecipientParams } from '../util/params/getFeeRecipientParams'
import type { SetBlocklistManagerParams } from '../util/params/getBlocklistManagerParams'
import type { SetValidatorsManagerParams } from '../util/params/getValidatorsManagerParams'

type BaseInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
  provider: StakeWise.Provider
}

type MulticallCommonParams =
  SetWhitelisterParams
  & SetAdminParams
  & SetFeePercentParams
  & SetFeeRecipientParams
  & UpdateBlocklistParams
  & UpdateWhitelistParams
  & SetBlocklistManagerParams
  & SetValidatorsManagerParams

type MulticallParams = Partial<
  UploadMetadataInput
  & MulticallCommonParams
>

type MulticallTransactionParams = Partial<
  SetMetadataParams
  & UploadMetadataInput
  & MulticallCommonParams
>

export type MulticallTransactionInput = BaseInput & MulticallTransactionParams

export type MulticallInput = BaseInput & MulticallParams

export interface Multicall {
  (values: MulticallInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof multicallGas
  encode: typeof multicallEncode
}
