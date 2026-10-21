import { describe, expect } from 'vitest'
import { Contract } from 'ethers'

import { it } from '../../../../../test'
import {
  forkAbis,
  useForkSdk,
  fundAccount,
  parseEvents,
  extendContract,
  mainnetAccounts,
  sendForkTransaction,
} from '../../../../../test/fork'

import type { Fork } from '../../../../../test/fork'


const { v1BoostUserAddress, v1BoostVaultAddress } = mainnetAccounts

const v1ProxyAddress = '0xFe715B49aa7f68cFC40051BBecA1b9Ab81d2DcA2'

const fundV1User = ({ provider }: Fork) => fundAccount(provider, v1BoostUserAddress)

describe('upgradeLeverageStrategy', () => {
  const { sdk, provider } = useForkSdk({ setup: fundV1User })
  const leverageStrategyContract = extendContract(sdk.contracts.special.leverageStrategy, forkAbis.leverageStrategy)
  const strategyProxyContract = new Contract(v1ProxyAddress, forkAbis.strategyProxy, provider)

  it('upgrade', async () => {
    const input = { userAddress: v1BoostUserAddress, vaultAddress: v1BoostVaultAddress }

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
      calls: [ { name: 'upgradeProxy', args: [ v1BoostVaultAddress ] } ],
    })

    const [ ownerAfter, strategyEvents ] = await Promise.all([
      strategyProxyContract.owner(),
      parseEvents(leverageStrategyContract, receipt),
    ])

    const upgraded = strategyEvents.find((event) => event?.name === 'StrategyProxyUpgraded')

    expect(ownerBefore).toBe(leverageStrategyAddress)
    expect(ownerAfter).toBe(leverageStrategyV2Address)
    expect(upgraded?.args.user).toBe(v1BoostUserAddress)
    expect(upgraded?.args.strategy).toBe(leverageStrategyV2Address)
  })
})
