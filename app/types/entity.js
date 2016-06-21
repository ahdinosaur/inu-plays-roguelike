const Tc = require('tcomb')

const Id = require('./id')
const Vector = require('./vector')
const Character = require('./character')

const Entity = Tc.struct({
  id: Id,
  position: Vector,
  character: Character,
  agent: Tc.Boolean,
  open: Tc.Boolean,
  walkable: Tc.Boolean
}, {
  name: 'EntityType',
  defaultProps: {
    agent: false,
    open: false,
    walkable: false
  }
})

module.exports = Entity
