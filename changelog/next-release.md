## Added methods

- [sdk.vault.getPositionData](https://docs.stakewise.io/sdk/api/vault/requests/getpositiondata)
- [sdk.vault.getStakerRewards](https://docs.stakewise.io/sdk/api/vault/requests/getstakerrewards)
- [sdk.vault.helpers.calculateStakerPosition](https://docs.stakewise.io/sdk/api/vault/helpers/calculatestakerposition)
- [sdk.vault.helpers.calculateAllocatorPosition](https://docs.stakewise.io/sdk/api/vault/helpers/calculateallocatorposition)
- [sdk.osToken.redeemerWithdraw](https://docs.stakewise.io/sdk/api/osToken/transactions/redeemerwithdraw)
- [sdk.osToken.claimRedeemerExitQueue](https://docs.stakewise.io/sdk/api/osToken/transactions/claimredeemerexitqueue)
- [sdk.osToken.getRedeemerExitQueuePositions](https://docs.stakewise.io/sdk/api/osToken/requests/getredeemerexitqueuepositions)
- [sdk.utils.getSubgraphStatus](https://docs.stakewise.io/sdk/api/utils/getsubgraphstatus)

## Modified methods

### 1. [sdk.vault.getVault](https://docs.stakewise.io/sdk/api/vault/requests/getvault)

#### Add new output field:
```ts
type Output = {
  isStateUpdateRequired: boolean
}
```

Indicates whether the meta vault state is out of sync with the latest rewards nonce

## Modified helpers

### 1. sdk.contracts.helpers.createMulticall

#### Add new optional call field:
```ts
type Call = {
  allowFailure?: boolean
}
```

Lets a single call revert without reverting the whole batch. The batch simulation no longer throws for
such a call, and its result is omitted from the decoded output. Intended for permissionless calls that
another party may have already performed — the user gets a successful transaction instead of a revert

### 2. sdk.contracts.helpers.createMulticall

When created with a signer, the batch is sent with a gas limit of the estimate plus 30%

## Gas limit

Every transaction method now sends the transaction with a gas limit of the estimate plus 10%
(`osToken.burn` keeps 30%). Before, only the methods built on the own multicalls had the margin,
the direct contract calls (`vault.deposit` and `vault.depositAndMint` with the native token, `vault.updateState`,
`vault.createVault`, `osToken.redeemerWithdraw`, `distributorRewards.claim` and others) were sent with the bare estimate.

## Contract errors

The errors thrown by the transaction methods keep the `code`, `reason` and `shortMessage` fields of the ethers error,
so a wallet rejection can be detected by `code === 'ACTION_REJECTED'`

## Added helpers

- `sendWithGasMargin(method, args, percent?)` — sends a contract method with a gas limit of the estimate plus `percent`
(10% by default) and wraps the errors into `ContractError`

## Subgraph indexing errors

### 1. New SDK constructor options

```ts
type Options = {
  allowSubgraphError?: boolean
  onSubgraphError?: (event: SubgraphErrorEvent) => void
}

type SubgraphErrorEvent = {
  url: string
  operationName: string
  variables?: unknown
  errors: Array<{ message: string }>
  isAllowed: boolean
}
```

- `allowSubgraphError` — adds `subgraphError: allow` to every subgraph request, so the methods return data even if
the subgraph has indexing errors. Defaults to `false`: requests fail with `indexing_error` as before.
With `true` the data may be inconsistent: entity changes from the failed handlers are missing
- `onSubgraphError` — called when the subgraph responds with indexing errors, in both modes. `isAllowed` is `true`
if the data was returned to the caller and `false` if the request was rejected. Errors thrown inside the handler are ignored,
the handler is called once per network request

## Added exports

- `applySubgraphErrorPolicy(query, subgraphError?)` — adds `subgraphError: allow` to every root field of a GraphQL query
(except `_meta` and `__typename`), returns the query unchanged for `deny`
- `getRequestUrl(urls)` — returns the url for a request: the primary one, or the backup one if the primary is marked as failed
- `saveErrorUrlToSessionStorage(url)` — marks the url as failed for an hour, the following requests go to the backup url
- `SubgraphErrorEvent`, `SubgraphErrorPolicy` types
