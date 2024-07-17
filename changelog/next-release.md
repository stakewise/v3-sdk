- Update **eslint** -> 8.56.0
- Update **node** version -> 20.12.2
- Update Backend GraphQ **url** -> "https://holesky-api.stakewise.io/graphql"
- Add removeOldFiles helper. The removeOldFiles function deletes all files with the extension .graphql.ts in subdirectories of the specified directory, if there is no corresponding file with the extension .graphql.
If the directory does not contain any .graphql files, it is deleted along with all its contents.
- Refactor **multicall** contracts. Implement new **commonMulticall**, **vaultMulticall**, **eigenPodOwnerMulticall**, **rewardSplitterMulticall**.
- Implement new logic for **encode** & **estimateGas** to all transaction methods
- Add new check access utils methods: `checkAdminAccess | checkBlocklistManagerAccess | checkDepositDataManagerAccess | checkRestakeOperatorsManagerAccess | checkWhitelisterAccess`, to more thoroughly verify access for vault transactions

# Updates

### sdk.vault.getExitQueuePositions

#### Returns:
```ts
type Output = {
  ...oldOutput,
  duration: number | null
}
```
| Name | Description |
|------|-----------------------|
| `duration` | Total queue duration time (in seconds). <br/>- It represents the approximate time after which the assets can be collected (in seconds).<br/>- If the value is null, the time is still being calculated. <br/>- If the value is 0, the assets are available and can be collected. (New*) |
---
### sdk.vault.getVault

#### Returns:
```ts
type Output = {
  ...oldOutput,
  version: number
  isRestake: boolean
  whitelistManager: string
  depositDataManager: string
  restakeOperatorsManager: string
  restakeWithdrawalsManager: string
}
```

| Name               | Description      | Status         |
|--------------------|------------------|----------------|
| `whitelister` | - | **<span style="color:red">Deprecated!</span>** |
| `vaultKeysManager` | - | **<span style="color:red">Deprecated!</span>** |
| `version` | Vault version (1 or 2) | **New** |
| `isRestake` | Indicates whether the Vault is a restaking vault | **New** |
| `whitelistManager` | Whitelist | **New** |
| `depositDataManager` | Keys | **New** |
| `restakeOperatorsManager` | If the Vault is a restaking vault, restake operators manager can add/remove restake operators    | **New** |
| `restakeWithdrawalsManager` | If the Vault is a restaking vault, restake withdrawals manager can manage EigenLayer withdrawals | **New** |
---
### sdk.vault.getMaxWithdraw

#### New arguments:
| Name | Type | Required | Info |
|------|------|-------------|-------|
| vaultAddress | `bigint` | **Yes** | Address of vault |

---
### sdk.vault.updateWhitelist **<span style="color:red">Deprecated!</span>**
#### Description:
Use **sdk.vault.operate** instead

---
### sdk.vault.updateBlocklist **<span style="color:red">Deprecated!</span>**
#### Description:
Use **sdk.vault.operate** instead

---
---
## osToken
### sdk.osToken.getBurnAmount

#### New arguments:
| Name | Type | Required | Info |
|------|------|-------------|-------|
| vaultAddress | `string` | **Yes** | Address of vault |

---
### sdk.osToken.getMaxMint

#### New arguments:
| Name | Type | Required | Info |
|------|------|-------------|-------|
| vaultAddress | `string` | **Yes** | Address of vault |

---
### sdk.osToken.getBaseData **<span style="color:red">Deprecated!</span>**
#### Description:
Use **osToken.getConfig** and **osToken.getRate**

---
### sdk.vault.getExitQueuePositions
Added positions that are not yet available for claim

#### Returns:
```ts
type ExitRequest = {
  withdrawalTimestamp: string | null
  positionTicket: string
  totalShares: string
  totalAssets: string
  timestamp: string
}

type Output = {
  ...oldOutput,
  pending: ExitRequest[]
}
```


# New
## Vault
### sdk.vault.getRewardSplitters

Fetch the list of created reward splitters. A reward splitter is a contract designed to distribute vault rewards among multiple fee recipients in predefined proportions.
To use a reward splitter, its address should be added to the vault as a fee recipient.

#### Arguments:
| Name | Type     | Type    | Description                                                                                                                                |
|------|----------|---------|--------------------------------------------------------------------------------------------------------------------------------------------|
| vaultAddress | `string` | **Yes** | The address of the vault                                                                                                                                          |
| owner | `string` | **Yes** | The owner of the reward splitter |
| rewardSplitterAddress | `string` | **No**  | The address of the reward splitter (optional)                                                                                                 |

