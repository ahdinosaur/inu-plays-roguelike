const Tc = require('tcomb')
const { keys } = require('lodash')

const Vector = require('../types/vector')
const Entities = require('../types/entities')
const Chunk = require('../types/chunk')
const Model = require('../types/model')

const Generate = Tc.struct({
  chunkPosition: Vector,
  entities: Entities
}, 'Generate')

Generate.prototype.update = function generateUpdate (model) {
  const action = this

  const chunk = Chunk({
    position: action.chunkPosition
  })

  const newModel = Model.update(model, {
    entities: { $merge: action.entities },
    chunks: { $push: [chunk] }
  })

  return { model: newModel }
}

module.exports = Generate
