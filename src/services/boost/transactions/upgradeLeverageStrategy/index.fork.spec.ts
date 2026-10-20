import { describe, expect } from 'vitest'
import { Contract } from 'ethers'

import { it } from '../../../../../test'
import {
  forkAbis,
  useForkSdk,
  fundAccount,
  parseEvents,
  extendContract,
  sendForkTransaction,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const v1UserAddress = '0xf506187Dc3f5c4C9C91cFf1D1AD7eaf9e305242F'
const v1VaultAddress = '0x089A97A8bC0C0F016f89F9CF42181Ff06afB2Daf'
const v1ProxyAddress = '0xFe715B49aa7f68cFC40051BBecA1b9Ab81d2DcA2'

const fundV1User = ({ provider }: Fork) => fundAccount(provider, v1UserAddress)

describe('upgradeLeverageStrategy', () => {
  const { sdk, provider } = useForkSdk({ setup: fundV1User })
  const leverageStrategyContract = extendContract(sdk.contracts.special.leverageStrategy, forkAbis.leverageStrategy)
  const strategyProxyContract = new Contract(v1ProxyAddress, forkAbis.strategyProxy, provider)

  it('upgrade', async () => {
    const input = { userAddress: v1UserAddress, vaultAddress: v1VaultAddress }

    const [ ownerBefore, leverageStrategyAddress, leverageStrategyV2Address ] = await Promise.all([
      strategyProxyContract.owner(),
      leverageStrategyContract.getAddress(),
      sdk.contracts.special.leverageStrategyV2.getAddress(),
    ])

    const { receipt } = await sendForkTransaction({
      input,
      provider,
      contract: leverageStrategyContract,
      method: sdk.boost.upgradeLeverageStrategy,
      calls: [ { name: 'upgradeProxy', args: [ v1VaultAddress ] } ],
    })

    const [ ownerAfter, strategyEvents ] = await Promise.all([
      strategyProxyContract.owner(),
      parseEvents(leverageStrategyContract, receipt),
    ])

    const upgraded = strategyEvents.find((event) => event?.name === 'StrategyProxyUpgraded')

    expect(ownerBefore).toBe(leverageStrategyAddress)
    expect(ownerAfter).toBe(leverageStrategyV2Address)
    expect(upgraded?.args.user).toBe(v1UserAddress)
    expect(upgraded?.args.strategy).toBe(leverageStrategyV2Address)
  })
})
