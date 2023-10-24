import { validateArgs } from '../../../utils'
import { vaultMulticall } from '../../../contracts'


type WithdrawInput = {
  assets: bigint
  userAddress: string
  vaultAddress: string
  availableAssets: bigint
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

const withdraw = async (values: WithdrawInput): Promise<StakeWise.TransactionHash> => {
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

  const { hash } = await vaultMulticall<{ hash: string }>({
    ...multicallCommonArgs,
    request: { params },
  })

  return hash
}


export default withdraw
