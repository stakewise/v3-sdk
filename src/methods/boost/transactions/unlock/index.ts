import unlockGas from './unlockGas'
import type { Unlock } from './types'
import { commonLogic } from './common'
import unlockEncode from './unlockEncode'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategy from '../upgradeLeverageStrategy'


const unlock: Unlock = async (values) => {
  const { isUpgradeRequired, ...multicallArgs } = await commonLogic(values)

  if (isUpgradeRequired) {
    await upgradeLeverageStrategy({ contracts, userAddress, vaultAddress })
  }

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}

unlock.encode = unlockEncode
unlock.estimateGas = unlockGas


export default unlock
