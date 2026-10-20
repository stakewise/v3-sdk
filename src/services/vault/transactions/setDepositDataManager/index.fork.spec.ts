import { describe, expect, beforeAll } from 'vitest'
import { getAddress, parseEther, toQuantity } from 'ethers'

import { fork, useForkSdk } from '../../../../../test/fork'
import { it, userAddress, decodeCalls, spenderAddress, adminRoleError } from '../../../../../test'


const vaultAddress = getAddress(fork.vaultAddress)
const managerAddress = spenderAddress

describe('setDepositDataManager', () => {
  const { sdk, provider } = useForkSdk()
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress })
  const { depositDataRegistry } = sdk.contracts.base

  beforeAll(async () => {
    const adminAddress = await vaultContract.admin()

    await provider.send('anvil_setBalance', [ adminAddress, toQuantity(parseEther('10')) ])
  })

  it('vault admin', async () => {
    const adminAddress = await vaultContract.admin()
    const input = { userAddress: adminAddress, vaultAddress, managerAddress }

    const managerBefore = await depositDataRegistry.getDepositDataManager(vaultAddress)

    expect(managerBefore, 'the manager must differ from the new one').not.toBe(managerAddress)

    const [ encoded, gas ] = await Promise.all([
      sdk.vault.setDepositDataManager.encode(input),
      sdk.vault.setDepositDataManager.estimateGas(input),
    ])

    const hash = await sdk.vault.setDepositDataManager(input)

    const [ receipt, sentTx, managerAfter ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
      depositDataRegistry.getDepositDataManager(vaultAddress),
    ])

    const [ call ] = decodeCalls(depositDataRegistry, encoded.data)

    expect(call.name).toBe('setDepositDataManager')
    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)
    expect(managerAfter).toBe(managerAddress)
  })

  it('role error', async () => {
    const input = { userAddress, vaultAddress, managerAddress }

    const request = sdk.vault.setDepositDataManager(input)

    await expect(request).rejects.toBe(adminRoleError)
  })
})
