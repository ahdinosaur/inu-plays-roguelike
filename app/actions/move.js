const Tc = require('tcomb')
const map = require('lodash/map')
const includes = require('lodash/includes')

const atPosition = require('../util/at-position')
const Id = require('../types/id')
const Direction = require('../types/direction')
const Model = require('../types/model')

const Move = Tc.struct({
  id: Id,
  direction: Direction
})

Move.prototype.update = function moveUpdate (model) {
  const action = this
  const entity = model.entities[action.id]
  const newPosition = move(entity.position, action.direction)

  // if collides with wall, ignore move
  const colliders = atPosition(model.entities, newPosition)
  const colliderChars = map(colliders, 'character')
  if (
    includes(colliderChars, '|')
    || includes(colliderChars, '-')
  ) {
    return { model}
  }

  const newModel = Model.update(model, {
    entities: { [action.id]: { position: { $set: newPosition } } }
  })
  return { model: newModel }
}

module.exports = Move

function move (position, direction) {
  return map(position, ((value, i) => value + direction[i]))
}
