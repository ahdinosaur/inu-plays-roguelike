module.exports = defaultProp

function defaultProp (defaultValue) {
  return function (value) {
    return value === undefined ? defaultValue : value
  }
}
