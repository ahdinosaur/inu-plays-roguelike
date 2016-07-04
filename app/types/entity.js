const ty = require('mintype')
const defaultProp = require('../util/default')

const Id = require('./id')
const Vector = require('./vector')
const Character = require('./character')

const Entity = ty.struct('Entity', {
  id: Id,
  position: Vector,
  character: Character,
  agent: ty.compose(defaultProp(false), ty.Boolean),
  open: ty.compose(defaultProp(false), ty.Boolean),
  walkable: ty.compose(defaultProp(false), ty.Boolean)
})

module.exports = Entity
