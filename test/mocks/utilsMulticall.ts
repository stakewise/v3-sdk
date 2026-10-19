import { setFeePercent, spenderAddress } from '../constants'


export const metadata = 'ipfs://QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'

export const setAdmin = { method: 'setAdmin', args: [ spenderAddress ] }
export const setMetadata = { method: 'setMetadata', args: [ metadata ] }

export const multicallParams = [ setAdmin, setMetadata, setFeePercent ]

export const multicallNames = [ 'updateState', 'setAdmin', 'setMetadata', 'setFeePercent' ]
export const multicallArgs = [ [ spenderAddress ], [ metadata ], [ 500n ] ]
