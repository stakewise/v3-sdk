import { SetMetadata } from './types'
import { commonLogic } from './common'
import setMetadataGas from './setMetadataGas'
import setMetadataEncode from './setMetadataEncode'
import { vaultMulticall } from '../../../../contracts'


const setMetadata: SetMetadata = async (values) => {
  const multicallCommonArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}

setMetadata.encode = setMetadataEncode
setMetadata.estimateGas = setMetadataGas


export default setMetadata
