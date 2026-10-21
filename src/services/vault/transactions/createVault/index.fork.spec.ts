import { describe, expect } from 'vitest'
import { parseEther } from 'ethers'

import {
  forkAbis,
  useForkSdk,
  parseEvents,
  extendContract,
  fundDepositToken,
  forkNetworkCases,
} from '../../../../../test/fork'
import { it, userAddress, decodeCalls } from '../../../../../test'

import { configs, Network, VaultType, constants } from '../../../../helpers'

import type StakeWiseSDK from '../../../../StakeWiseSDK'
import type { ForkNetwork } from '../../../../../test/fork'


type FactoryName = keyof StakeWise.Contracts['factories']

type VaultToken = {
  name: string
  symbol: string
}

type CreateCase = {
  name: string
  type: VaultType
  factory: FactoryName
  curator?: string
  mevEscrow?: string
  vaultToken?: VaultToken
  isOwnMevEscrow?: boolean
}

type NetworkCase = {
  value: bigint
  cases: CreateCase[]
}

type ReadVaultInput = {
  sdk: StakeWiseSDK
  vaultAddress: string
  isErc20: boolean
  isMetaVault: boolean
}

type CreatedVault = {
  admin: string
  capacity: bigint
  feePercent: bigint
  curator?: string
  mevEscrow?: string
  vaultToken?: VaultToken
}

const capacity = parseEther('1000')
const keysManagerFee = 5.55
const feePercent = 555n
const erc20Token = { name: 'Fork vault token', symbol: 'FVT' }
const mainnetCurator = configs[Network.Mainnet].addresses.base.curator.v2
const securityDeposit = constants.blockchain.gwei
const sharedMevEscrow = configs[Network.Mainnet].addresses.base.sharedMevEscrow
const gnosisSharedMevEscrow = configs[Network.Gnosis].addresses.base.sharedMevEscrow

const createCases: CreateCase[] = [
  {
    name: 'vault',
    type: VaultType.Default,
    factory: 'vault',
    mevEscrow: sharedMevEscrow,
  },
  {
    name: 'own mev escrow',
    type: VaultType.Default,
    factory: 'vault',
    isOwnMevEscrow: true,
  },
  {
    name: 'erc20 vault',
    type: VaultType.Default,
    factory: 'erc20Vault',
    mevEscrow: sharedMevEscrow,
    vaultToken: erc20Token,
  },
  {
    name: 'private vault',
    type: VaultType.Private,
    factory: 'privateVault',
    mevEscrow: sharedMevEscrow,
  },
  {
    name: 'erc20 private vault',
    type: VaultType.Private,
    factory: 'erc20PrivateVault',
    mevEscrow: sharedMevEscrow,
    vaultToken: erc20Token,
  },
  {
    name: 'blocklist vault',
    type: VaultType.Blocklist,
    factory: 'blocklistVault',
    mevEscrow: sharedMevEscrow,
  },
  {
    name: 'erc20 blocklist vault',
    type: VaultType.Blocklist,
    factory: 'erc20BlocklistVault',
    mevEscrow: sharedMevEscrow,
    vaultToken: erc20Token,
  },
  {
    name: 'meta vault',
    type: VaultType.MetaVault,
    factory: 'metavault',
    curator: mainnetCurator,
  },
  {
    name: 'erc20 meta vault',
    type: VaultType.MetaVault,
    factory: 'erc20Metavault',
    curator: mainnetCurator,
    vaultToken: erc20Token,
  },
  {
    name: 'private meta vault',
    type: VaultType.PrivateMetaVault,
    factory: 'privateMetavault',
    curator: mainnetCurator,
  },
  {
    name: 'erc20 private meta vault',
    type: VaultType.PrivateMetaVault,
    factory: 'erc20PrivateMetavault',
    curator: mainnetCurator,
    vaultToken: erc20Token,
  },
]

const gnosisCases = createCases
  .filter(({ curator }) => !curator)
  .map((createCase) => ({
    ...createCase,
    mevEscrow: createCase.isOwnMevEscrow ? undefined : gnosisSharedMevEscrow,
  }))

const networkCases: Record<ForkNetwork, NetworkCase> = {
  [Network.Mainnet]: { cases: createCases, value: securityDeposit },
  [Network.Gnosis]: { cases: gnosisCases, value: 0n },
}

const readVault = async (values: ReadVaultInput) => {
  const { sdk, vaultAddress, isErc20, isMetaVault } = values

  const createdVaultContract = extendContract(sdk.contracts.helpers.createVault({ vaultAddress }), forkAbis.vault)

  const [ admin, vaultCapacity, vaultFeePercent ] = await Promise.all([
    createdVaultContract.admin(),
    createdVaultContract.capacity(),
    createdVaultContract.feePercent(),
  ])

  const result: CreatedVault = { admin, capacity: vaultCapacity, feePercent: vaultFeePercent }

  if (isErc20) {
    const [ name, symbol ] = await Promise.all([
      createdVaultContract.name(),
      createdVaultContract.symbol(),
    ])

    result.vaultToken = { name, symbol }
  }

  if (isMetaVault) {
    const registryAddress = await createdVaultContract.subVaultsRegistry()
    const subVaultsRegistryContract = sdk.contracts.helpers.createSubVaultsRegistry(registryAddress)

    result.curator = await subVaultsRegistryContract.subVaultsCurator()
  }
  else {
    result.mevEscrow = await createdVaultContract.mevEscrow()
  }

  return result
}