#### Returns:
```ts
type FeeRecipient = {
  shares: bigint
  percent: number
  address: string
}

type RewardSplitter = {
  owner: string
  address: string
  totalShares: bigint
  feeRecipients: FeeRecipient[]
}

type Output = {
  rewardSplitters: RewardSplitter[]
}
```
| Name              | Description |
|-------------------|-------------|
| `rewardSplitters` | An array of objects representing the result of the query based on your parameters |                                  |
---
### sdk.vault.getEigenPods

Returns eigen pods for restake vault.

#### Arguments:
| Name | Type | Required | Description |
|------|------|----------|-------------|
| vaultAddress | `string` | **Yes**  | The address of the vault |
| limit | `number` | **No**   | Limits the number of eigen pods returned. Defaults to 100 |
| skip | `number` | **No**   | Skips the specified number of eigen pods. Defaults to 0 |

#### Returns:
```ts
type Output = {
  link: string
  owner: string
  operator: string
  restaked: string
  createdAt: number
  podAddress: string
}
```
| Name        | Description                     |
|-------------|---------------------------------|
| `createdAt` | Date of Creation                |
| `link` | Link to beaconchain             |
| `operator`  | The eigenPod's operator         |
| `podAddress`   | The eigenPod's address          |
| `restaked` | EgenPod's restaked (in ETH)      |
| `owner`        | The address of the eigen pod owner |
---

### sdk.vault.setDepositDataRoot

#### Description:

Adding root validators to vaults **version 2** or higher

#### Arguments:

| Name           | Type     | Required | Description |
|----------------|----------|----------|-------------|
| validatorsRoot | `string` | **Yes**  | The vault validators merkle tree  |
| userAddress    | `string` | **Yes**  | - |
| vaultAddress   | `string` | **Yes**  | - |

#### Example:

```ts
const params = {
  validatorsRoot: 'hash',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.setDepositDataRoot(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.setDepositDataRoot.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.setDepositDataRoot.estimateGas(params)
```
---
### sdk.vault.setDepositDataManager

#### Description:

Adding deposit data manager to vaults **version 2** or higher

#### Arguments:

| Name           | Type     | Required | Description |
|----------------|----------|----------|-------------|
| managerAddress | `string` | **Yes**  | New deposit-data manager  |
| userAddress    | `string` | **Yes**  | - |
| vaultAddress   | `string` | **Yes**  | - |

#### Example:

```ts
const params = {
  managerAddress: '0x...',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.setDepositDataManager(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.setDepositDataManager.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.setDepositDataManager.estimateGas(params)
```
---
### sdk.vault.createEigenPod

#### Description:

Adding eigen pod to the vault. Only for restake vaults and only restake operators manager can perform this action.

#### Arguments:

