type ListItem = {
  address: string
  isNew: boolean
}

const validateList = (list: ListItem[]) => {
  return list.every((listItem) => (
    listItem
    && typeof listItem === 'object'
    && typeof listItem.address === 'string'
    && typeof listItem.isNew === 'boolean'
  ))
}


export default validateList
