import { vaultShortFragment } from './vaultShort.graphql'

const vaultFullFragment = 'fragment VaultFull on Vault { ...VaultShort admin proof operator capacity mevEscrow createdAt feePercent rewardsRoot proofReward totalShares feeRecipient queuedShares validatorsRoot unclaimedAssets metadataIpfsHash}'.concat(vaultShortFragment)

export { vaultFullFragment }