import { describe, expect } from 'vitest'
import { getAddress, parseEther } from 'ethers'

import { Network } from '../../src/helpers/enums'

import { it, userAddress } from '..'

import useForkSdk from './useForkSdk'
import checkProbe from './checkProbe'
import mockForkMetaVault from './mockForkMetaVault'

import type { Fork } from './useForkSdk'
import type { ProbeCall } from './checkProbe'
import type { ForkNetwork } from './constants'
import type { ProbeExpected } from './classifyProbe'


type ContractErrorCase = {
  name: string
  call: ProbeCall
  expected: Extract<ProbeExpected, { error: string }>
}

type NetworkCase = {
  name: string
  network: ForkNetwork
  cases: ContractErrorCase[]
}

const lockerAddress = '0x3f294e22455ecFcE652E2CFE1610ab7bFB4e87C9'
const metaVaultAddress = '0x03f9e15680F0164F9c1d5FBF6EAc822d6dA40F5f'
const subVaultsRegistryAddress = '0x66343A85D2b6CE97EBb09C07f8b711B27bc300B0'
const gnosisHolderAddress = '0xb5814811dC4fC2aC127A1F8Fb708460bF9Fad619'

const shares = parseEther('0.1')
const emptyPosition = { timestamp: '0', positionTicket: '0', exitQueueIndex: '0' }

const getBaseInput = ({ snapshot }: Fork) => ({ userAddress, vaultAddress: getAddress(snapshot.vaultAddress) })

const getMetaVaultInput = (fork: Fork) => {
  const { vaultAddress } = getBaseInput(fork)

  return { userAddress, vaultAddress: metaVaultAddress, subVaultAddress: vaultAddress }
}

const mockMetaVault = () => mockForkMetaVault({ metaVaultAddress, subVaultsRegistryAddress })

const sharedCases: ContractErrorCase[] = [
  {
    name: 'W7 claimExitQueue',
    call: (fork) => fork.sdk.vault.claimExitQueue.estimateGas({ ...getBaseInput(fork), positions: [ emptyPosition ] }),
    expected: { error: 'ExitRequestNotProcessed' },
  },
  {
    name: 'W17 mint',
    call: (fork) => fork.sdk.osToken.mint.estimateGas({ ...getBaseInput(fork), shares }),
    expected: { error: 'LowLtv' },
  },
  {
    name: 'W20 claimRedeemerExitQueue',
    call: ({ sdk }) => sdk.osToken.claimRedeemerExitQueue.estimateGas({ userAddress, positions: [ emptyPosition ] }),
    expected: { error: 'ExitRequestNotProcessed' },
  },
  {
    name: 'W29 distributorRewards claim',
    call: ({ sdk }) => sdk.distributorRewards.claim.estimateGas({
      userAddress,
      cumulativeAmounts: [ '1' ],
      proof: [ `0x${'00'.repeat(32)}` ],
      tokens: [ sdk.config.addresses.tokens.mintToken ],
    }),
    expected: { error: 'InvalidProof' },
  },
]

const mainnetCases: ContractErrorCase[] = [
  {
    name: 'W13 addSubVault',
    call: (fork) => {
      mockMetaVault()

      return fork.sdk.vault.addSubVault.estimateGas(getMetaVaultInput(fork))
    },
    expected: { error: 'AccessDenied' },
  },
  {
    name: 'W14 rejectSubVault',
    call: (fork) => {
      mockMetaVault()

      return fork.sdk.vault.rejectSubVault.estimateGas(getMetaVaultInput(fork))
    },
    expected: { error: 'AccessDenied' },
  },
  {
    name: 'W15 ejectSubVault',
    call: (fork) => {
      mockMetaVault()

      return fork.sdk.vault.ejectSubVault.estimateGas(getMetaVaultInput(fork))
    },
    expected: { error: 'AccessDenied' },
  },
  {
    name: 'W18 burn',
    call: (fork) => {
      const input = { ...getBaseInput(fork), userAddress: lockerAddress, shares }

      return fork.sdk.osToken.burn.estimateGas(input)
    },
    expected: { error: 'InvalidPosition' },
  },
  {
    name: 'W24 upgradeLeverageStrategy',
    call: (fork) => fork.sdk.boost.upgradeLeverageStrategy.estimateGas(getBaseInput(fork)),
    expected: { error: 'AccessDenied' },
  },
]

const gnosisCases: ContractErrorCase[] = [
  {
    name: 'W18 burn',
    call: (fork) => {
      const input = { ...getBaseInput(fork), userAddress: gnosisHolderAddress, shares }

      return fork.sdk.osToken.burn.estimateGas(input)
    },
    expected: { error: 'InvalidPosition' },
  },
]

const networkCases: NetworkCase[] = [
  { name: 'mainnet', network: Network.Mainnet, cases: [ ...sharedCases, ...mainnetCases ] },
  { name: 'gnosis', network: Network.Gnosis, cases: [ ...sharedCases, ...gnosisCases ] },
]

describe('contract errors', () => {
  describe.for(networkCases)('$name', ({ network, cases }) => {
    const fork = useForkSdk({ network })

    it.for(cases)('$name', async ({ call, expected }) => {
      const probed = await checkProbe(fork, call)

      expect(probed).toEqual({ outcome: expected, cause: expect.any(String), emptyTargets: [] })
    })
  })
})