describe('createVault', () => {
  describe.for(forkNetworkCases)('$name', ({ network }) => {
    const fork = useForkSdk({ network })
    const { sdk, provider } = fork
    const { value, cases } = networkCases[network]

    it.for(cases)('$name', async (createCase) => {
      const { type, factory, curator, mevEscrow, vaultToken, isOwnMevEscrow } = createCase

      const input = {
        type,
        capacity,
        vaultToken,
        userAddress,
        keysManagerFee,
        isOwnMevEscrow,
      }

      const factoryContract = extendContract(sdk.contracts.factories[factory], forkAbis.vaultFactory)
      const factoryAddress = await factoryContract.getAddress()

      await fundDepositToken(fork, { assets: securityDeposit, userAddress, spenderAddress: factoryAddress })

      const [ encoded, gas ] = await Promise.all([
        sdk.vault.create.encode(input),
        sdk.vault.create.estimateGas(input),
      ])

      const hash = await sdk.vault.create(input)

      const [ receipt, sentTx ] = await Promise.all([
        provider.waitForTransaction(hash),
        provider.getTransaction(hash),
      ])

      const createdEvents = await parseEvents(factoryContract, receipt)
      const [ vaultCreated ] = createdEvents

      expect(createdEvents).toHaveLength(1)

      if (!vaultCreated) {
        throw new Error('the factory must emit VaultCreated')
      }

      const { vault, ownMevEscrow } = vaultCreated.args

      const created = await readVault({
        sdk,
        vaultAddress: vault,
        isErc20: Boolean(vaultToken),
        isMetaVault: Boolean(curator),
      })

      const [ call ] = decodeCalls(factoryContract, encoded.data)

      expect(call.name).toBe('createVault')
      expect(encoded.to).toBe(factoryAddress)
      expect(gas).toBeGreaterThan(0n)
      expect(sentTx?.data).toBe(encoded.data)
      expect(sentTx?.value).toBe(value)
      expect(receipt?.status).toBe(1)
      expect(created).toEqual({
        admin: userAddress,
        capacity,
        feePercent,
        curator,
        vaultToken,
        mevEscrow: mevEscrow || ownMevEscrow,
      })
    })
  })

  describe('gnosis deposit token', () => {
    const fork = useForkSdk({ network: Network.Gnosis })
    const { sdk, provider } = fork
    const input = { userAddress, capacity, keysManagerFee }
    const depositTokenContract = sdk.contracts.helpers.createErc20(sdk.config.addresses.tokens.depositToken)

    it('without approval', async () => {
      const factoryAddress = await sdk.contracts.factories.vault.getAddress()
      const userSigner = await provider.getSigner(userAddress)

      await fundDepositToken(fork, { assets: securityDeposit, userAddress, spenderAddress: factoryAddress })

      const approveTx = await depositTokenContract.connect(userSigner).approve(factoryAddress, 0n)
      const approveReceipt = await approveTx.wait()

      const [ balance, allowance ] = await Promise.all([
        depositTokenContract.balanceOf(userAddress),
        depositTokenContract.allowance(userAddress, factoryAddress),
      ])

      expect(approveReceipt?.status, 'the setup approve must succeed').toBe(1)
      expect(balance, 'the user must hold the security deposit').toBeGreaterThanOrEqual(securityDeposit)
      expect(allowance, 'the factory must have no allowance').toBe(0n)

      const gas = sdk.vault.create.estimateGas(input)

      await expect(gas).rejects.toThrow(/execution reverted/)
    })

    it('security deposit', async () => {
      const factoryContract = extendContract(sdk.contracts.factories.vault, forkAbis.vaultFactory)
      const factoryAddress = await factoryContract.getAddress()

      await fundDepositToken(fork, { assets: securityDeposit, userAddress, spenderAddress: factoryAddress })

      const balanceBefore = await depositTokenContract.balanceOf(userAddress)

      const hash = await sdk.vault.create(input)
      const receipt = await provider.waitForTransaction(hash)
      const [ vaultCreated ] = await parseEvents(factoryContract, receipt)

      if (!vaultCreated) {
        throw new Error('the factory must emit VaultCreated')
      }

      const { vault } = vaultCreated.args

      const [ balanceAfter, vaultBalance ] = await Promise.all([
        depositTokenContract.balanceOf(userAddress),
        depositTokenContract.balanceOf(vault),
      ])

      expect(balanceBefore - balanceAfter).toBe(securityDeposit)
      expect(vaultBalance).toBe(securityDeposit)
    })
  })
})
