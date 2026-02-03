import { VaultType } from '../../../../helpers'


export type GetVaultFactoryInput = StakeWise.CommonParams & {
  vaultType?: VaultType
  isErc20?: boolean
}

const getVaultFactory = ({ vaultType, contracts, isErc20 }: GetVaultFactoryInput) => {
  const vaultFactories = isErc20 ? {
    [VaultType.Default]: contracts.factories.erc20Vault,
    [VaultType.MetaVault]: contracts.factories.erc20Metavault,
    [VaultType.Private]: contracts.factories.erc20PrivateVault,
    [VaultType.Blocklist]: contracts.factories.erc20BlocklistVault,
    [VaultType.PrivateMetaVault]: contracts.factories.erc20PrivateMetavault,
  } : {
    [VaultType.Default]: contracts.factories.vault,
    [VaultType.MetaVault]: contracts.factories.metavault,
    [VaultType.Private]: contracts.factories.privateVault,
    [VaultType.Blocklist]: contracts.factories.blocklistVault,
    [VaultType.PrivateMetaVault]: contracts.factories.privateMetavault,
  }

  return vaultFactories[vaultType || VaultType.Default]
}


export default getVaultFactory
