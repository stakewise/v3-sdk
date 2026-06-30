import { commonLogic } from './common'
import type { LockInput } from './types'
import { wrapErrorHandler } from '../../../../helpers'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategy from '../upgradeLeverageStrategy/upgradeLeverageStrategy'


const lock = async (values: LockInput) => {
  const { provider, userAddress } = values

  const { approveData, multicallArgs, isUpgradeRequired } = await commonLogic(values)

  if (isUpgradeRequired) {
    await upgradeLeverageStrategy(values)
  }

  if (approveData) {
    const signer = await provider.getSigner(userAddress)
    const signedContract = approveData.contract.connect(signer)

    const { hash } = await wrapErrorHandler(
      signedContract.approve(...approveData.approveArgs),
      'transaction'
    )

    await provider.waitForTransaction(hash)
  }

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default lock
