import setFeeRecipientGas from './setFeeRecipientGas'
import setMetadataEncode from './setMetadataEncode'
import { BaseInput } from '../../utils'


export type SetFeeRecipientInput = BaseInput & {
  feeRecipient: string
}

export interface SetMetadata {
  (values: SetFeeRecipientInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setFeeRecipientGas
  encode: typeof setMetadataEncode
}
