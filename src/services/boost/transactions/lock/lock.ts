import { commonLogic } from './common'
import type { LockInput } from './types'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategy from '../upgradeLeverageStrategy/upgradeLeverageStrategy'


const lock = async (values: LockInput) => {
  const { provider, userAddress } = values

  const { multiSigData, multicallArgs, isUpgradeRequired } = await commonLogic(values)

  if (isUpgradeRequired) {
    await upgradeLeverageStrategy(values)
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


export default lock
