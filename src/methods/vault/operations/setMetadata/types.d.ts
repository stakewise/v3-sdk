import setMetadataGas from './setMetadataGas'
import setMetadataEncode from './setMetadataEncode'
import type { BaseInput } from '../../utils'


export type SetMetadataParams = {
  metadataIpfsHash: string
}

export type SetMetadataInput = BaseInput & SetMetadataParams

export interface SetMetadata {
  (values: SetMetadataInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setMetadataGas
  encode: typeof setMetadataEncode
}
