const lib = require('./dist')

lib.actions.fetchVault({ variables: { address: '0xeefffd4c23d2e8c845870e273861e7d60df49663' } })
  .then(console.log)
