import setFeeRecipientGas from './setFeeRecipientGas'
import setMetadataEncode from './setMetadataEncode'
import type { BaseInput } from '../../utils'


export type SetFeeRecipientParams = {
  feeRecipient: string
}

export type SetFeeRecipientInput = BaseInput & SetFeeRecipientParams

export interface SetMetadata {
  (values: SetFeeRecipientInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setFeeRecipientGas
  encode: typeof setMetadataEncode
}
