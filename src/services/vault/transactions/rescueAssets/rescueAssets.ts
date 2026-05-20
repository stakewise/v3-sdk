import { commonLogic } from './common'
import { checkAccess } from '../util'
import type { RescueAssetsInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const rescueAssets = checkAccess<RescueAssetsInput>(async (values) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
})


export default rescueAssets
