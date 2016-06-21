const Tc = require('tcomb')

const Vector = require('../types/vector')
const Model = require('../types/model')

const See = Tc.struct({
  center: Vector
}, 'See')

See.prototype.update = function seeUpdate (model) {
  const action = this

  const newModel = Model.update(model, {
    center: { $set: action.center }
  })

  return { model: newModel }
}

module.exports = See
