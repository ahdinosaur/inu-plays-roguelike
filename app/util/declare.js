module.exports = declare

function declare () {
  var Type

  Declaration.define = function (definition) {
    Type = definition
    Declaration.prototype = Type.prototype
    Object.keys(Type).forEach((propName) => {
      Declaration[propName] = Type[propName]
    })
  }

  return Declaration
  
  function Declaration (...args) {
    return Type(...args)
  }
}
