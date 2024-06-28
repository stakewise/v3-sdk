import type { EigenPodsQueryPayload } from '../../../../graphql/subgraph/eigenPods'


type EigenPodsPayload = Pick<EigenPodsQueryPayload['eigenPods'][number], | 'operator'>

export type ModifiedEigenPods = Array<EigenPodsPayload & {
  link: string
  owner: string
  restaked: string
  createdAt: number
  podAddress: string
}>
