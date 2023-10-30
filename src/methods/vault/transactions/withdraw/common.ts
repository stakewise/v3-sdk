import { WithdrawInput } from './types'
import { validateArgs } from '../../../../utils'
import { vaultMulticall } from '../../../../contracts'


export const commonLogic = async (values: WithdrawInput) => {
  const { options, contracts, assets, vaultAddress, userAddress } = values

  validateArgs.bigint({ assets })
  validateArgs.address({ vaultAddress, userAddress })

  const params: Parameters<typeof vaultMulticall>[0]['request']['params'] = []

  const multicallCommonArgs: Omit<Parameters<typeof vaultMulticall>[0], 'request'> = {
    vaultContract: contracts.helpers.createVaultContract(vaultAddress),
    keeperContract: contracts.base.keeper,
    vaultAddress,
    userAddress,
    options,
  }

  const isCollateralized = await contracts.base.keeper.isCollateralized(vaultAddress)

  if (isCollateralized) {
    const result = await vaultMulticall<[ { shares: bigint } ]>({
      ...multicallCommonArgs,
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
  else {
    const result = await vaultMulticall<[ { shares: bigint } ]>({
      ...multicallCommonArgs,
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

  return {
    params,
    multicallCommonArgs,
  }
}
