import {
  getHarvestArgs,
  handleMulticall,
  handleCallStatic,
  getSignedContract,
  handleEstimateGas,
  testMulticallParams,
  handleTransactionData,
} from './util'

import type { MulticallRequestInput } from './types'
import { Network } from '../../utils'


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
  'enterExitQueue',
  'setFeeRecipient',
  'convertToAssets',
  'convertToShares',
  'getExitQueueIndex',
  'claimExitedAssets',
  'calculateExitedAssets',
]

/**
 * @description This method will automatically add the execution of the updateState method to the vault,
 * __but this method must be added to the whitelist__ inside the vaultMulticall method (harvestCheckMethods)
 * This method will also add swapXdaiToGno execution if needed.
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

  if (needHarvest) {
    const harvestArgs = await getHarvestArgs<VaultContractAbi>({
      options,
      vaultAddress,
    })

    if (harvestArgs) {
      const needSwap = [ Network.Chiado, Network.Gnosis ].includes(options.network)

      const updateStateParams = {
        method: 'updateState',
        args: [ harvestArgs ],
      }

      const swapParams = {
        method: 'swapXdaiToGno',
        args: [],
      }

      const fallbackParams = [
        updateStateParams,
        ...multicallParams,
      ]

      if (needSwap) {
        // This call depends on the balancer pool, so we should check if it works before making the call
        // otherwise we shouldn't add it to multicallParams
        multicallParams = await testMulticallParams({
          contract,
          multicallParams: [
            updateStateParams,
            swapParams,
            ...multicallParams,
          ],
          fallbackParams,
        })
      }
      else {
        multicallParams = fallbackParams
      }
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
