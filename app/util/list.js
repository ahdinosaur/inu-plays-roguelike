const ty = require('mintype')

module.exports = list

function list (type) {
  return ty.compose(
    ty.Array,
    (array) => array.map(type)
  )
}
