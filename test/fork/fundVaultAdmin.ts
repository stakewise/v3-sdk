import fundAccount from './fundAccount'
import type { Fork } from './useForkSdk'


const fundVaultAdmin = async ({ sdk, provider, snapshot }: Fork) => {
  const vaultContract = sdk.contracts.helpers.createVault({ vaultAddress: snapshot.vaultAddress })
  const adminAddress = await vaultContract.admin()

  await fundAccount(provider, adminAddress)

  return adminAddress
}


export default fundVaultAdmin
