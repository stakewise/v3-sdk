import { constants } from '../../../helpers'
import { vaultMulticall } from '../../../contracts'
import getOsTokenConfig from '../requests/getOsTokenConfig'


type GetMaxExitSharesInput = StakeWise.CommonParams & {
  userAddress: string
  vaultAddress: string
  burnShares: bigint
}

// The vault floors every conversion on its LTV check, the buffer adds 3 wei to fix that
const ltvCheckBuffer = 3n
const secondsInHour = 60n * 60n

const getMaxExitShares = async (values: GetMaxExitSharesInput): Promise<bigint> => {
  const { contracts, userAddress, vaultAddress, burnShares } = values

  const vaultContract = contracts.helpers.createVault({ vaultAddress })

  const [ config, stakeShares, osTokenShares, avgRewardPerSecond ] = await Promise.all([
    getOsTokenConfig(values),
    vaultContract.getShares(userAddress),
    vaultContract.osTokenPositions(userAddress),
    contracts.base.mintTokenController.avgRewardPerSecond(),
  ])

  const ltvPercent = BigInt(config.ltvPercent)

  if (!stakeShares || ltvPercent <= 0n) {
    return 0n
  }

  if (!osTokenShares) {
    return stakeShares
  }

  const debtShares = osTokenShares > burnShares ? osTokenShares - burnShares : 0n

  const [ debtAssets, positionAssets ] = await Promise.all([
    contracts.base.mintTokenController.convertToAssets(debtShares),
    contracts.base.mintTokenController.convertToAssets(osTokenShares),
  ])

  const gap = avgRewardPerSecond * secondsInHour * positionAssets / constants.blockchain.amount1

  const [ { shares: lockedShares } ] = await vaultMulticall<[ { shares: bigint } ]>({
    ...values,
    vaultContract,
    request: {
      params: [
        {
          method: 'convertToShares',
          args: [
            (debtAssets + gap) * constants.blockchain.amount1 / ltvPercent,
          ],
        },
      ],
      callStatic: true,
    },
  })

  const lockedWithBuffer = lockedShares + ltvCheckBuffer

  return stakeShares > lockedWithBuffer ? stakeShares - lockedWithBuffer : 0n
}


export default getMaxExitShares
