import {
  getSwapParams,
  getHarvestArgs,
  handleMulticall,
  handleCallStatic,
  getSignedContract,
  handleEstimateGas,
  handleTransactionData,
} from './util'

import type { MulticallRequestInput } from './types'
import type { KeeperAbi, OtherTokenVaultAbi, VaultAbi } from '../types'
import { Network } from '../../utils'


type VaultContractAbi = VaultAbi | OtherTokenVaultAbi

type VaultMulticallInput = {
  userAddress: string
  vaultAddress: string
  keeperContract: KeeperAbi
  options: StakeWise.Options
  request: MulticallRequestInput
  vaultContract: VaultContractAbi
}

// Methods with _checkHarvested() call
const harvestCheckMethods = [
  'deposit',
  'mintOsToken',
  'enterExitQueue',
  'setFeeRecipient',
  'claimExitedAssets',
]

const vaultMulticall = async <T extends unknown>(values: VaultMulticallInput): Promise<T> => {
  const { options, vaultAddress, userAddress, request, vaultContract, keeperContract } = values
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
      keeperContract,
    })

    if (harvestArgs) {
      multicallParams = [
        {
          method: 'updateState',
          args: [ harvestArgs ],
        },
        ...multicallParams,
      ]

      const needSwap = [ Network.Chiado, Network.Gnosis ].includes(options.network)

      if (needSwap) {
        // This call depends on the balancer pool, so we should check if it works before making the call
        // otherwise we shouldn't add it to multicallParams
        const swapParams = await getSwapParams({
          contract,
          multicallParams,
        })

        if (swapParams) {
          multicallParams.push(swapParams)
        }
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
