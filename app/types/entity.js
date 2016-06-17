const Tc = require('tcomb')

const Id = require('./id')
const Vector = require('./vector')
const Character = require('./character')

const Entity = Tc.struct({
  id: Id,
  position: Vector,
  character: Character,
  open: Tc.Boolean,
  walkable: Tc.Boolean
}, {
  name: 'Entity',
  defaultProps: {
    open: false,
    walkable: false
  }
})

module.exports = Entity