| Name           | Type     | Required | Description |
|----------------|----------|----------|-----------|
| userAddress    | `string` | **Yes**  | The address of the user making the request |
| vaultAddress   | `string` | **Yes**  | The address of the vault |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.createEigenPod(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.createEigenPod.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.createEigenPod.estimateGas(params)
```
---
### sdk.vault.setEigenPodOperator

#### Description:

Adding operator to the current eigen pod. This action is specific to restake vaults and can only be executed by the restake operators manager.

#### Arguments:

| Name           | Type     | Required | Description                      |
|----------------|----------|----------|----------------------------------|
| userAddress    | `string` | **Yes**  | The address of the user making the request |
| vaultAddress   | `string` | **Yes**  | The address of the vault |
| ownerAddress    | `string` | **Yes**  | The address of the eigen pod owner |
| operatorAddress    | `string` | **Yes**  | New operator for current eigen pods |

#### Example:

```ts
const params = {
  operatorAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.setEigenPodOperator(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.setEigenPodOperator.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.setEigenPodOperator.estimateGas(params)
```
---
### sdk.vault.updateEigenPodOperator

#### Description:

Update operator to the current eigen pod. This action is specific to restake vaults and can only be executed by the restake operators manager.

#### Arguments:

| Name           | Type     | Required | Description                      |
|----------------|----------|----------|----------------------------------|
| userAddress    | `string` | **Yes**  | The address of the user making the request                                 |
| vaultAddress   | `string` | **Yes**  | The address of the vault                                 |
| ownerAddress    | `string` | **Yes**  | The address of the eigen pod owner |
| operatorAddress    | `string` | **Yes**  | New operator for current eigen pods |

#### Example:

```ts
const params = {
  operatorAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.updateEigenPodOperator(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.updateEigenPodOperator.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.updateEigenPodOperator.estimateGas(params)
```
---
### sdk.vault.operate

#### Description:

Updates the vault by authorized personnel such as the vault admin, whitelistManager, blocklist manager, validators manager, or deposit-data manager.

#### Arguments:

| Name             | Type                                         | Required | Access            | Description                                                                                                                 |
|------------------|----------------------------------------------|----------|-------------------|-----------------------------------------------------------------------------------------------------------------------------|
| whitelistManager   | `Array<{ address: string, isNew: boolean }>` | **No** | whitelistManager  | List of addresses to update the whitelist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one. Max count at time - 700 addresses. |
| blocklist          | `Array<{ address: string, isNew: boolean }>` | **No** | Blocklist manager | List of addresses to update the blocklist. Use `isNew: true` to add a new address, `isNew: false` to remove an existing one. Max count at time  - 700 addresses. |
| depositDataManager | `string` | **No**  | Deposit-data manager | Address of the vault keys manager. Support only **first version** on valults. For second verion use `vault.setDepositDataManager` |
| validatorsManager  | `string` | **No**  | Admin                | Address of the vault deposit data manager. Support only **second version** on valults. |
| restakeWithdrawalsManager  | `string` | **No**  | Admin                | The restake withdrawals manager must be assigned to the wallet connected to the operator service. It is responsible for withdrawing exiting validators from the EigenLayer. |
| restakeOperatorsManager  | `string` | **No**  | Admin                | The restake operators manager can add EigenPods and update EigenLayer operators. |
| whitelistManager   | `string` | **No**  | Admin                | Address of the vault whitelistManager |
| feeRecipient       | `string` | **No**  | Admin                | Address of the vault fee recipient |
| validatorsRoot     | `string` | **No**  | Keys manager         | The vault validators merkle tree root. Support only **first version** on valults. For second verion use `vault.setDepositDataRoot` |
| blocklistManager   | `string` | **No**  | Admin                | The blocklisted vault blocklist manager |
| metadataIpfsHash   | `string` | **No**  | Admin                | The vault metadata IPFS hash |
| userAddress        | `string` | **Yes** | -                    | The address of the user making the update (admin, whitelist manager, blocklist manager or keys manager) |
| vaultAddress       | `string` | **Yes** | -                    | The address of the vault  |

#### Example:

```ts
// Data to update the vault by admin.
const params = {
  userAddress: '0x...',
  vaultAddress: '0x...',
  feeRecipient: '0x...',
  metadataIpfsHash: '...',
  validatorsRoot: '0x...',
  blocklistManager: '0x...',
  whitelistManager: '0x...',
  validatorsManager: '0x...',
  depositDataManager: '0x...',
  restakeOperatorsManager: '0x...',
  restakeWithdrawalsManager: '0x...',

}

// Data to update the vault by vault keys manager.
const params = {
  validatorsRoot: '...',
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Data to update the private vault by whitelist manager.
// The whitelist contains addresses allowed to stake or mint within
// the vault.
const params = {
  whitelist: [
    {
      address: '0x...',
      isNew: true,
    },
    {
      address: '0x...',
      isNew: false,
    },
  ],
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Data to update blocklisted vault by blocklist manager. 
// The blocklist contains addresses disallowed to stake or mint within
// the vault.
const params = {
  blocklist: [
    {
      address: '0x...',
      isNew: true,
    },
    {
      address: '0x...',
      isNew: false,
    },
  ],
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.vault.operate(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.vault.operate.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.vault.operate.estimateGas(params)
```

---
### sdk.osToken.getRate

Returns ETH - osToken rate

#### Returns:
```ts
type Output = string
```
---
### sdk.osToken.getConfig

#### Description:
Basic information on the token

#### Arguments:
| Name         | Type     | Required | Description   |
|--------------|----------|----------|---------------|
| vaultAddress | `string` | **Yes**  | Vault address |
#### Returns:
```ts
type Output = {
  ltvPercent: bigint
  thresholdPercent: bigint
}
```
| Name | Description |
|------|-------------|
| `ltvPercent` | The percent used to calculate how much user can mint OsToken shares |
| `thresholdPercent` | The liquidation threshold percent used to calculate health factor for OsToken position |
---
## RewardSplitter
### sdk.rewardSplitter.getClaimAmount

#### Description:
Calculates the amount of assets that the user can claim from the reward splitter.

#### Arguments:
| Name                  | Type     | Required | Description                                |
|-----------------------|----------|----------|--------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user making the request |
| vaultAddress          | `string` | **Yes**  | The address of the vault                   |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter         |

#### Returns:
```ts
type Output = bigint
```
---
### sdk.rewardSplitter.create

#### Description:
Creates a reward splitter contract to distribute vault rewards among multiple fee recipients in predefined proportions.
Subsequently, the address of the created reward splitter must be added to the vault as a fee recipient in order to
utilize it. Please note that only vault admin is permitted to perform this action.

#### Arguments:
| Name         | Type     | Required | Description                                                                                                                          |
|--------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| userAddress  | `string` | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin |
| vaultAddress | `string` | **Yes**  | The address of the vault                                                                                                             |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
}

// Send transaction
const hash = await sdk.rewardSplitter.create(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.create.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.create.estimateGas(params)
```
---
### sdk.rewardSplitter.claimRewards

#### Description:

Claims rewards from the reward splitter contract

#### Arguments:
| Name                  | Type     | Required | Description                                                                                                                          |
|-----------------------|----------|----------|--------------------------------------------------------------------------------------------------------------------------------------|
| userAddress           | `string` | **Yes**  | The address of the user initiating the action. This address will become the owner of the reward splitter and must be the vault admin |
| vaultAddress          | `string` | **Yes**  | The address of the vault                                                                                                             |
| rewardSplitterAddress | `string` | **Yes**  | The address of the reward splitter                                                                                                   |
| assets                | `bigint` | **Yes**  | The amount of assets to claim                                                                                                        |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
  assets: parseEther('100'),
}

// Send transaction
const hash = await sdk.rewardSplitter.claimRewards(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.claimRewards.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.claimRewards.estimateGas(params)
```
---
### sdk.rewardSplitter.updateFeeRecipients

#### Description:

Updates the reward splitter fee recipients and predefined fee splitting proportions.
Please note that only the vault admin, who is also the owner of the reward splitter, is permitted to perform this action.

#### Arguments:

| Name                  | Type                                         | Required | Description                                                                                                                                                                                                                                                                                         |
|-----------------------|----------------------------------------------|----------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| userAddress           | `string`                                     | **Yes**  | The address of the user initiating the action. It should be the vault admin, who is also the owner of the reward splitter.                                                                                                                                                                          |
| vaultAddress          | `string`                                     | **Yes**  | The address of the vault                                                                                                                                                                                                                                                                            |
| rewardSplitterAddress | `string`                                     | **Yes**  | The address of the reward splitter                                                                                                                                                                                                                                                                  |
| feeRecipients         | `Array<{ address: string, shares: bigint }>` | **Yes**  | The list of the vault fee recipients with their addresses and shares amount. For simplicity, we suggest setting the amount as a percentage converted to a BigInt value. For example, for 100% shares: `parseEther('100')`                                                                           |
| oldFeeRecipients      | `Array<{ address: string, shares: bigint }>` | **No**   | The current list of the vault fee recipients that will be updated within this action. It is needed to calculate how many shares will be added or removed from each fee recipient. If not provided, it will be requested from the [sdk.vault.getRewardSplitters](#sdkvaultgetrewardsplitters) action |

#### Example:

```ts
const params = {
  vaultAddress: '0x...',
  userAddress: '0x...',
  rewardSplitterAddress: '0x...',
  feeRecipients: [
    {
      address: '0x...1', // The fee for this address will be increased from 20% to 50%.
      shares: parseEther('50'),
    },
    {
      address: '0x...4', // This address will be added as a fee recipient with 50% fee distribution.
      shares: parseEther('50'),
    },
  ],
  oldFeeRecipients: [
    {
      address: '0x...1', // The fee for this address will be increased from 20% to 50%.
      shares: parseEther('20'),
    },
    {
      address: '0x...2', // This address will be removed from the fee recipients since it is not in the `feeRecipients` list.
      shares: parseEther('40'),
    },
    {
      address: '0x...3', // This address will also be removed from the fee recipients.
      shares: parseEther('40'),
    },
  ],
}

// Send transaction
const hash = await sdk.rewardSplitter.updateFeeRecipients(params)
// When you sign transactions on the backend (for custodians)
const { data, to } = await sdk.rewardSplitter.updateFeeRecipients.encode(params)
// Get an approximate gas per transaction
const gas = await sdk.rewardSplitter.updateFeeRecipients.estimateGas(params)
```
---
