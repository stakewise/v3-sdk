import { checkAccessCommon } from '../util'
import type { SetWhitelisterInput as Input } from './types'


type CheckAccessInput = {
  userAddress: string
  vaultAddress: string
  contracts: StakeWise.Contracts
}

const handleCheckAccess = async ({ userAddress, vaultAddress, contracts }: CheckAccessInput) => {
  try {
    const vaultContract = await contracts.helpers.createPrivateVault(vaultAddress)
    const admin = await vaultContract.admin()

    return admin.toLowerCase() === userAddress.toLowerCase()
  }
  catch {
    return null
  }
}

type Action<Output> = (props: Input) => Promise<Output>

const checkAccess = <Output>(action: Action<Output>) => (
  checkAccessCommon<Input, Output>({
    action,
    check: handleCheckAccess,
    error: 'User must be the vault whitelister to perform this action',
  })
)


export default checkAccess
