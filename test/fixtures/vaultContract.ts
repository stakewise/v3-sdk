import { vaultAddress } from '../constants'

import type { Fixture } from './types'


const vaultContract: Fixture<'vaultContract', 'sdk'> = ({ sdk }) => (
  sdk.contracts.helpers.createVault({ vaultAddress })
)


export default vaultContract
