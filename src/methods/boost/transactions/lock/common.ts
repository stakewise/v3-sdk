import { MaxUint256, ZeroAddress } from 'ethers'

import type { LockInput } from './types'
import { validateArgs } from '../../../../utils'
import { boostMulticall } from '../../../../contracts'
import { getPermitSignature } from '../../../utils'
import getLeverageStrategyProxy from '../../requests/getLeverageStrategyProxy'
import { getLeverageStrategyContract, validateLeverageStrategyData } from '../../util'


type CommonLogicInput = LockInput & {
  mockPermitSignature?: boolean
}

export const commonLogic = async (values: CommonLogicInput) => {
  const {
    contracts, options, provider, amount, vaultAddress, userAddress, referrerAddress = ZeroAddress,
    mockPermitSignature, leverageStrategyData,
  } = values

  validateArgs.bigint({ amount })
  validateArgs.address({ vaultAddress, userAddress, referrerAddress })

  if (leverageStrategyData) {
    validateLeverageStrategyData(leverageStrategyData)
  }

  console.log('START')

  const { leverageStrategyContract, isUpgradeRequired } = await getLeverageStrategyContract(values)

  console.log('leverageStrategyContract, isUpgradeRequired', leverageStrategyContract, isUpgradeRequired)

  const code = await provider.getCode(userAddress)

  console.log('code', code)

  const isMultiSig = code !== '0x'

  let multiSigData = null

  const permitParams = isMultiSig ? null : values.permitParams

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
    vaultAddress,
    userAddress,
    options,
  }

  const params: Parameters<typeof boostMulticall>[0]['request']['params'] = []

  console.log('permitParams', permitParams)

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
    console.log('PROXY start')
    const strategyProxy = await getLeverageStrategyProxy({
      contracts,
      userAddress,
      vaultAddress,
    })

    console.log('strategyProxy', strategyProxy)

    const allowance = await contracts.tokens.mintToken.allowance(userAddress, strategyProxy)

    console.log('allowance', allowance)

    const isPermitRequired = allowance < amount

    if (isPermitRequired) {
      // It is hard to make permit action for MultiSig e.g. Safe wallet,
      // so we need to use approve instead
      if (isMultiSig) {
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
        console.log('permitParams start')

        const permitParams = await getPermitSignature({
          options,
          provider,
          contract: contracts.tokens.mintToken,
          ownerAddress: userAddress,
          spenderAddress: strategyProxy,
        })

        console.log('permitParams', permitParams)

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

  console.log('params', params)

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
