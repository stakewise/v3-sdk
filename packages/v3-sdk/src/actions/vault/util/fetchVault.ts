import { formatEther, getAddress, MaxUint256 } from 'ethers'

import constants from '../../../constants'
import { subgraph } from '../../../graphql'

import modifyVaultData from './modifyVaultData'
import validateVaultAddress from './validateVaultAddress'


const fetchVault = async (vaultAddress: string): Promise<Vault.FetchVaultData> => {
  const address = validateVaultAddress(vaultAddress)

  try {
    const vault = await subgraph.vault.fetchVaultQuery<Vault.ModifiedData>({
      variables: { address },
      modifyResult: (data) => ({
        ...modifyVaultData<Vault.SubgraphData['vault']>(data.vault),
        privateVaultAccounts: data.privateVaultAccounts,
      }),
    })

    const performance = {
      mev: 7.5,
      insurance: 0,
      validators: 7,
      networkShare: 5,
      ownCapital: 8.3,
      geoDiversity: 5.2,
      clientDiversity: 9,
      validationPerformance: 8.3,
      total: Number(vault.performance.total),
    }

    const {
      apy,
      admin,
      isErc20,
      imageUrl,
      isPrivate,
      tokenName,
      createdAt,
      tokenSymbol,
      displayName,
      description,
      whitelister,
      validatorsRoot,
    } = vault

    return {
      apy,
      isErc20,
      imageUrl,
      isPrivate,
      tokenName,
      createdAt,
      tokenSymbol,
      performance,
      displayName,
      description,
      whitelister,
      validatorsRoot,
      whitelist: vault.privateVaultAccounts || [],
      vaultAdmin: getAddress(admin),
      feePercent: `${vault.feePercent / 100}%`,
      totalAssets: formatEther(vault.totalAssets),
      vaultAddress: getAddress(vault.address),
      feeRecipient: getAddress(vault.feeRecipient),
      isSmoothingPool: !vault.mevEscrow,
      totalPerformance: vault.performance.total,
      vaultKeysManager: getAddress(vault.keysManager),
      mevRecipient: vault.mevEscrow ? getAddress(vault.mevEscrow) : constants.sharedMevEscrow,
      capacity: vault.capacity !== MaxUint256.toString()
        ? formatEther(vault.capacity)
        : '∞',
    }
  }
  catch (error) {
    console.log('Fetch vault failed', error)

    return Promise.reject(error)
  }
}


export default fetchVault
