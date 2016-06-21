const Tc = require('tcomb')
const { pull } = require('inu')
const Ndarray = require('t-ndarray')
const { assign, find } = require('lodash')

const entityTypes = require('../entity-types')
const uniqueId = require('../util/unique-id')
const Id = require('../types/id')
const Create = require('../actions/create')
const Generate = require('../actions/generate')

const World = Tc.struct({
  generate: Tc.Function
}, 'World')

const chunkSize = [64, 64]

World.prototype.run = function (sources) {
  const effect = this
  const { generate } = effect

  return pull(
    sources.models(),
    pull.map((model) => {
      const chunkPosition = getChunkPosition(model.center)

      const chunk = find(model.chunks, (chunk) => {
        return chunk.position[0] === chunkPosition[0]
          && chunk.position[1] === chunkPosition[1]
      })

      console.log('find chunk', model.center, chunkPosition, chunk)

      return chunk ? null : [chunkPosition, model]
    }),
    pull.filter(),
    pull.map(([chunkPosition, model]) => {
      console.log('generate', chunkPosition)
      return Generate({
        chunkPosition,
        entities: generateChunk(generate, chunkPosition)
      })
    })
  )
}

module.exports = World

function getChunkPosition (gamePosition) {
  return [
    Math.floor(gamePosition[0] / chunkSize[0]),
    Math.floor(gamePosition[1] / chunkSize[1])
  ]
}

function getChunkBounds (chunkPosition) {
  const min = [
    chunkPosition[0] * chunkSize[0],
    chunkPosition[1] * chunkSize[1]
  ]
  const max = [
    min[0] + chunkSize[0],
    min[1] + chunkSize[1]
  ]
  return { min, max }
}

function generateChunk (generateFn, chunkPosition) {
  const entities = {}
  const bounds = getChunkBounds(chunkPosition)
  for (var x = bounds.min[0]; x < bounds.max[0]; x++) {
    for (var y = bounds.min[1]; y < bounds.max[1]; y++) {
      const entityType = generateFn(x, y)
      const id = uniqueId()
      entities[id] = assign(
        {},
        entityTypes[entityType],
        {
          id,
          position: [x, y]
        }
      )
    }
  }
  return entities
}
