const ty = require('mintype')

const Set = ty.struct('Set', {
  model: ty.Object
})

Set.prototype.update = function moveUpdate (model) {
  const action = this

  return { model: action.model }
}

module.exports = Set
