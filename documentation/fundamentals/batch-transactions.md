---
id: batch-transactions
title: Batch transactions
sidebar_position: 2
description: Bundle several StakeWise SDK operations into one atomic EIP-5792 transaction. Encode each step, collect the calls, and submit them together with wallet_sendCalls. Covers deposit, deposit + boost, boost, and unboost.
---

# Batch transactions

Modern wallets can run several contract calls as a single atomic transaction ([EIP-5792](https://eips.ethereum.org/EIPS/eip-5792)) - the user signs once and either all calls succeed or none do.

The recipe is always the same three steps:

1. **Encode** each operation with its `.encode()` form. Instead of sending, it returns transaction data `{ to, data, value? }`.
2. **Collect** those into a `calls` array, in order.
3. **Submit** the array to the wallet with `wallet_sendCalls`.

Every write method already has an `.encode()` form, so batching is just combining them.

## Check wallet support

Not every wallet can batch. Ask first with `sdk.utils.checkTxBatchSupported` and fall back to sending the calls one by one when it returns `false`.

```ts
const isTxBatchSupported = await sdk.utils.checkTxBatchSupported({ userAddress })

if (isTxBatchSupported) {
  // collect encoded calls and send batch
}
else {
  // send transactions one by one
}
```

## Send a batch

A `call` is `{ to: string, data: string, value?: bigint }`. This helper forwards an array of calls to the wallet with `wallet_sendCalls`, then polls `wallet_getCallsStatus` until the batch is mined and returns the final transaction hash.

```ts
import { StakeWiseSDK, Network } from '@stakewise/v3-sdk'


type Call = {
  to: string
  data: string
  value?: bigint
}

type SendBatchInput = {
  sdk: StakeWiseSDK
  calls: Call[]
  userAddress: string
}

const sendBatch = async ({ sdk, calls, userAddress }: SendBatchInput) => {
  const chainId = `0x${Network.Mainnet.toString(16)}`

  const sendResult = await sdk.provider.send('wallet_sendCalls', [
    {
      chainId,
      version: '2.0.0',
      from: userAddress,
      atomicRequired: true,
      calls: calls.map(({ to, data, value }) => (
        typeof value === 'bigint'
          ? { to, data, value: `0x${value.toString(16)}` }
          : { to, data }
      )),
    },
  ])

  const id = typeof sendResult === 'string' ? sendResult : sendResult.id

  let result = await sdk.provider.send('wallet_getCallsStatus', [ id ])

  while (result.status < 200) {
    await new Promise((resolve) => setTimeout(resolve, 2000))

    result = await sdk.provider.send('wallet_getCallsStatus', [ id ])
  }

  const receipts = result.receipts || []

  // status 200 means "included", not "succeeded" - an inner call can still revert, so check each receipt
  if (receipts.some(({ status }) => status === '0x0')) {
    throw new Error('Batch reverted')
  }

  return receipts[receipts.length - 1]?.transactionHash
}
```

> On Gnosis the deposit token (GNO) is an ERC-20, so any flow that deposits needs an `approve` call before the deposit. On a network with a native deposit token (ETH on Mainnet/Hoodi) the deposit carries its own `value` and no approve is required. The examples show the native-token case; on Gnosis prepend an ERC-20 `approve` of the deposit token for the vault.

## Deposit (stake)

On a network with a native deposit token (ETH on Mainnet/Hoodi) a deposit is a single call - no batch needed. On Gnosis the deposit token is an ERC-20, so a stake becomes a two-call batch whenever the vault's allowance can't cover it: approve, then deposit.

```ts
const assets = parseEther('1')

const depositToken = sdk.contracts.helpers.createErc20(sdk.config.addresses.tokens.depositToken)

// Prepend an approve only when the current allowance is short - otherwise it stays a single deposit call
const allowance = await depositToken.allowance(userAddress, vaultAddress)

const approve = allowance < assets
  ? await depositToken.approve.populateTransaction(vaultAddress, assets)
  : null

const deposit = await sdk.vault.deposit.encode({
  assets,
  userAddress,
  vaultAddress,
})

const calls = [ approve, deposit ].filter(Boolean) as Call[]

const hash = await sendBatch({ sdk, userAddress, calls })
```

Stake-and-mint batches the same way: swap `sdk.vault.deposit` for [`sdk.vault.depositAndMint`](/sdk/api/vault/transactions/depositandmint) (size the minted osToken with `getMaxMintAmount`) and prepend the same approve on Gnosis.

## Deposit and boost

Stake, mint osToken, and lock it into the Boost leverage strategy. Combine `depositAndMint` with `sdk.boost.lock.encode`, which returns the boost sub-calls - the leverage-strategy upgrade (only when required), the osToken `approve` for the strategy proxy, and the lock itself. Pass `approveParams` so the approval is emitted as a call inside the batch. Drop the empty ones with `filter(Boolean)`.

```ts
const assets = parseEther('1')

const boostShares = await sdk.osToken.getMaxMintAmount({
  userAddress,
  vaultAddress,
  additionalStakedAssets: assets,
})

const depositAndMint = await sdk.vault.depositAndMint.encode({
  assets,
  userAddress,
  vaultAddress,
  receiveShares: boostShares,
})

const { lockTxData, approveTxData, upgradeLeverageStrategyTxData } = await sdk.boost.lock.encode({
  amount: boostShares,
  userAddress,
  vaultAddress,
  approveParams: { amount: boostShares },
})

const calls = [
  upgradeLeverageStrategyTxData,
  depositAndMint,
  approveTxData,
  lockTxData,
].filter(Boolean) as Call[]

const hash = await sendBatch({ sdk, calls, userAddress })
```

## Boost (lock)

Boost an osToken position you already hold. `sdk.boost.lock.encode` gives you the upgrade, approve, and lock calls; keep the ones that are present.

```ts
const boost = await sdk.boost.lock.encode({
  amount: parseEther('1'),
  userAddress,
  vaultAddress,
})

const { lockTxData, approveTxData, upgradeLeverageStrategyTxData } = boost

const calls = [
  upgradeLeverageStrategyTxData,
  approveTxData,
  lockTxData,
].filter(Boolean) as Call[]

const hash = await sendBatch({ sdk, calls, userAddress })
```

## Unboost (unlock)

Exit part or all of a boost position. `percent` is how much of the boosted position to unlock, in `(0, 100]`. `sdk.boost.unlock.encode` returns the unlock call plus an optional strategy upgrade.

```ts
const unboost = await sdk.boost.unlock.encode({
  percent: 100,
  userAddress,
  vaultAddress,
})

const { unlockTxData, upgradeLeverageStrategyTxData } = unboost

const calls = [
  upgradeLeverageStrategyTxData,
  unlockTxData,
].filter(Boolean) as Call[]

const hash = await sendBatch({ sdk, calls, userAddress })
```

## Fallback without batching

When `checkTxBatchSupported` returns `false`, send the same steps as separate transactions with the regular methods:

- **Deposit and mint** - [sdk.vault.deposit](/sdk/api/vault/transactions/deposit) then [sdk.osToken.mint](/sdk/api/osToken/transactions/mint).
- **Deposit and boost** - [sdk.vault.deposit](/sdk/api/vault/transactions/deposit), [sdk.osToken.mint](/sdk/api/osToken/transactions/mint), then [sdk.boost.lock](/sdk/api/boost/transactions/lock).
- **Boost** - [sdk.boost.lock](/sdk/api/boost/transactions/lock).
- **Unboost** - [sdk.boost.unlock](/sdk/api/boost/transactions/unlock).

Each one waits for its own transaction (`sdk.provider.waitForTransaction`) and subgraph sync (`sdk.utils.waitForSubgraph`) before the next.
