import { Network } from '../../src/helpers'

import createNetworkSdk from './createNetworkSdk'

import type { Fixture } from './types'


const gnosisSdk: Fixture<'gnosisSdk', 'runner'> = ({ runner }) => createNetworkSdk(Network.Gnosis, runner)


export default gnosisSdk
