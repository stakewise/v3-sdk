const capitalize = (string: string) => string.charAt(0).toUpperCase() + string.slice(1)

const decapitalize = (string: string) => string.charAt(0).toLowerCase() + string.slice(1)


export default {
  capitalize,
  decapitalize,
}
