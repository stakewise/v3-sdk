import { MaxUint256, ZeroAddress } from 'ethers'

import type { LockInput } from './types'
import { validateArgs } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'
import { getPermitSignature } from '../../../utils'
import getLeverageStrategyProxy from '../../requests/getLeverageStrategyProxy'


type CommonLogicInput = LockInput & {
  mockPermitSignature?: boolean
}

export const commonLogic = async (values: CommonLogicInput) => {
  const {
    contracts, options, provider, amount, vaultAddress, userAddress, referrerAddress = ZeroAddress,
    mockPermitSignature,
  } = values

  validateArgs.bigint({ amount })
  validateArgs.address({ vaultAddress, userAddress, referrerAddress })

  const code = await provider.getCode(userAddress)
  const isSafeWallet = code !== '0x'

  let safeWalletData = null

  const permitParams = isSafeWallet ? null : values.permitParams

  if (permitParams) {
    validateArgs.object({ permitParams })

    const { vault, amount, deadline, v, r, s } = permitParams

    validateArgs.address({ 'permitParams.vault': vault })
    validateArgs.bigint({ 'permitParams.amount': amount })
    validateArgs.string({ 'permitParams.r': r, 'permitParams.s': s })
    validateArgs.number({ 'permitParams.v': v, 'permitParams.deadline': deadline })
  }

  const multicallArgs: Omit<Parameters<typeof boostMulticall>[0], 'request'> = {
    leverageStrategyContract: contracts.special.leverageStrategy,
    vaultAddress,
    userAddress,
    options,
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
    const strategyProxy = await getLeverageStrategyProxy({
      contracts,
      userAddress,
      vaultAddress,
    })

    const allowance = await contracts.tokens.mintToken.allowance(userAddress, strategyProxy)
    const isPermitRequired = allowance < amount

    if (isPermitRequired) {
      // It is hard to make permit action for Safe wallet,
      // so we need to use approve instead
      if (isSafeWallet) {
        safeWalletData = {
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
        const permitParams = await getPermitSignature({
          options,
          provider,
          contract: contracts.tokens.mintToken,
          ownerAddress: userAddress,
          spenderAddress: strategyProxy,
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
    safeWalletData,
    multicallArgs: {
      ...multicallArgs,
      request: {
        params,
      },
    },
  }
}
