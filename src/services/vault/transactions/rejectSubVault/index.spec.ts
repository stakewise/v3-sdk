import { describe } from 'vitest'

import subVaultTests from '../../../../../test/subVaultTests'


describe('rejectSubVault', () => {
  subVaultTests({ method: 'rejectSubVault', registryMethod: 'rejectMetaSubVault' })
})
