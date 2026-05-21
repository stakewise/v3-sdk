import checkAdminAccess from './checkAdminAccess'
import checkWhitelisterAccess from './checkWhitelisterAccess'
import checkBlocklistManagerAccess from './checkBlocklistManagerAccess'
import checkDepositDataManagerAccess from './checkDepositDataManagerAccess'


const roles = {
  admin: checkAdminAccess,
  whitelister: checkWhitelisterAccess,
  blocklistManager: checkBlocklistManagerAccess,
  depositDataManager: checkDepositDataManagerAccess,
}

export type Role = keyof typeof roles

export default roles
