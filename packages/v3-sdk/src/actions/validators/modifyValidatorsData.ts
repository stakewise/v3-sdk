import { formatEther } from 'ethers'

import { shortenAddress } from '../helpers'
import constants from '../../constants'

import { Input, Output } from './types'


const modifyValidatorsData = (data: Input): Output => {
  const validators = data?.vaults?.[0]?.validators || []

  return validators.map(({ apy, createdAt, earned, publicKey }) => ({
    apy: `${apy}%`,
    createdAt: new Date(createdAt).getTime(),
    earned: formatEther(String(earned || 0)),
    publicKey: shortenAddress(publicKey),
    link: `${constants.beaconchain}/validator/${publicKey}`,
  }))
}


export default modifyValidatorsData
