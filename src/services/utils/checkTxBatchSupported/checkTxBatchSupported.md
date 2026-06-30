---
id: checkTxBatchSupported
slug: /sdk/api/utils/checktxbatchsupported
description: Use the StakeWise SDK checkTxBatchSupported utility to detect whether the connected wallet supports atomic EIP-5792 transaction batching.
---

#### Description:

Checks whether the connected wallet supports atomic EIP-5792 transaction batching (`wallet_sendCalls`) on the current network. Returns `false` when the wallet does not implement EIP-5792 or the provider is read-only.

#### Arguments:
| Name        | Type     | Required | Description      |
|-------------|----------|----------|------------------|
| userAddress | `string` | **Yes**  | The user address |

#### Returns:

```ts
type Output = boolean
```

#### Example:

```ts
const isTxBatchSupported = await sdk.utils.checkTxBatchSupported({
  userAddress: '0x...',
})
```
