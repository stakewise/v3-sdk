import type { OperateTransactionInput as Input } from './types'

import { Role } from '../util'


const getRolesList = (values: Input) => {
  const {
    blocklist, whitelist, whitelistManager, feeRecipient, feePercent,
    blocklistManager, metadataIpfsHash, validatorsManager, admin,
  } = values

  const isAdmin = Boolean(
    admin
    || feePercent
    || feeRecipient
    || whitelistManager
    || blocklistManager
    || metadataIpfsHash
    || validatorsManager
  )
  const isWhitelistManager = Boolean(whitelist)
  const isBlocklistManager = Boolean(blocklist)

  const rolesList: Role[] = []

  if (isAdmin) {
    rolesList.push('admin')
  }
  if (isWhitelistManager) {
    rolesList.push('whitelister')
  }
  if (isBlocklistManager) {
    rolesList.push('blocklistManager')
  }

  return rolesList
}


export default getRolesList
