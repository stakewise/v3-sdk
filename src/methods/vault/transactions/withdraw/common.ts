import { WithdrawInput } from './types'
import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


export const commonLogic = async (values: WithdrawInput) => {
  const { options, contracts, assets, vaultAddress, userAddress, availableAssets } = values

  validateArgs.bigint({ assets, availableAssets })
  validateArgs.address({ vaultAddress, userAddress })

  const withExitQueue = availableAssets < assets
  const hasAvailableAssets = availableAssets > 0

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = []

  const multicallCommonArgs: Omit<Parameters<typeof vaultMulticall>[0], 'request'> = {
    vaultContract: contracts.helpers.createVaultContract(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  if (hasAvailableAssets) {
    const amount = withExitQueue ? availableAssets : assets

    const result = await vaultMulticall<[ { shares: bigint } ]>({
      ...multicallCommonArgs,
      request: {
        params: [ { method: 'convertToShares', args: [ amount ] } ],
        callStatic: true,
      },
    })

    const shares = result[0].shares

    params.push({
       method: 'redeem',
       args: [ shares, userAddress ],
    })
  }

  if (withExitQueue) {
    const exitQueueAssets = assets - availableAssets

    const result = await vaultMulticall<[ { shares: bigint } ]>({
      ...multicallCommonArgs,
      request: {
        params: [ { method: 'convertToShares', args: [ exitQueueAssets ] } ],
        callStatic: true,
      },
    })

    const exitQueueShares = result[0].shares

    params.push({
      method: 'enterExitQueue',
      args: [ exitQueueShares, userAddress ],
    })
  }

  return {
    params,
    multicallCommonArgs,
  }
}
