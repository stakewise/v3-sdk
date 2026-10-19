import { describe } from 'vitest'

import subVaultTests from '../../../../../test/subVaultTests'


describe('ejectSubVault', () => {
  subVaultTests({ method: 'ejectSubVault', registryMethod: 'ejectSubVault' })
})
