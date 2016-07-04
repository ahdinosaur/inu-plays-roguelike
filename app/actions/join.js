const ty = require('mintype')
const assign = require('lodash/assign')

const Model = require('../types/model')

const Join = ty.struct('Join', {})

Join.prototype.update = function joinUpdate (model) {
  const newModel = assign({}, model, {
    players: model.players + 1
  })
  return { model: ty.create(Model, newModel) }
}

module.exports = Join
