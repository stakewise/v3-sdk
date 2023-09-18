const { Network, AllocatorActionType, createRequests } = require('./dist')


createRequests({ network: Network.Goerli })
  .exitQueue({
    network: Network.Goerli,
    // types: [
    //   AllocatorActionType.Redeemed,
    //   AllocatorActionType.Deposited,
    //   AllocatorActionType.VaultCreated,
    //   AllocatorActionType.ExitedAssetsClaimed,
    // ],
    // skip: 0,
    // limit: 20,
    userAddress: '0x35EE7B7fEae88FE646C5a57aa7F52dB30aA2CE4F',
    vaultAddress: '0xeefffd4c23d2e8c845870e273861e7d60df49663',
  })
  .then(console.log)
  .catch(console.error)
