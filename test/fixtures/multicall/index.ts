import { createCheckSend, CheckSend } from './checkSend'
import { createCheckCallStatic, CheckCallStatic } from './checkCallStatic'
import { createCheckEstimateGas, CheckEstimateGas } from './checkEstimateGas'
import { createCheckTransactionData, CheckTransactionData } from './checkTransactionData'

import type { Fixture } from '../types'


export type MulticallFixture = {
  checkSend: CheckSend
  checkCallStatic: CheckCallStatic
  checkEstimateGas: CheckEstimateGas
  checkTransactionData: CheckTransactionData
}

const multicall: Fixture<'multicall', 'runner'> = ({ runner }) => ({
  checkSend: createCheckSend({ runner }),
  checkCallStatic: createCheckCallStatic({ runner }),
  checkEstimateGas: createCheckEstimateGas({ runner }),
  checkTransactionData: createCheckTransactionData({ runner }),
})


export default multicall
