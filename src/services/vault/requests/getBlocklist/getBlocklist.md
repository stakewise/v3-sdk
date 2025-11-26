---
id: getBlocklist
slug: /vault/requests/getblocklist
---

#### Description:

Fetch the blocklist for blocklisted vaults. Addresses included in this list are not eligible to stake in the blocklisted vault. The number of addresses in this list is indicated by the vault blocklistCount field.


#### Arguments:

| Name | Type              | Type        | Description                                                                                                                                   |
|------|-------------------|-------------|-----------------------------------------------------------------------------------------------------------------------------------------------|
| vaultAddress | `string`  | **Yes** | The address of the vault                                                                                                                      |
| addressIn | `string[]`   | **No** | Filters results to include only addresses in the provided list. Helps to check, for example, if all OFAC addresses are added to the blocklist |
| orderDirection | `'asc' \| 'desc'` | **No** | Specifies the sorting order. Defaults to `desc` (descending order)                                                                            |
| search | `string`        | **No** | Filters results by the address field                                                                                                          |
| limit | `number`         | **No** | Limits the number of addresses returned. Defaults to 100                                                                                      |
| skip | `number`          | **No** | Skips the specified number of addresses. Defaults to 0                                                                                        |

#### Returns:

```ts
type List = {
  createdAt: number
  address: string
}

type Output = {
  blocklist: List[]
}
```

| Name | Description |
|------|-------------|
| `blocklist` | An array of objects representing the result of the query based on your parameters |

#### Example:

```ts
await sdk.vault.getBlocklist({
  vaultAddress: '0x...',
})
```
