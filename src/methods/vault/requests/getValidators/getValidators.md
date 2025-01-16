---
id: getValidators
slug: /vault/requests/getvalidators
---

#### Description:

Returns the running vault validators.

#### Arguments:

| Name | Type | Required | Description                                               |
|------|------|----------|-----------------------------------------------------------|
| vaultAddress | `string` | **Yes**  | The address of the vault                                  |
| limit | `number` | **No**   | Limits the number of validators returned. Defaults to 100 |
| skip | `number` | **No**   | Skips the specified number of validators. Defaults to 0   |

#### Returns:

```ts
type Output = {
  createdAt: number
  publicKey: string
  earned: string
  link: string
  apy: string
}
```

| Name | Description |
|------|-------------|
| `createdAt` | Date of Creation |
| `publicKey` | Validator public key |
| `earned` | Validator balance (in ETH) |
| `link` | Link to beaconchain |
| `apy` | Current validator apy |

#### Example:

```ts
await sdk.vault.getValidators({
  skip: 0,
  limit: 5,
  vaultAddress: '0x...'
})
```
