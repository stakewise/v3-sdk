import getVault from '../../vault/requests/getVault'


type GetConfigInput = {
  options: StakeWise.Options
  vaultAddress: string
}

const getConfig = (input: GetConfigInput) => {
  const { options, vaultAddress } = input

  return getVault({
    options,
    vaultAddress,
  })
    .then((vault) => vault.osTokenConfig)
}


export default getConfig
