const Tc = require('tcomb')

const Model = require('../types/model')

const Part = Tc.struct({}, 'Part')

Part.prototype.update = function joinUpdate (model) {
  const newModel = Model.update(model, {
    players: { $set: model.players - 1 }
  })
  return { model: newModel }
}

module.exports = Part
