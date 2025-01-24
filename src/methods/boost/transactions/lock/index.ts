import lockGas from './lockGas'
import lockEncode from './lockEncode'
import type { Lock } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'


const lock: Lock = async (values) => {
  const { provider, userAddress } = values

  const { safeWalletData, multicallArgs } = await commonLogic(values)

  if (safeWalletData) {
    const signer = await provider.getSigner(userAddress)
    const signedContract = safeWalletData.contract.connect(signer)

    const { hash } = await signedContract.approve(...safeWalletData.approveArgs)

    await provider.waitForTransaction(hash)
  }

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

lock.encode = lockEncode
lock.estimateGas = lockGas


export default lock
