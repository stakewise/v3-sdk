import { MaxUint256, ZeroAddress } from 'ethers'

import Utils from '../../../utils'
import type { LockInput } from './types'
import { validateArgs } from '../../../../helpers'
import { boostMulticall } from '../../../../contracts'
import getLeverageStrategyProxy from '../../requests/getLeverageStrategyProxy'
import { getLeverageStrategyContract, validateLeverageStrategyData } from '../../helpers'


type CommonLogicInput = LockInput & {
  mockPermitSignature?: boolean
}

export const commonLogic = async (values: CommonLogicInput) => {
  const {
    contracts, provider, amount, vaultAddress, userAddress, referrerAddress = ZeroAddress,
    mockPermitSignature, leverageStrategyData, useApprove,
  } = values

  validateArgs.bigint({ amount })
  validateArgs.address({ vaultAddress, userAddress, referrerAddress })

  if (leverageStrategyData) {
    validateLeverageStrategyData(leverageStrategyData)
  }

  const { leverageStrategyContract, isUpgradeRequired } = await getLeverageStrategyContract(values)

  const code = await provider.getCode(userAddress)
  const isEip7702Delegated = code.toLowerCase().startsWith('0xef0100')
  const isMultiSig = code !== '0x' && !isEip7702Delegated

  const isApproveMode = isMultiSig || Boolean(useApprove)

  let multiSigData = null

  const permitParams = isApproveMode ? null : values.permitParams

  if (permitParams) {
    validateArgs.object({ permitParams })

    const { vault, amount, deadline, v, r, s } = permitParams

    validateArgs.address({ 'permitParams.vault': vault })
    validateArgs.bigint({ 'permitParams.amount': amount })
    validateArgs.string({ 'permitParams.r': r, 'permitParams.s': s })
    validateArgs.number({ 'permitParams.v': v, 'permitParams.deadline': deadline })
  }

  const multicallArgs: Omit<Parameters<typeof boostMulticall>[0], 'request'> = {
    leverageStrategyContract,
    ...values,
  }

  const params: Parameters<typeof boostMulticall>[0]['request']['params'] = []

  if (permitParams) {
    const { vault, amount, deadline, v, r, s } = permitParams

    params.push({
      method: 'permit',
      args: [
        vault,
        amount,
        deadline,
        v,
        r,
        s,
      ],
    })
  }
  else {
    const strategyProxy = await getLeverageStrategyProxy(values)

    const allowance = await contracts.tokens.mintToken.allowance(userAddress, strategyProxy)
    const isPermitRequired = allowance < amount

    if (isPermitRequired) {
      if (isApproveMode) {
        multiSigData = {
          contract: contracts.tokens.mintToken,
          approveArgs: [ strategyProxy, MaxUint256 ] as [ string, bigint ],
        }
      }
      else if (mockPermitSignature) {
        params.push({
          method: 'permit',
          args: [
            vaultAddress,
            amount,
          ],
        })
      }
      else {
        const utils = new Utils(values)

        const permitParams = await utils.getPermitSignature({
          ownerAddress: userAddress,
          spenderAddress: strategyProxy,
          contract: contracts.tokens.mintToken,
        })

        params.push({
          method: 'permit',
          args: [
            vaultAddress,
            permitParams.amount,
            permitParams.deadline,
            permitParams.v,
            permitParams.r,
            permitParams.s,
          ],
        })
      }
    }
  }

  params.push({
    method: 'deposit',
    args: [ vaultAddress, amount, referrerAddress ],
  })

  return {
    multiSigData,
    multicallArgs: {
      ...multicallArgs,
      request: {
        params,
      },
    },
    isUpgradeRequired,
  }
}
