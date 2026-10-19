import { commonLogic } from './common'
import type { LockInput } from './types'
import { getGas } from '../../../../helpers'
import { boostMulticall } from '../../../../contracts'


const lockGas = async (values: LockInput) => {
  const { provider, contracts, userAddress, vaultAddress } = values

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
      ? contracts.special.leverageStrategy.upgradeProxy.estimateGas(vaultAddress, { from: userAddress })
      : Promise.resolve(0n),
  ])

  const estimatedGas = multicallGas + approveGas + leverageStrategyUpgradeGas

  return getGas({ estimatedGas, provider })
}


export default lockGas
