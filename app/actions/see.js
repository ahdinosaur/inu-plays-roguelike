const ty = require('mintype')
const assign = require('lodash/assign')

const Vector = require('../types/vector')
const Model = require('../types/model')

const See = ty.struct('See', {
  center: Vector
})

See.prototype.update = function seeUpdate (model) {
  const action = this

  const newModel = assign({}, model, {
    center: action.center
  })

  return { model: ty.create(Model, newModel) }
}

module.exports = See
