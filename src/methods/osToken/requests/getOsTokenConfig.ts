import { Network } from '../../../utils'
import { wrapAbortPromise } from '../../../modules/gql-module'


export type GetOsTokenConfigInput = {
  vaultAddress: string
  options: StakeWise.Options
  contracts: StakeWise.Contracts
}

type Output = {
  ltvPercent: bigint
  thresholdPercent: bigint
}

const getOsTokenData = async (input: GetOsTokenConfigInput) => {
  const { vaultAddress, options, contracts } = input

  const isMainnet = options.network === Network.Mainnet

  if (isMainnet) {
    const result = await contracts.base.mintTokenConfig.getConfig()
    const [ redeemFromLtvPercent, redeemToLtvPercent, thresholdPercent, liqBonusPercent, ltvPercent ] = result

    return {
      ltvPercent,
      thresholdPercent,
    }
  }
  else {
    const [ bonusPercent, thresholdPercent, ltvPercent ] = await contracts.base.mintTokenConfig.getConfig(vaultAddress)

    return {
      ltvPercent,
      thresholdPercent,
    }
  }
}


export default wrapAbortPromise<GetOsTokenConfigInput, Output>(getOsTokenData)
