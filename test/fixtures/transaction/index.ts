import { createCheckSend, CheckSend } from './checkSend'
import { createCheckHarvest, CheckHarvest } from './checkHarvest'
import { createCheckSendList, CheckSendList } from './checkSendList'
import { createCheckEstimateGas, CheckEstimateGas } from './checkEstimateGas'
import { createCheckMulticallSend, CheckMulticallSend } from './checkMulticallSend'
import { createCheckEstimateGasList, CheckEstimateGasList } from './checkEstimateGasList'

import type { Fixture } from '../types'


export type TransactionFixture = {
  checkSend: CheckSend
  checkHarvest: CheckHarvest
  checkSendList: CheckSendList
  checkEstimateGas: CheckEstimateGas
  checkMulticallSend: CheckMulticallSend
  checkEstimateGasList: CheckEstimateGasList
}

const transaction: Fixture<'transaction', 'runner' | 'graphql'> = ({ runner, graphql }) => ({
  checkSend: createCheckSend({ runner }),
  checkHarvest: createCheckHarvest({ graphql }),
  checkSendList: createCheckSendList({ runner }),
  checkEstimateGas: createCheckEstimateGas({ runner }),
  checkMulticallSend: createCheckMulticallSend({ runner }),
  checkEstimateGasList: createCheckEstimateGasList({ runner }),
})


export default transaction
