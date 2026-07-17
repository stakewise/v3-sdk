import { commonLogic } from './common'
import type { DepositAndMintInput } from '../types'
import { vaultMulticall } from '../../../../../contracts'


const depositAndMint = async (values: DepositAndMintInput) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default depositAndMint
