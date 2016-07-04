const ty = require('mintype')
const Vector = require('./vector')

const Chunk = ty.struct('Chunk', {
  position: Vector
})

module.exports = Chunk

Chunk.getId = function getChunkId (chunk) {
  return chunk.position.join('|')
}
