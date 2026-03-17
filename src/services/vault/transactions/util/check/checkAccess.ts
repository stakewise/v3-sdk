import type { CheckInput } from './types'
import roles, { Role } from './roles'


type Action<Input> = (values: Input) => Promise<string>
type GetRolesList<Input> = (values: Input) => Role[]

const checkAccess = <Input extends CheckInput>(
  action: Action<Input>,
  getRolesList: Role[] | GetRolesList<Input> = [ 'admin' ]
) => (
  async (values: Input) => {
    try {
      const result = await action(values)

      return result
    }
    catch (actionError) {
      const roleList: Role[] = typeof getRolesList === 'function'
        ? getRolesList(values)
        : getRolesList

      const checkPromises = roleList.map((role) => roles[role](values))

      return Promise.all(checkPromises)
        .then(
          () => Promise.reject(actionError),
          (error) => Promise.reject(error)
        )
    }
  }
)


export default checkAccess
