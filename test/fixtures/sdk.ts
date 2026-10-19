import { Network } from '../../src/helpers'

import createNetworkSdk from './createNetworkSdk'

import type { Fixture } from './types'


const sdk: Fixture<'sdk', 'runner'> = ({ runner }) => createNetworkSdk(Network.Mainnet, runner)


export default sdk
