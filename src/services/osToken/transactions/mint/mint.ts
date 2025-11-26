import { commonLogic } from './common'
import type { MintInput } from './types'
import { vaultMulticall } from '../../../../contracts'


const mint = async (values: MintInput) => {
  const multicallArgs = commonLogic(values)

  const result = await vaultMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default mint
