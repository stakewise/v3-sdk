import { describe } from 'vitest'

import subVaultTests from '../../../../../test/subVaultTests'


describe('addSubVault', () => {
  subVaultTests({ method: 'addSubVault', registryMethod: 'addSubVault' })
})
