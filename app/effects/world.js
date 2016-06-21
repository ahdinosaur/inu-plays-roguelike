const Tc = require('tcomb')
const { pull } = require('inu')
const Ndarray = require('t-ndarray')
const { find } = require('lodash')

const entityTypes = require('../entity-types')
const uniqueId = require('../util/unique-id')
const Id = require('../types/id')
const Create = require('../actions/create')
const Movement = require('../actions/move')

const World = Tc.struct({}, 'World')

const chunkSize = [128, 128]

World.prototype.run = function (sources) {
  const effect = this

  pull(
    sources.models(),
    pull.map((model) => {
      const chunkPosition = getChunkPosition(model.position)

      return find(model.chunks, (chunk) => {
        return chunk.position === chunkPosition
      })
    }),
    pull.filterNot(),
    pull.through(() => {
      console.log('generate more!')
    })
  )

  return pull.empty()
}

World.generateChunk = generateChunk
World.chunkSize = chunkSize

module.exports = World

function getChunkPosition (gamePosition) {
  return [
    gamePosition[0] / chunkSize[0],
    gamePosition[1] / chunkSize[1]
]
}

function getGamePosition (chunkPosition) {
  return [
    chunkPosition[0] * chunkSize[0],
    chunkPosition[1] * chunkSize[1]
  ]
}

function generateChunk (generateFn, chunkPosition) {
  const entities = {}
  const [minX, minY] = getGamePosition(chunkPosition)
  for (var x = minX; x < chunkSize[0]; x++) {
    for (var y = minY; y < chunkSize[1]; y++) {
      const entityType = generateFn(x, y)
      const id = uniqueId()
      entities[id] = Object.assign(
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
