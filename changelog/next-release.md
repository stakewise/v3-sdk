# New

- Upgraded Ethereum/Web3, GraphQL codegen, and TypeScript toolchain.
- Updated Rollup build system and plugins.
- Refreshed testing (Hardhat, OpenZeppelin, Jest) and linting (ESLint).
- Add new ESLint configuration and pre-push hook
- Refactor tests and improve error handling in access checks

### 1. Add new method [sdk.boost.upgradeLeverageStrategy](https://sdk.stakewise.io/boost/transactions/upgradeleveragestrategy)
Upgrade the leverage strategy contract

### 2. Add new method [sdk.boost.getLeverageStrategyData](https://sdk.stakewise.io/boost/requests/getleveragestrategydata)
Get the `leverageStrategyData` object with `version` and `isUpgradeRequired` properties.

# Updates
### 1. [sdk.boost.claimQueue](https://sdk.stakewise.io/boost/transactions/claimQueue)

#### Added new input field:

```ts
type Input = {
  leverageStrategyVersion?: 1 | 2
}
```

### 2. [sdk.boost.lock](https://sdk.stakewise.io/boost/transactions/lock)

#### Added new input field:

```ts
type Input = {
  leverageStrategyData?: {
    version: 1 | 2
    isUpgradeRequired?: boolean
  }
}
```

### 3. [sdk.boost.unlock](https://sdk.stakewise.io/boost/transactions/unlock)

#### Added new input field:

```ts
type Input = {
  leverageStrategyData?: {
    version: 1 | 2
    isUpgradeRequired?: boolean
  }
}
```

### 4. [sdk.boost.getQueuePosition](https://sdk.stakewise.io/boost/requests/getqueueposition)

#### Added new output field:

```ts
type Output = {
  version: number
}
```
