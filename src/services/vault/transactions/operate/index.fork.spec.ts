import { describe, expect } from 'vitest'
import { getAddress } from 'ethers'

import mockGraphql from '../../../../../test/mockGraphql'
import { it, userAddress, spenderAddress } from '../../../../../test'
import { ipfsHash, metadata } from '../../../../../test/mocks/metadata'
import {
  forkAbis,
  useForkSdk,
  parseEvents,
  extendContract,
  fundVaultAdmin,
  getForkHarvestArgs,
  sendForkTransaction,
  mockForkHarvestParams,
} from '../../../../../test/fork'

import { VaultType } from '../../../../helpers'

import type { Fork } from '../../../../../test/fork'
import type { UploadMetadataMutationPayload } from '../../../../graphql/backend/vault'


type FactoryName = 'privateVault' | 'blocklistVault'

const managerAddress = spenderAddress
const listedAddress = '0x3333333333333333333333333333333333333333'
const newAdminAddress = '0x6666666666666666666666666666666666666666'
const feePercent = 5
const feeBasisPoints = BigInt(feePercent * 100)

describe('operate', () => {
  let privateVaultAddress = ''
  let blocklistVaultAddress = ''

  const createVault = async (setupFork: Fork, type: VaultType, factory: FactoryName) => {
    const { sdk, provider } = setupFork
    const factoryContract = extendContract(sdk.contracts.factories[factory], forkAbis.vaultFactory)

    const hash = await sdk.vault.create({ userAddress, type })
    const receipt = await provider.waitForTransaction(hash)

    expect(receipt?.status, 'the setup vault creation must succeed').toBe(1)

    const [ created ] = await parseEvents(factoryContract, receipt)

    if (!created) {
      throw new Error('the setup vault creation must emit VaultCreated')
    }

    return created.args.vault
  }

  const createVaults = async (setupFork: Fork) => {
    await fundVaultAdmin(setupFork)
    privateVaultAddress = await createVault(setupFork, VaultType.Private, 'privateVault')
    blocklistVaultAddress = await createVault(setupFork, VaultType.Blocklist, 'blocklistVault')
  }

  const { sdk, provider, snapshot } = useForkSdk({ setup: createVaults })
  const vaultAddress = getAddress(snapshot.vaultAddress)
  const harvestArgs = getForkHarvestArgs(snapshot)

  const getVaultContract = (address: string) => extendContract(
    sdk.contracts.helpers.createVault({ vaultAddress: address, options: { isPrivate: true, isBlocklist: true } }),
    forkAbis.vault
  )

  it('vault admin', async () => {
    const vaultContract = getVaultContract(vaultAddress)
    const adminAddress = await vaultContract.admin()

    const input = {
      ...metadata,
      feePercent,
      vaultAddress,
      admin: newAdminAddress,
      userAddress: adminAddress,
      feeRecipient: userAddress,
      validatorsManager: managerAddress,
    }

    mockForkHarvestParams(snapshot, true)

    mockGraphql<UploadMetadataMutationPayload>({
      name: 'UploadMetadata',
      data: { uploadMetadata: { ipfsHash } },
    })

    const { receipt } = await sendForkTransaction({
      input,
      provider,
      contract: vaultContract,
      method: sdk.vault.operate,
      calls: [
        { name: 'updateState', args: [ harvestArgs ] },
        { name: 'setFeeRecipient', args: [ userAddress ] },
        { name: 'setMetadata', args: [ ipfsHash ] },
        { name: 'setValidatorsManager', args: [ managerAddress ] },
        { name: 'setFeePercent', args: [ feeBasisPoints ] },
        { name: 'setAdmin', args: [ newAdminAddress ] },
      ],
    })

    const [ vaultEvents, vaultState ] = await Promise.all([
      parseEvents(vaultContract, receipt),
      Promise.all([
        vaultContract.feeRecipient(),
        vaultContract.validatorsManager(),
        vaultContract.feePercent(),
        vaultContract.admin(),
      ]),
    ])

    const metadataUpdated = vaultEvents.find((event) => event?.name === 'MetadataUpdated')

    expect(metadataUpdated?.args.metadataIpfsHash).toBe(ipfsHash)
    expect(vaultState).toEqual([ userAddress, managerAddress, feeBasisPoints, newAdminAddress ])
  })

  it('private vault', async () => {
    const vaultContract = getVaultContract(privateVaultAddress)

    const input = {
      userAddress,
      whitelistManager: managerAddress,
      vaultAddress: privateVaultAddress,
      whitelist: [ { address: listedAddress, isNew: true } ],
    }

    await sendForkTransaction({
      input,
      provider,
      contract: vaultContract,
      method: sdk.vault.operate,
      calls: [
        { name: 'updateWhitelist', args: [ listedAddress, true ] },
        { name: 'setWhitelister', args: [ managerAddress ] },
      ],
    })

    const vaultState = await Promise.all([
      vaultContract.whitelistedAccounts(listedAddress),
      vaultContract.whitelister(),
    ])

    expect(vaultState).toEqual([ true, managerAddress ])
  })

  it('blocklist vault', async () => {
    const vaultContract = getVaultContract(blocklistVaultAddress)

    const input = {
      userAddress,
      blocklistManager: managerAddress,
      vaultAddress: blocklistVaultAddress,
      blocklist: [ { address: listedAddress, isNew: true } ],
    }

    await sendForkTransaction({
      input,
      provider,
      contract: vaultContract,
      method: sdk.vault.operate,
      calls: [
        { name: 'updateBlocklist', args: [ listedAddress, true ] },
        { name: 'setBlocklistManager', args: [ managerAddress ] },
      ],
    })

    const vaultState = await Promise.all([
      vaultContract.blockedAccounts(listedAddress),
      vaultContract.blocklistManager(),
    ])

    expect(vaultState).toEqual([ true, managerAddress ])
  })
})
