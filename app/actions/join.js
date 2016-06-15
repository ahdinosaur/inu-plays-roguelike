const Tc = require('tcomb')

const Model = require('../types/model')

const Join = Tc.struct({
  client: Tc.Object
}, 'Join')

Join.prototype.update = function joinUpdate (model) {
  const newModel = Model.update(model, {
    players: { $set: model.players + 1 }
  })
  return { model: newModel }
}

module.exports = Join
