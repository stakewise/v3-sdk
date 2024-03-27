import checkAccess from './checkAccess'
import { commonLogic } from './common'
import setMetadataGas from './setMetadataGas'
import setMetadataEncode from './setMetadataEncode'
import { vaultMulticall } from '../../../../contracts'
import type { SetMetadata } from './types'


const setMetadata: SetMetadata = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

setMetadata.encode = checkAccess<StakeWise.TransactionData>(setMetadataEncode)
setMetadata.estimateGas = checkAccess<bigint>(setMetadataGas)


export default checkAccess<string>(setMetadata)
