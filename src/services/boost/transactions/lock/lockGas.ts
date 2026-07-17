import { commonLogic } from './common'
import type { LockInput } from './types'
import { getGas } from '../../../../helpers'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategyGas from '../upgradeLeverageStrategy/upgradeLeverageStrategyGas'


const lockGas = async (values: LockInput) => {
  const { provider, userAddress } = values

  const { approveData, multicallArgs, isUpgradeRequired } = await commonLogic({
    ...values,
    mockPermitSignature: true,
  })

  const [ multicallGas, approveGas, leverageStrategyUpgradeGas ] = await Promise.all([
    boostMulticall<bigint>({
      ...multicallArgs,
      request: {
        ...multicallArgs.request,
        estimateGas: true,
      },
    }),
    approveData
      ? approveData.contract.approve.estimateGas(...approveData.approveArgs, {
        from: userAddress,
      })
      : Promise.resolve(0n),
    isUpgradeRequired
      ? upgradeLeverageStrategyGas(values)
      : Promise.resolve(0n),
  ])

  const estimatedGas = multicallGas + approveGas + leverageStrategyUpgradeGas

  return getGas({ estimatedGas, provider })
}


export default lockGas
