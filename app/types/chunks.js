const Tc = require('tcomb')

const Chunk = require('./chunk')

const Chunks = Tc.dict(Tc.String, Chunk, 'Chunks')

Chunks.has = function hasChunk (chunks, chunk) {
  const chunkId = Chunk.getId(chunk)
  return chunks[chunkId] != null
}

module.exports = Chunks
