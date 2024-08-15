import { wrapAbortPromise } from '../../../modules/gql-module'
import { getVaultVersion } from '../../../utils'


export type GetOsTokenConfigInput = {
  vaultAddress: string
  contracts: StakeWise.Contracts
}

type Output = {
  ltvPercent: bigint
  thresholdPercent: bigint
}

const getOsTokenData = async (input: GetOsTokenConfigInput) => {
  const { vaultAddress, contracts } = input

  const { isV1Version } = await getVaultVersion({ vaultAddress, contracts })

  if (isV1Version) {
    const [ thresholdPercent, ltvPercent ] = await Promise.all([
      contracts.base.mintTokenConfig.v1.liqThresholdPercent(),
      contracts.base.mintTokenConfig.v1.ltvPercent(),
    ])

    return {
      ltvPercent,
      thresholdPercent,
    }
  }
  else {
    const [ _, thresholdPercent, ltvPercent ] = await contracts.base.mintTokenConfig.v2.getConfig(vaultAddress)

    return {
      ltvPercent,
      thresholdPercent,
    }
  }
}


export default wrapAbortPromise<GetOsTokenConfigInput, Output>(getOsTokenData)
