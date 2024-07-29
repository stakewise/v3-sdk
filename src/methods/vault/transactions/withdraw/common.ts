import type { WithdrawInput } from './types'
import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


export const commonLogic = async (values: WithdrawInput) => {
  const { options, contracts, assets, vaultAddress, userAddress } = values

  validateArgs.bigint({ assets })
  validateArgs.address({ vaultAddress, userAddress })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = []

  const vaultContract = contracts.helpers.createVault(vaultAddress)

  const version = Number(await vaultContract.version())

  // In the second version of the vault we do not use the redeem method,
  // the funds are always withdrawn via a queue
  const isNewVersion = version > 1

  const baseMulticallArgs: Omit<Parameters<typeof vaultMulticall>[0], 'request'> = {
    keeperContract: contracts.base.keeper,
    vaultContract,
    vaultAddress,
    userAddress,
    options,
  }

  const isCollateralized = await contracts.base.keeper.isCollateralized(vaultAddress)

  if (isCollateralized || isNewVersion) {
    const result = await vaultMulticall<[ { shares: bigint } ]>({
      ...baseMulticallArgs,
      request: {
        params: [ { method: 'convertToShares', args: [ assets ] } ],
        callStatic: true,
      },
    })

    const exitQueueShares = result[0].shares

    params.push({
      method: 'enterExitQueue',
      args: [ exitQueueShares, userAddress ],
    })
  }
  else {
    const result = await vaultMulticall<[ { shares: bigint } ]>({
      ...baseMulticallArgs,
      request: {
        params: [ { method: 'convertToShares', args: [ assets ] } ],
        callStatic: true,
      },
    })

    const shares = result[0].shares

    params.push({
       method: 'redeem',
       args: [ shares, userAddress ],
    })
  }

  return {
    ...baseMulticallArgs,
    request: {
      params,
    },
  }
}
