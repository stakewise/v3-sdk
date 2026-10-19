import { createCheckSend, CheckSend } from './checkSend'
import { createCheckEncode, CheckEncode } from './checkEncode'
import { createCheckHarvest, CheckHarvest } from './checkHarvest'
import { createCheckSendList, CheckSendList } from './checkSendList'
import { createCheckEstimateGas, CheckEstimateGas } from './checkEstimateGas'
import { createCheckMulticallSend, CheckMulticallSend } from './checkMulticallSend'
import { createCheckEstimateGasList, CheckEstimateGasList } from './checkEstimateGasList'

import type { Fixture } from '../types'


export type TransactionFixture = {
  checkSend: CheckSend
  checkEncode: CheckEncode
  checkHarvest: CheckHarvest
  checkSendList: CheckSendList
  checkEstimateGas: CheckEstimateGas
  checkMulticallSend: CheckMulticallSend
  checkEstimateGasList: CheckEstimateGasList
}

const transaction: Fixture<'transaction', 'runner' | 'graphql'> = ({ runner, graphql }) => ({
  checkSend: createCheckSend({ runner }),
  checkEncode: createCheckEncode(),
  checkHarvest: createCheckHarvest({ graphql }),
  checkSendList: createCheckSendList({ runner }),
  checkEstimateGas: createCheckEstimateGas({ runner }),
  checkMulticallSend: createCheckMulticallSend({ runner }),
  checkEstimateGasList: createCheckEstimateGasList({ runner }),
})


export default transaction
