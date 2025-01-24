import { commonLogic } from './common'
import type { LockInput } from './types'
import { getGas } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'


const lockGas = async (values: LockInput) => {
  const { provider, userAddress } = values

  const { safeWalletData, multicallArgs } = await commonLogic({ ...values, mockPermitSignature: true })

  const [ estimatedGasMulticall, estimatedGasApprove ] = await Promise.all([
    boostMulticall<bigint>({
      ...multicallArgs,
      request: {
        ...multicallArgs.request,
        estimateGas: true,
      },
    }),
    safeWalletData
      ? safeWalletData.contract.approve.estimateGas(...safeWalletData.approveArgs, {
        from: userAddress,
      })
      : Promise.resolve(0n),
  ])

  const estimatedGas = estimatedGasMulticall + estimatedGasApprove

  return getGas({ estimatedGas, provider })
}


export default lockGas
