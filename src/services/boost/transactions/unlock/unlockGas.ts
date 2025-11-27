import { commonLogic } from './common'
import type { UnlockInput } from './types'
import { getGas } from '../../../../helpers'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategyGas from '../upgradeLeverageStrategy/upgradeLeverageStrategyGas'


const unlockGas = async (values: UnlockInput) => {
  const { provider } = values

  const { isUpgradeRequired, ...multicallArgs } = await commonLogic(values)

  const [ multicallGas, gas ] = await Promise.all([
    boostMulticall<bigint>({
      ...multicallArgs,
      request: {
        ...multicallArgs.request,
        estimateGas: true,
      },
    }),
    isUpgradeRequired
      ? upgradeLeverageStrategyGas(values)
      : Promise.resolve(0n),
  ])

  const estimatedGas = multicallGas + gas

  return getGas({ estimatedGas, provider })
}


export default unlockGas
