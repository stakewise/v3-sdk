import getRolesList from './getRolesList'
import { commonLogic } from './common'
import { vaultMulticall } from '../../../../contracts'
import type { OperateInput } from './types'
import { checkAccess, uploadMetadata } from '../util'


const operate = checkAccess<OperateInput>(
  async (values: OperateInput) => {
    const { image, displayName, description, ...rest } = values

    const metadataIpfsHash = await uploadMetadata(values)
    const multicallCommonArgs = await commonLogic({ metadataIpfsHash, ...rest })

    const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

    return result.hash
  },
  getRolesList
)


export default operate
