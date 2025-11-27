export type GetVaultVersionInput = StakeWise.CommonParams & {
  vaultAddress: string
}

const getVaultVersion = async (values: GetVaultVersionInput) => {
  const { contracts, vaultAddress } = values

  const vaultContract = contracts.helpers.createVault({ vaultAddress })
  const version = await vaultContract.version()

  const isV1Version = version === 1n
  const isV2Version = version === 2n

  const isMoreV1 = version > 1n
  const isMoreV2 = version > 2n

  return {
    version: Number(version),
    isV1Version,
    isV2Version,
    isMoreV1,
    isMoreV2,
  }
}


export default getVaultVersion
