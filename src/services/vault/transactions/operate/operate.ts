import { commonLogic } from './common'
import checkAccess from './checkAccess'
import { uploadMetadata } from '../util'
import type { OperateInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const operate = checkAccess<string>(async (values: OperateInput) => {
  const { image, displayName, description, ...rest } = values
  const { options } = rest

  const metadataIpfsHash = await uploadMetadata({ image, displayName, description, options })
  const multicallCommonArgs = await commonLogic({ metadataIpfsHash, ...rest })

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
})


export default operate
