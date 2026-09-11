import { constants } from '../../../helpers'


const wad = constants.blockchain.amount1

const convertOsTokenSharesToAssets = (shares: bigint, osTokenRate: bigint): bigint => shares * osTokenRate / wad


export default convertOsTokenSharesToAssets
