import { parseEther } from 'ethers'

import encodeContractError from './encodeContractError'


export const vaultAddress = '0x1111111111111111111111111111111111111111'
export const userAddress = '0x2222222222222222222222222222222222222222'
export const spenderAddress = '0x4444444444444444444444444444444444444444'
export const rewardSplitterAddress = '0x5555555555555555555555555555555555555555'
export const checksumAddress = '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045'
export const mixedCaseVaultAddress = '0x820972238358b6cF37726057643A2E37749A8640'
export const lowercaseChecksumAddress = '0xd8da6bf26964af9d7eed9e03e53415d37aa96045'
export const lowercaseMixedCaseVaultAddress = '0x820972238358b6cf37726057643a2e37749a8640'
export const transactionHash = '0x000003f42fc31d56b31d2bc3c800ea3c4a7d7c09c80ca9ab90114ba337a2031f'
export const subVaultAddress = '0x7777777777777777777777777777777777777777'
export const subVaultsRegistryAddress = '0x8888888888888888888888888888888888888888'

export const mixedCaseBaseInput = {
  vaultAddress: mixedCaseVaultAddress,
  userAddress: checksumAddress,
}

export const lowercaseBaseVariables = {
  userAddress: lowercaseChecksumAddress,
  vaultAddress: lowercaseMixedCaseVaultAddress,
}

export const subgraphUrl = 'https://graphs.stakewise.io/mainnet/subgraphs/name/stakewise/prod'
export const replicaSubgraphUrl = 'https://graphs-replica.stakewise.io/mainnet/subgraphs/name/stakewise/prod'
export const gnosisSubgraphUrl = 'https://graphs.stakewise.io/gnosis/subgraphs/name/stakewise/prod'
export const backendUrl = 'https://mainnet-api.stakewise.io/graphql'

export const rpcUrl = 'http://127.0.0.1:1'
export const secondRpcUrl = 'http://127.0.0.1:2'

export const estimatedGas = 100_000n
export const sendGasLimit = estimatedGas * 110n / 100n
export const estimatedGasCost = estimatedGas * 2n

export const ltvCheckBuffer = 3n

export const stakeAmount = parseEther('10')
export const mintedShares = parseEther('6')
export const rewardPerSecond = 1_000_000_000n
export const osTokenRatePercent = 105n

export const providerRequiredMessage = 'To send this transaction, please provide BrowserProvider to the StakeWiseSDK'

export const setFeeRecipient = { method: 'setFeeRecipient', args: [ userAddress ] }
export const setFeePercent = { method: 'setFeePercent', args: [ 500 ] }

export const accessDenied = encodeContractError('AccessDenied')
export const adminRoleError = 'User must be the vault admin to perform this action'
