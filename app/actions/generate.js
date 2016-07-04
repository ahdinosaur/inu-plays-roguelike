const ty = require('mintype')
const { assign, mapValues } = require('lodash')

const Vector = require('../types/vector')
const Entity = require('../types/entity')
const Entities = require('../types/entities')
const Chunk = require('../types/chunk')
const Model = require('../types/model')

const Generate = ty.struct('Generate', {
  chunkPosition: Vector,
  entities: Entities
})

Generate.prototype.update = function generateUpdate (model) {
  const action = this

  const chunk = ty.create(Chunk, {
    position: action.chunkPosition
  })
  const chunkId = Chunk.getId(chunk)

  const entities = mapValues(action.entities, Entity)

  const newModel = assign({}, model, {
    entities: assign({}, model.entities, entities),
    chunks: assign({}, model.chunks, {
      [chunkId]: chunk
    })
  })

  return { model: ty.create(Model, newModel) }
}

module.exports = Generate
