module.exports = maybe

function maybe (type) {
  return function (value) {
    return value === undefined
      ? value : type(value)
  }
}
