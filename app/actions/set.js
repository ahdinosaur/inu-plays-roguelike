const Tc = require('tcomb')

const Set = Tc.struct({
  model: Tc.Object
}, 'Set')

Set.prototype.update = function moveUpdate (model) {
  const action = this

  return { model: action.model }
}

module.exports = Set
