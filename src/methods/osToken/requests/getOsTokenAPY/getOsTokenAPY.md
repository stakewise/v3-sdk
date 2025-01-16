---
id: getAPY
slug: /osToken/requests/getostokenapy
---

#### Description:

Current os token APY

#### Returns:

```ts
type Output = {
  apy: string
  feePercent: number
}
```

#### Example:

```ts
const apy = await sdk.osToken.getAPY()
```
---
