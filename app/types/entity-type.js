const Tc = require('tcomb')

const Character = require('./character')

const EntityType = Tc.struct({
  character: Character,
  open: Tc.Boolean,
  walkable: Tc.Boolean
}, {
  name: 'EntityType',
  defaultProps: {
    open: false,
    walkable: false
  }
})

module.exports = EntityType
