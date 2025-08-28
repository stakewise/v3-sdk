import { commonLogic } from './common'
import type { UnlockInput } from './types'
import { getGas } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategy from '../upgradeLeverageStrategy'


const unlockGas = async (values: UnlockInput) => {
  const { provider } = values

  const { isUpgradeRequired, ...multicallArgs } = await commonLogic(values)

  const [ multicallGas, upgradeLeverageStrategyGas ] = await Promise.all([
    boostMulticall<bigint>({
      ...multicallArgs,
      request: {
        ...multicallArgs.request,
        estimateGas: true,
      },
    }),
    isUpgradeRequired
      ? upgradeLeverageStrategy.estimateGas(values)
      : Promise.resolve(0n)
  ])

  const estimatedGas = multicallGas + upgradeLeverageStrategyGas

  return getGas({ estimatedGas, provider })
}


export default unlockGas
