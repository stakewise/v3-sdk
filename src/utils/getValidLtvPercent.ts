import validateArgs from './validateArgs'


type Input = {
  ltvPercent: bigint
  vaultAddress: string
  contracts: StakeWise.Contracts
}

const getValidLtvPercent = async (values: Input) => {
  const { ltvPercent, vaultAddress, contracts } = values

  validateArgs.address({ vaultAddress })
  validateArgs.bigint({ ltvPercent })

  const vaultContract = contracts.helpers.createVault(vaultAddress)

  const version = await vaultContract.version()
  const isV1Version = version === 1n

  // in second+ version 100% ltv percent = 1 ether in wei
  const percent = isV1Version
    ? ltvPercent
    : ltvPercent / 100000000000000n

  return percent
}


export default getValidLtvPercent
