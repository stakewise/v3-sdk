type VaultFilterInput = {
  vault?: string
  savedVault?: string
}

const harvestableVaultFilter = {
  canHarvest: true,
  isPrivate: false,
  isMetaVault: false,
  isBlocklist: false,
}

const getVaultFilter = ({ vault, savedVault }: VaultFilterInput) => {
  const address = vault || savedVault

  return address ? { id: address.toLowerCase() } : harvestableVaultFilter
}


export default getVaultFilter
