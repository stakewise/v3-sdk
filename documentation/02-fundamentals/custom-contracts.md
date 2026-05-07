---
id: custom-contracts
title: Call arbitrary contracts
sidebar_position: 5
description: Interact with any StakeWise V3-compatible contract not yet integrated into the SDK's default StakeWise.Contracts namespace. Pass the contract address, ABI, and sdk.provider (which carries the SDK's network configuration and RPC endpoints) to createContract from @stakewise/v3-sdk to get a typed ethers Contract bound to the same chain as the SDK instance.
---

# Call arbitrary contracts


The default `StakeWise.Contracts` namespace, exposed at `sdk.contracts`, ships with built-ins (Keeper, RewardSplitter, MintTokenController, etc.). For any contract that is not yet integrated there — a freshly deployed StakeWise V3-compatible contract, a Chainlink oracle, a partner protocol — use the top-level `createContract` helper exported from `@stakewise/v3-sdk`. Pass the contract address, its ABI, and `sdk.provider` (which carries the SDK's network configuration and fallback RPC endpoints) to get a typed ethers `Contract` bound to the same chain as the SDK instance.

## Read from a Chainlink oracle

```typescript
import { createContract, StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  endpoints: { web3: 'https://main-rpc.io' },
})

const aggregatorV3Abi = [
  'function latestRoundData() view returns (uint80 roundId, int256 answer, uint256 startedAt, uint256 updatedAt, uint80 answeredInRound)',
  'function decimals() view returns (uint8)',
] as const

type ChainlinkOracle = {
  latestRoundData(): Promise<readonly [ bigint, bigint, bigint, bigint, bigint ]>
  decimals(): Promise<number>
}

const ethUsdOracle = createContract<ChainlinkOracle>(
  '0xChainlinkETHUSDFeedAddress',
  aggregatorV3Abi,
  sdk.provider,
)

const [ , answer ] = await ethUsdOracle.latestRoundData()
const decimals = await ethUsdOracle.decimals()

console.log(`ETH/USD = ${Number(answer) / 10 ** decimals}`)
```

Passing `sdk.provider` reuses the SDK's RPC configuration (network, fallback rotation), so a Gnosis-configured SDK automatically talks to Gnosis RPC.

## Write through a custom contract

For state-changing calls you need a signer-connected SDK. Build the contract, fetch a signer with `sdk.provider.getSigner()`, then `connect(signer)` on the returned contract:

```typescript
import { BrowserProvider } from 'ethers'
import { createContract, StakeWiseSDK, Network } from '@stakewise/v3-sdk'

const sdk = new StakeWiseSDK({
  network: Network.Mainnet,
  provider: new BrowserProvider(window.ethereum),
})

const partnerEscrowAbi = [
  'function claim(address recipient) returns (uint256)',
] as const

type PartnerEscrow = {
  claim(recipient: string): Promise<{ hash: string }>
}

const escrow = createContract<PartnerEscrow>(
  '0xPartnerEscrowAddress',
  partnerEscrowAbi,
  sdk.provider,
)

const signer = await sdk.provider.getSigner()
const signedEscrow = escrow.connect(signer) as PartnerEscrow

const tx = await signedEscrow.claim('0xRecipientAddress')
console.log('tx hash:', tx.hash)
```

## Using a different provider

`createContract` accepts any ethers provider, not just `sdk.provider`. Useful for archive nodes or cross-chain reads that bypass the SDK's RPC config:

```typescript
import { JsonRpcProvider } from 'ethers'
import { createContract } from '@stakewise/v3-sdk'

const archiveProvider = new JsonRpcProvider('https://archive-rpc.io')

const erc20 = createContract(
  '0xTokenAddress',
  [ 'function balanceOf(address) view returns (uint256)' ],
  archiveProvider,
)
```
