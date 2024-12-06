---
id: getTransactions
slug: /utils/gettransactions
---

#### Description:

Retrieving a transaction to verify that the data went into the subgraph after the transaction

#### Arguments:

| Name | Type     | Required | Description      |
|------|----------|----------|------------------|
| hash | `string` | **Yes**  | Transaction hash |

#### Returns:

```ts
type Output = Array<{
  id: string
}>
```

#### Example:

```ts
await sdk.utils.getTransactions({ hash: '0x...' })
```
