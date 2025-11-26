import { Vault, Boost, RewardSplitter, DistributorRewards, OsToken, Utils } from './services'
import { createContracts, vaultMulticall, rewardSplitterMulticall } from './contracts'

import {
  getGas,
  configs,
  VaultType,
  createProvider,
  getVaultFactory,
  getVaultVersion,
} from './utils'


type GetVaultFactoryInput = { vaultType?: VaultType, isErc20?: boolean }

type VaultMulticallInput = Pick<Parameters<typeof vaultMulticall>[0], 'request' | 'userAddress' | 'vaultAddress'>

type RewardSplitterMulticallInput = Pick<Parameters<typeof rewardSplitterMulticall>[0], 'request' | 'userAddress' | 'vaultAddress'> & {
  rewardSplitterAddress: string
}

class StakeWiseSDK {
  readonly config: StakeWise.Config
  readonly options: StakeWise.Options
  readonly provider: StakeWise.Provider
  readonly contracts: StakeWise.Contracts

  readonly vault: StakeWise.Services.Vault
  readonly utils: StakeWise.Services.Utils
  readonly boost: StakeWise.Services.Boost
  readonly osToken: StakeWise.Services.OsToken
  readonly rewardSplitter: StakeWise.Services.RewardSplitter
  readonly distributorRewards: StakeWise.Services.DistributorRewards

  constructor(options: StakeWise.Options) {
    const config = configs[options.network]

    if (!options.provider && !options.endpoints?.web3) {
      throw new Error('Provider or endpoints.web3 should be provided')
    }

    const provider = options.provider || createProvider(options)
    const originalGetSigner = provider.getSigner

    provider.getSigner = async function (address?: string) {
      const providerError = 'To send this transaction, please provide BrowserProvider to the StakeWiseSDK'

      try {
        const signer = await originalGetSigner.bind(this)(address)

        return signer
      }
      catch (error) {
        console.error('getSigner err:', error)
        throw new Error(providerError)
      }
    }

    const contracts = createContracts({ provider, config })

    this.config = config
    this.options = options
    this.provider = provider
    this.contracts = contracts

    if (options.endpoints?.subgraph) {
      // @ts-ignore: It's better to just overwrite
      this.config.api.subgraph = options.endpoints.subgraph
    }

    if (options.endpoints?.api) {
      // @ts-ignore: It's better to just overwrite
      this.config.api.backend = options.endpoints.api
    }

    const commonParams = { options, contracts, provider }

    this.vault = new Vault(commonParams)
    this.utils = new Utils(commonParams)
    this.boost = new Boost(commonParams)
    this.osToken = new OsToken(commonParams)
    this.rewardSplitter = new RewardSplitter(commonParams)
    this.distributorRewards = new DistributorRewards(commonParams)
  }

  async vaultMulticall<T extends unknown>(values: VaultMulticallInput) {
    const { userAddress, vaultAddress, request } = values

    const { isBlocklist, isPrivate, version } = await this.vault.getVault({ vaultAddress })

    const vaultContract = this.contracts.helpers.createVault({
      options: {
        isPrivate,
        isBlocklist,
        isDepositWithMint: version >= 3,
        chainId: this.config.network.chainId,
      },
      vaultAddress,
    })

    return vaultMulticall<T>({
      options: this.options,
      vaultContract,
      vaultAddress,
      userAddress,
      request,
    })
  }

  getVaultFactory({ vaultType, isErc20 }: GetVaultFactoryInput) {
    return getVaultFactory({
      vaultType,
      isErc20,
      contracts: this.contracts,
    })
  }

  rewardSplitterMulticall<T extends unknown>(values: RewardSplitterMulticallInput) {
    const { userAddress, vaultAddress, rewardSplitterAddress, request } = values

    return rewardSplitterMulticall<T>({
      rewardSplitterContract: this.contracts.helpers.createRewardSplitter(rewardSplitterAddress),
      options: this.options,
      vaultAddress,
      userAddress,
      request,
    })
  }

  getGas(estimatedGas: bigint) {
    return getGas({
      provider: this.provider,
      estimatedGas,
    })
  }

  getVaultVersion(vaultAddress: string) {
    return getVaultVersion({
      contracts: this.contracts,
      vaultAddress,
    })
  }

  get network() {
    return this.options.network
  }
}


export default StakeWiseSDK
