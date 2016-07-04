module.exports = createStruct

function createStruct (name, propTypes) {
  return function Struct (props) {
    if (!(this instanceof Struct)) {
      return new Struct(props)
    }

    this.type = name

    for (var key in props) {
      const prop = props[key]
      const propType = propTypes[key]

      this[name] = propType(prop)
    }
  }
}
