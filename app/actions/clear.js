const Tc = require('tcomb')
const { keys } = require('lodash')

const Vector = require('../types/vector')
const Id = require('../types/id')
const Chunk = require('../types/chunk')
const Model = require('../types/model')

const Clear = Tc.struct({
  chunkPosition: Vector,
  entityIds: Tc.list(Id)
}, 'Clear')

Clear.prototype.update = function generateUpdate (model) {
  const action = this

  const chunk = Chunk({
    position: action.chunkPosition
  })
  const chunkId = Chunk.getId(chunk)

  const newModel = Model.update(model, {
    entities: { $remove: [action.entityIds] },
    chunks: { $remove: [chunkId] }
  })

  return { model: newModel }
}

module.exports = Clear
