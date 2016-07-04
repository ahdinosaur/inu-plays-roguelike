const ty = require('mintype')
const { assign, omit } = require('lodash')
const list = require('../util/list')

const Vector = require('../types/vector')
const Id = require('../types/id')
const Chunk = require('../types/chunk')
const Model = require('../types/model')

const Clear = ty.struct('Clear', {
  chunkPosition: Vector,
  entityIds: list(Id)
})

Clear.prototype.update = function clearUpdate (model) {
  const action = this

  const chunk = Chunk({
    position: action.chunkPosition
  })
  const chunkId = Chunk.getId(chunk)

  const newModel = assign({}, model, {
    entities: omit(model.entities, action.entityIds),
    chunks: omit(model.chunks, chunkId)
  })

  return { model: ty.create(Model, newModel) }
}

module.exports = Clear
