const capitalize = (string) => string.charAt(0).toUpperCase() + string.slice(1)

const decapitalize = (string) => string.charAt(0).toLowerCase() + string.slice(1)

const string = {
  capitalize,
  decapitalize,
}


module.exports = string
