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

type BaseInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
}

type OperateCommonParams =
  SetWhitelisterParams
  & SetAdminParams
  & SetFeePercentParams
  & SetFeeRecipientParams
  & UpdateBlocklistParams
  & UpdateWhitelistParams
  & SetBlocklistManagerParams
  & SetValidatorsManagerParams

type OperateParams = Partial<
  UploadMetadataInput
  & OperateCommonParams
>

type OperateTransactionParams = Partial<
  SetMetadataParams
  & UploadMetadataInput
  & OperateCommonParams
>

export type OperateTransactionInput = BaseInput & OperateTransactionParams

export type OperateInput = BaseInput & OperateParams

export interface ExtractOperate {
  (values: StakeWise.ExtractInput<OperateInput>): Promise<StakeWise.TransactionHash>
  estimateGas: (values: StakeWise.ExtractInput<OperateInput>) => Promise<bigint>
  encode: (values: StakeWise.ExtractInput<OperateInput>) => Promise<StakeWise.TransactionData>
}
