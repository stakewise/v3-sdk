import multicallGas from './multicallGas'
import multicallEncode from './multicallEncode'
import type { BaseInput } from '../../utils'

import type { SetMetadataParams } from '../setMetadata'
import type { SetKeysManagerParams } from '../setKeysManager'
import type { SetWhitelisterParams } from '../setWhitelister'
import type { SetFeeRecipientParams } from '../setFeeRecipient'
import type { UpdateBlocklistParams } from '../updateBlocklist'
import type { UpdateWhitelistParams } from '../updateWhitelist'
import type { SetValidatorsRootParams } from '../setValidatorsRoot'
import type { SetBlocklistManagerParams } from '../setBlocklistManager'

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
