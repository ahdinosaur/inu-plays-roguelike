const ty = require('mintype')

const Id = require('./id')
const Entity = require('./entity')

module.exports = Entities

function Entities (chunks) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof chunks !== 'object') {
      return TypeError('Entities must be an object.')
    }
  }

  const typedEntities = {}
  for (var id in chunks) {
    var chunk = chunks[id]
    if (chunk.type !== 'Entity') {
      chunk = Entity(chunk)
    }
    typedEntities[id] = chunk
  }
  return typedEntities
}

module.exports = Entities
