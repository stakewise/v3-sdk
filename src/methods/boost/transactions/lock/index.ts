import lockGas from './lockGas'
import lockEncode from './lockEncode'
import type { Lock } from './types'
import { commonLogic } from './common'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategy from '../upgradeLeverageStrategy'


const lock: Lock = async (values) => {
  const { contracts, provider, userAddress, vaultAddress } = values

  const { multiSigData, multicallArgs, isUpgradeRequired } = await commonLogic(values)

  if (isUpgradeRequired) {
    await upgradeLeverageStrategy({ contracts, userAddress, vaultAddress })
  }

  if (multiSigData) {
    const signer = await provider.getSigner(userAddress)
    const signedContract = multiSigData.contract.connect(signer)

    const { hash } = await signedContract.approve(...multiSigData.approveArgs)

    await provider.waitForTransaction(hash)
  }

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

lock.encode = lockEncode
lock.estimateGas = lockGas


export default lock
