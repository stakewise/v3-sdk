---
id: getAPY
slug: sdk/api/osToken/requests/getostokenapy
description: Use the StakeWise SDK getOsTokenAPY method to retrieve the current annual percentage yield and fee for osToken.
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
