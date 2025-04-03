# New
### 1. Add SSV token to config

### 2. Add new method [sdk.vault.getPeriodicDistributions](https://sdk.stakewise.io/vault/requests/getperiodicdistributions)
Getting the periodic distribution of additional incentives

```ts
type Output = Array<{
  apy: string
  token: string
}>
```

| Name                | Description             |
|---------------------|-------------------------|
| `apy` | The average weekly apy of the distribution |
| `token` | The address of the token that is distributed |

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

#### New input:

### 3. [sdk.vault.operate](https://sdk.stakewise.io/vault/transactions/operate)

#### Add new input field:

```ts
type Output = {
  admin: string
}

```
| Name      | Description                                                  |
|-----------|--------------------------------------------------------------|
| `admin`   | Changing the vault administrator                             |
