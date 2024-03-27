import setMetadataGas from './setMetadataGas'
import setMetadataEncode from './setMetadataEncode'
import { BaseInput } from '../../utils'


export type SetMetadataInput = BaseInput & {
  metadataIpfsHash: string
}

export interface SetMetadata {
  (values: SetMetadataInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof setMetadataGas
  encode: typeof setMetadataEncode
}
