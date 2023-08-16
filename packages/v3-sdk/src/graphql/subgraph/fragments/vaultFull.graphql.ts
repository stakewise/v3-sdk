import { vaultShortFragment } from './vaultShort.graphql'

const vaultFullFragment = 'fragment VaultFull on Vault { ...VaultShort admin proof isErc20 capacity mevEscrow tokenName feePercent keysManager tokenSymbol rewardsRoot proofReward totalShares feeRecipient queuedShares validatorsRoot unclaimedAssets metadataIpfsHash}'.concat(vaultShortFragment)

export { vaultFullFragment }