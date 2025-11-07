import getVault from '../../methods/vault/requests/getVault'

import {
  getHarvestArgs,
  handleMulticall,
  handleCallStatic,
  getSignedContract,
  handleEstimateGas,
  handleTransactionData,
} from './util'

import type { MulticallRequestInput } from './types'


type VaultContractAbi = ReturnType<StakeWise.Contracts['helpers']['createVault']>

export type VaultMulticallBaseInput = {
  userAddress: string
  vaultAddress: string
  options: StakeWise.Options
  vaultContract: VaultContractAbi
}

type VaultMulticallInput = VaultMulticallBaseInput & {
  request: MulticallRequestInput
}

// Methods with _checkHarvested() call
const harvestCheckMethods = [
  'deposit',
  'mintOsToken',
  'setFeePercent',
  'enterExitQueue',
  'setFeeRecipient',
  'convertToAssets',
  'convertToShares',
  'upgradeToAndCall',
  'getExitQueueIndex',
  'claimExitedAssets',
  'calculateExitedAssets',
]

/**
 * @description This method will automatically add the execution of the updateState method to the vault,
 * __but this method must be added to the whitelist__ inside the vaultMulticall method (harvestCheckMethods)
*/
const vaultMulticall = async <T extends unknown>(values: VaultMulticallInput): Promise<T> => {
  const { options, vaultAddress, userAddress, request, vaultContract } = values
  const { params, callStatic, estimateGas, transactionData } = request

  const contract = await getSignedContract({
    contract: vaultContract,
    userAddress,
    options,
    request,
  })

  let multicallParams = [ ...params ]

  const needHarvest = params.some(({ method }) => harvestCheckMethods.includes(method))

  const { isMetaVault } = await getVault({ options, vaultAddress })

  if (needHarvest) {
    const harvestArgs = await getHarvestArgs({
      options,
      vaultAddress,
    })

    if (harvestArgs && !isMetaVault) {
      const updateStateParams = {
        method: 'updateState',
        args: [ harvestArgs ],
      }

      multicallParams = [
        updateStateParams,
        ...multicallParams,
      ]
    }
  }

  const commonInput = {
    contract,
    multicallParams,
  }

  if (callStatic) {
    return handleCallStatic({ ...commonInput, userAddress }) as Promise<T>
  }

  if (estimateGas) {
    return handleEstimateGas(commonInput) as Promise<T>
  }

  if (transactionData) {
    return handleTransactionData(commonInput) as Promise<T>
  }

  return handleMulticall(commonInput)
}


export default vaultMulticall
