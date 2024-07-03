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
  const isSecondVersion = version === 2n

  // in second version 100% ltv percent = 1 ether in wei
  const percent = isSecondVersion
    ? ltvPercent / 100000000000000n
    : ltvPercent

  return percent
}


export default getValidLtvPercent
