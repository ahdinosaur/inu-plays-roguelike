const Tc = require('tcomb')

const Id = require('./id')
const Vector = require('./vector')
const Character = require('./character')

const Entity = Tc.struct({
  id: Id,
  position: Vector,
  character: Character
})

module.exports = Entity
