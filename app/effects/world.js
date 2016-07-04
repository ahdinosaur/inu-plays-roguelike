const ty = require('mintype')
const { pull } = require('inu')
const { assign, forEach, map, filter, find } = require('lodash')
const pullThrough = require('pull-through')

const entityTypes = require('../entity-types')
const uniqueId = require('../util/unique-id')
const Id = require('../types/id')
const Create = require('../actions/create')
const Generate = require('../actions/generate')
const Clear = require('../actions/clear')
const Chunk = require('../types/chunk')
const Chunks = require('../types/chunks')
const Model = require('../types/model')

const World = ty.struct('World', {
  generate: ty.Function
})

const chunkSize = [64, 64]
const addChunkDistance = 1
const removeChunkDistance = 2

World.prototype.run = function (sources) {
  const effect = this
  const { generate } = effect

  var lastCenter
  return pull(
    sources.models(),
    pull.map((model) => {
      // TODO re-use difference function elsewhere
      if (model.center == lastCenter) return
      lastCenter = model.center
      return model
    }),
    pull.filter(),
    pull.map((model) => {

      const chunkPosition = getChunkPosition(model.center)

      const haveChunks = map(
        nearby(chunkPosition, addChunkDistance),
        (position) => ty.create(Chunk, { position })
      )
      const addChunks = filter(
        haveChunks,
        (chunk) => !Chunks.has(model.chunks, chunk)
      )

      const removeChunks = filter(
        map(
          nearby(chunkPosition, removeChunkDistance),
          (position) => ty.create(Chunk, { position })
        ),
        (chunk) => {
          return Chunks.has(model.chunks, chunk)
            && !find(haveChunks, (addChunk) => {
              return addChunk.position[0] === chunk.position[0]
                && addChunk.position[1] === chunk.position[1]
            })
        }
      )

      return [model, { add: addChunks, remove: removeChunks }]
    }),
    pullThrough(function ([model, changes]) {
      const queue = this.queue
      forEach(changes.add, (chunk) => {
        queue(ty.create(Generate, {
          chunkPosition: chunk.position,
          entities: generateChunk(generate, chunk.position)
        }))
      })
      forEach(changes.remove, (chunk) => {
        queue(ty.create(Clear, {
          chunkPosition: chunk.position,
          entityIds: clearChunk(model, chunk.position)
        }))
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

function clearChunk (model, chunkPosition) {
  const grid = Model.getGrid(model)
  var entityIds = []
  const bounds = getChunkBounds(chunkPosition)
  for (var x = bounds.min[0]; x < bounds.max[0]; x++) {
    for (var y = bounds.min[1]; y < bounds.max[1]; y++) {
      const entities = grid.get(x, y)
      if (entities) {
        entityIds = entityIds.concat(map(entities, 'id'))
      }
    }
  }
  return entityIds
}

function nearby (current, distance) {
  var x = current[0]
  var y = current[1]
  var dist = distance
  var nearby = []
  for (var cx = (x - dist); cx !== (x + dist); ++cx) {
    for (var cy = (y - dist); cy !== (y + dist); ++cy) {
      nearby.push([cx, cy])
    }
  }
  return nearby
}
