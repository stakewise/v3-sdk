import multicallGas from './multicallGas'
import multicallEncode from './multicallEncode'
import type { BaseInput } from '../../utils'

import type { SetMetadataParams } from '../setMetadata/types'
import type { SetKeysManagerParams } from '../setKeysManager/types'
import type { SetWhitelisterParams } from '../setWhitelister/types'
import type { SetFeeRecipientParams } from '../setFeeRecipient/types'
import type { UpdateBlocklistParams } from '../updateBlocklist/types'
import type { UpdateWhitelistParams } from '../updateWhitelist/types'
import type { SetValidatorsRootParams } from '../setValidatorsRoot/types'
import type { SetBlocklistManagerParams } from '../setBlocklistManager/types'

type MulticallParams = Partial<
  SetMetadataParams
  & SetKeysManagerParams
  & SetWhitelisterParams
  & SetFeeRecipientParams
  & UpdateBlocklistParams
  & UpdateWhitelistParams
  & SetValidatorsRootParams
  & SetBlocklistManagerParams
>

export type MulticallInput = BaseInput & MulticallParams

export interface Multicall {
  (values: MulticallInput): Promise<StakeWise.TransactionHash>
  estimateGas: typeof multicallGas
  encode: typeof multicallEncode
}
