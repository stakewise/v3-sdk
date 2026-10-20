import { parseEther, toQuantity } from 'ethers'

import type { Fork } from './useForkSdk'


const fundVaultAdmin = async ({ sdk, provider, snapshot }: Fork) => {
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress: snapshot.vaultAddress })
  const adminAddress = await vaultContract.admin()

  await provider.send('anvil_setBalance', [ adminAddress, toQuantity(parseEther('10')) ])

  return adminAddress
}


export default fundVaultAdmin
