import { commonLogic } from './common'
import type { LockInput } from './types'
import { getGas } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'
import upgradeLeverageStrategyGas from '../upgradeLeverageStrategy/upgradeLeverageStrategyGas'


const lockGas = async (values: LockInput) => {
  const { provider, userAddress } = values

  const { multiSigData, multicallArgs, isUpgradeRequired } = await commonLogic({
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
    multiSigData
      ? multiSigData.contract.approve.estimateGas(...multiSigData.approveArgs, {
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
