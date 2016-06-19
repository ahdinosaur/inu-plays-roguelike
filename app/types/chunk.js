const Tc = require('tcomb')

const Id = require('./id')
const Vector = require('./vector')

const Chunk = Tc.struct({
  position: Vector,
  entityIds: Tc.list(Id)
})

module.exports = Chunk
