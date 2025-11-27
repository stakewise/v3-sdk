import { commonLogic } from './common'
import type { UnlockInput } from './types'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategy from '../upgradeLeverageStrategy/upgradeLeverageStrategy'


const unlock = async (values: UnlockInput) => {
  const { isUpgradeRequired, ...multicallArgs } = await commonLogic(values)

  if (isUpgradeRequired) {
    await upgradeLeverageStrategy(values)
  }

  const result = await boostMulticall<{ hash: string }>(multicallArgs)

  return result.hash
}


export default unlock
