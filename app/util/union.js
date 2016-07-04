module.exports = createUnion

function createUnion (types) {
  function Union (value) {
    return Union.dispatch(value)(value)
  }

  Union.dispatch = function (value) {
    return types[value.type]
  }

  return Union
}
