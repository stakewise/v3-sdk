import * as z from 'zod/mini'
import { MaxUint256 } from 'ethers'

import Utils from '../../../utils'
import { validate } from './validate'
import type { LockInput } from './types'
import { boostMulticall } from '../../../../contracts'
import { parseArgs, schema } from '../../../../helpers'
import getLeverageStrategyProxy from '../../requests/getLeverageStrategyProxy'
import { getLeverageStrategyContract, validateLeverageStrategyData } from '../../helpers'


type CommonLogicInput = LockInput & {
  mockPermitSignature?: boolean
}

export const commonLogic = async (values: CommonLogicInput) => {
  const { contracts, provider, mockPermitSignature, leverageStrategyData } = values

  const { amount, vaultAddress, userAddress, referrerAddress } = validate(values)

  if (leverageStrategyData) {
    validateLeverageStrategyData(leverageStrategyData)
  }

  const { leverageStrategyContract, isUpgradeRequired } = await getLeverageStrategyContract(values)

  const code = await provider.getCode(userAddress)
  const isMultiSig = code !== '0x'

  let multiSigData = null

  const permitParams = isMultiSig ? null : values.permitParams

  if (permitParams) {
    parseArgs(z.object({
      permitParams: z.object({
        vault: schema.ethAddress,
        amount: schema.bigint,
        r: schema.string,
        s: schema.string,
        v: schema.number,
        deadline: schema.number,
      }),
    }), { permitParams })
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
