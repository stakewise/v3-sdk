import { commonLogic } from './common'
import checkAccess from './checkAccess'
import type { Multicall } from './types'
import multicallGas from './multicallGas'
import multicallEncode from './multicallEncode'
import { vaultMulticall } from '../../../../contracts'
import { uploadMetadata } from '../util'


const operate: Multicall = checkAccess<string>(async (values) => {
  const { image, displayName, description, ...rest } = values
  const { options } = rest

  const metadataIpfsHash = await uploadMetadata({ image, displayName, description, options })
  const multicallCommonArgs = await commonLogic({ metadataIpfsHash, ...rest })

  const result = await vaultMulticall<{ hash: string }>(multicallCommonArgs)

  return result.hash
}) as Multicall

operate.encode = checkAccess<StakeWise.TransactionData>(multicallEncode)
operate.estimateGas = checkAccess<bigint>(multicallGas)


export default operate
