import { commonLogic } from './common'
import type { LockInput } from './types'
import { getGas } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'


const lockGas = async (values: LockInput) => {
  const { provider, userAddress } = values

  const { multiSigData, multicallArgs } = await commonLogic({ ...values, mockPermitSignature: true })

  const [ estimatedGasMulticall, estimatedGasApprove ] = await Promise.all([
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
  ])

  const estimatedGas = estimatedGasMulticall + estimatedGasApprove

  return getGas({ estimatedGas, provider })
}


export default lockGas
