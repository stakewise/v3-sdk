import type {
  AggregatedPayload,
  ModifiedPeriodicDistributions,
  ModifyPeriodicDistributionsInput,
} from './types'


const modifyPeriodicDistributions = (input: ModifyPeriodicDistributionsInput): ModifiedPeriodicDistributions => {
  const { data } = input

  const distributions = data?.periodicDistributions || []

  const aggregatedData = distributions.reduce((acc: Record<string, AggregatedPayload>, { apy, token }) => {
    const numericApy = parseFloat(apy)

    if (acc[token]) {
      acc[token].apy += numericApy
    }
    else {
      acc[token] = { token, apy: numericApy }
    }

    return acc
  }, {})

  return Object.values(aggregatedData).map(item => ({
    token: item.token,
    apy: item.apy.toString(),
  }))
}


export default modifyPeriodicDistributions
