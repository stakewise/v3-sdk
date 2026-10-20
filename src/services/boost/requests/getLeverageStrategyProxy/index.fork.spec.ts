import { describe, expect } from 'vitest'
import { Contract } from 'ethers'

import { it } from '../../../../../test'
import { forkAbis, useForkSdk } from '../../../../../test/fork'


type ProxyCase = {
  name: string
  userAddress: string
  vaultAddress: string
  strategy: 'leverageStrategy' | 'leverageStrategyV2'
}

const boosterAddress = '0xf04D6930c42cb324D350ab85ec61cf65EC6EffE1'
const v1UserAddress = '0xf506187Dc3f5c4C9C91cFf1D1AD7eaf9e305242F'
const v1VaultAddress = '0x089A97A8bC0C0F016f89F9CF42181Ff06afB2Daf'
const boostVaultAddress = '0xAC0F906E433d58FA868F936E8A43230473652885'

const proxyCases: ProxyCase[] = [
  {
    name: 'v2 position',
    userAddress: boosterAddress,
    strategy: 'leverageStrategyV2',
    vaultAddress: boostVaultAddress,
  },
  {
    name: 'v1 position',
    userAddress: v1UserAddress,
    vaultAddress: v1VaultAddress,
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
