const Tc = require('tcomb')

const Id = require('./id')
const Vector = require('./vector')

const Entity = Tc.struct({
  id: Id,
  position: Vector,
  entityType: Tc.String
})

module.exports = Entity
