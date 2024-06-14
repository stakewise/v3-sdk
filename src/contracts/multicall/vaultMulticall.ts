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
