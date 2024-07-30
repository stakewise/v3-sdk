import { VaultType } from './enums'


type Input = {
  vaultType: VaultType
  contracts: StakeWise.Contracts
  isErc20?: boolean
}

const getVaultFactory = ({ vaultType, contracts, isErc20 }: Input) => {
  const vaultFactories = isErc20 ? {
    [VaultType.Default]: contracts.factories.erc20Vault,
    [VaultType.Private]: contracts.factories.erc20PrivateVault,
    // [VaultType.Blocklist]: contracts.factories.erc20BlocklistVault,
  } : {
    [VaultType.Default]: contracts.factories.vault,
    [VaultType.Private]: contracts.factories.privateVault,
    // [VaultType.Blocklist]: contracts.factories.blocklistVault,
  }

  return vaultFactories[vaultType]
}


export default getVaultFactory
