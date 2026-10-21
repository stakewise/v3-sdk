import { describe, expect } from 'vitest'
import { Contract } from 'ethers'

import { it } from '../../../../../test'
import { forkAbis, useForkSdk, mainnetAccounts } from '../../../../../test/fork'


type ProxyCase = {
  name: string
  userAddress: string
  vaultAddress: string
  strategy: 'leverageStrategy' | 'leverageStrategyV2'
}

const { boosterAddress, boostVaultAddress, leverageStrategyV1UserAddress, leverageStrategyV1VaultAddress } = mainnetAccounts

const proxyCases: ProxyCase[] = [
  {
    name: 'v2 position',
    userAddress: boosterAddress,
    strategy: 'leverageStrategyV2',
    vaultAddress: boostVaultAddress,
  },
  {
    name: 'v1 position',
    userAddress: leverageStrategyV1UserAddress,
    vaultAddress: leverageStrategyV1VaultAddress,
    strategy: 'leverageStrategy',
  },
]

describe('getLeverageStrategyProxy', () => {
  const { sdk, provider } = useForkSdk()

  it.for(proxyCases)('$name', async ({ userAddress, vaultAddress, strategy }) => {
    const leverageStrategyContract = sdk.contracts.special[strategy]
    const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })

    const proxyAddress = await sdk.boost.getLeverageStrategyProxy({ userAddress, vaultAddress })

    const strategyProxyContract = new Contract(proxyAddress, forkAbis.strategyProxy, provider)

    const [ strategyProxyAddress, leverageStrategyAddress, ownerAddress, proxyShares ] = await Promise.all([
      leverageStrategyContract.getStrategyProxy(vaultAddress, userAddress),
      leverageStrategyContract.getAddress(),
      strategyProxyContract.owner(),
      vaultContract.getShares(proxyAddress),
    ])

    expect(proxyAddress).toBe(strategyProxyAddress)
    expect(ownerAddress).toBe(leverageStrategyAddress)
    expect(proxyShares).toBeGreaterThan(0n)
  })
})
