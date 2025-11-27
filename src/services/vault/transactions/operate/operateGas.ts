import Utils from '../../../utils'
import { commonLogic } from './common'
import type { OperateInput } from './types'
import { getMetadataHashMock } from '../util'


const operateGas = async (values: OperateInput) => {
  const { image, displayName, description, ...rest } = values

  const utils = new Utils(values)
  const metadataIpfsHash = getMetadataHashMock({ image, displayName, description })
  const multicallArgs = await commonLogic({ metadataIpfsHash, ...rest })

  return utils.getVaultMulticallGas(multicallArgs)
}


export default operateGas
