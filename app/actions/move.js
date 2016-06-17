const Tc = require('tcomb')
const map = require('lodash/map')
const filter = require('lodash/filter')
const includes = require('lodash/includes')

const atPosition = require('../util/at-position')
const Id = require('../types/id')
const Direction = require('../types/direction')
const Model = require('../types/model')

const Move = Tc.struct({
  id: Tc.maybe(Id),
  direction: Direction
}, 'Move')

Move.prototype.update = function moveUpdate (model) {
  const action = this
  const entity = model.entities[action.id]
  const newPosition = move(entity.position, action.direction)

  // if collides with wall, ignore move
  const colliders = filter(
    atPosition(model.entities, newPosition),
    (c) => !c.walkable
  )
  if (colliders.length > 0) {
    return { model }
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
