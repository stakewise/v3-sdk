type Input = {
  vaultAddress: string
  contracts: StakeWise.Contracts
}

const getVaultVersion = async (values: Input) => {
  const { contracts, vaultAddress } = values

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const version = await vaultContract.version()
  const isV1Version = version === 1n

  return {
    isV1Version,
  }
}


export default getVaultVersion
