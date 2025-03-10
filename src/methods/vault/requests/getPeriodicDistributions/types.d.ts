import type { PeriodicDistributionsQueryPayload } from '../../../../graphql/subgraph/vault'

export type ModifyPeriodicDistributionsInput = {
  data: PeriodicDistributionsQueryPayload
}

type PeriodicDistributionsPayload = Pick<PeriodicDistributionsQueryPayload['periodicDistributions'][number]>

export type ModifiedPeriodicDistributions = Array<PeriodicDistributionsPayload>

export type AggregatedPayload = {
  token: string
  apy: number
}
