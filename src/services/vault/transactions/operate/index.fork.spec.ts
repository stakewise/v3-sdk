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
  mockForkHarvestParams,
} from '../../../../../test/fork'

import { VaultType } from '../../../../helpers'

import type { OperateInput } from './types'
import type { Fork } from '../../../../../test/fork'
import type { TransactionFixture } from '../../../../../test/fixtures/transaction'
import type { UploadMetadataMutationPayload } from '../../../../graphql/backend/vault'


type FactoryName = 'privateVault' | 'blocklistVault'

type Call = {
  name: string
  args: unknown[]
}

type SendOperateInput = {
  calls: Call[]
  input: StakeWise.ExtractInput<OperateInput>
  transaction: TransactionFixture
  vaultContract: ReturnType<typeof extendContract>
}

const managerAddress = spenderAddress
const listedAddress = '0x3333333333333333333333333333333333333333'
const newAdminAddress = '0x6666666666666666666666666666666666666666'
const feePercent = 5

describe('operate', () => {
  let adminAddress = ''
  let privateVaultAddress = ''
  let blocklistVaultAddress = ''

  const createVault = async (setupFork: Fork, type: VaultType, factory: FactoryName) => {
    const { sdk, provider } = setupFork
    const factoryContract = extendContract(sdk.contracts.factories[factory], forkAbis.vaultFactory)

    const hash = await sdk.vault.create({ userAddress, type })
    const receipt = await provider.waitForTransaction(hash)
    const [ created ] = await parseEvents(factoryContract, receipt)

    return created!.args.vault
  }

  const createVaults = async (setupFork: Fork) => {
    adminAddress = await fundVaultAdmin(setupFork)
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

  const sendOperate = async (values: SendOperateInput) => {
    const { calls, input, transaction, vaultContract } = values

    const [ encoded, gas ] = await Promise.all([
      transaction.checkEncode({
        input,
        calls,
        contract: vaultContract,
        method: sdk.vault.operate,
      }),
      sdk.vault.operate.estimateGas(input),
    ])

    const hash = await sdk.vault.operate(input)

    const [ receipt, sentTx ] = await Promise.all([
      provider.waitForTransaction(hash),
      provider.getTransaction(hash),
    ])

    expect(gas).toBeGreaterThan(0n)
    expect(sentTx?.data).toBe(encoded.data)
    expect(receipt?.status).toBe(1)

    return receipt
  }

  it('vault admin', async ({ transaction }) => {
    const vaultContract = getVaultContract(vaultAddress)

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

    const receipt = await sendOperate({
      input,
      transaction,
      vaultContract,
      calls: [
        { name: 'updateState', args: [ harvestArgs ] },
        { name: 'setFeeRecipient', args: [ userAddress ] },
        { name: 'setMetadata', args: [ ipfsHash ] },
        { name: 'setValidatorsManager', args: [ managerAddress ] },
        { name: 'setFeePercent', args: [ BigInt(feePercent * 100) ] },
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
    expect(vaultState).toEqual([ userAddress, managerAddress, BigInt(feePercent * 100), newAdminAddress ])
  })

  it('private vault', async ({ transaction }) => {
    const vaultContract = getVaultContract(privateVaultAddress)

    const input = {
      userAddress,
      whitelistManager: managerAddress,
      vaultAddress: privateVaultAddress,
      whitelist: [ { address: listedAddress, isNew: true } ],
    }

    await sendOperate({
      input,
      transaction,
      vaultContract,
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

  it('blocklist vault', async ({ transaction }) => {
    const vaultContract = getVaultContract(blocklistVaultAddress)

    const input = {
      userAddress,
      blocklistManager: managerAddress,
      vaultAddress: blocklistVaultAddress,
      blocklist: [ { address: listedAddress, isNew: true } ],
    }

    await sendOperate({
      input,
      transaction,
      vaultContract,
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
