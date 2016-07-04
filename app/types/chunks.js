const ty = require('mintype')
const Chunk = require('./chunk')

module.exports = Chunks

function Chunks (chunks) {
  if (process.env.NODE_ENV !== 'production') {
    if (typeof chunks !== 'object') {
      return TypeError('Chunks must be an object.')
    }
  }

  const typedChunks = {}
  for (var id in chunks) {
    var chunk = chunks[id]
    if (chunk.type !== 'Chunk') {
      chunk = ty.create(Chunk, chunk)
    }
    typedChunks[id] = chunk
  }
  return typedChunks
}

Chunks.has = function hasChunk (chunks, chunk) {
  const chunkId = Chunk.getId(chunk)

  return chunks[chunkId] != null
}
