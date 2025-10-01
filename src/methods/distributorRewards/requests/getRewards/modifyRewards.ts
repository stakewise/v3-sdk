// eslint-disable-next-line max-len
import { DistributorRewardsQueryPayload } from '../../../../graphql/subgraph/distributorRewards/distributorRewardsQuery.graphql'


type Output = DistributorRewardsQueryPayload['distributorClaims'][number] | null

const modifyDistributorRewards = (values: DistributorRewardsQueryPayload): Output => {
  return values.distributorClaims?.[0] || null
}


export default modifyDistributorRewards
