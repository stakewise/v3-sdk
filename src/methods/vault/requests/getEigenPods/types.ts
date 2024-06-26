import type { EigenPodsQueryPayload } from '../../../../graphql/subgraph/eigenPods'


type EigenPodsPayload = Pick<EigenPodsQueryPayload['eigenPods'][number], 'id' | 'operator'>

export type ModifiedEigenPods = Array<EigenPodsPayload & {
  createdAt: number
  podAddress: string
  restaked: string
  link: string
}>
