# New
---

# Updates
### 1. [sdk.vault.getStakeBalance](https://sdk.stakewise.io/vault/requests/getstakebalance)

#### New output:

```ts
type Output = {
  assets: bigint
  totalEarnedAssets: bigint
}
```
| Name                | Description             |
|---------------------|-------------------------|
| `assets`            | Balance in ETH          |
| `totalEarnedAssets` | Total earned rewards    |


### 2. [sdk.vault.getVault](https://sdk.stakewise.io/vault/requests/getvault)

#### Add new output item:

```ts
type Output = {
  baseApy: number
}
```
| Name      | Description                                                  |
|-----------|--------------------------------------------------------------|
| `baseApy` | The vault average weekly base APY (without extra incentives) |

### 3. Add SSV token to config
