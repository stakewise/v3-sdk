import { MulticallV3Call } from './types'


const decodeRevert = (call: MulticallV3Call, data: string): string => {
  if (!data || data === '0x') {
    return 'empty revert data (out of gas or invalid contract address)'
  }

  try {
    const parsed = call.contract.interface.parseError(data)

    if (parsed) {
      return `${parsed.name}(${parsed.args.map(String).join(', ')})`
    }
  }
  // eslint-disable-next-line no-empty
  catch {}

  return data
}


export default decodeRevert
