const Tc = require('tcomb')
const map = require('lodash/map')
const filter = require('lodash/filter')
const includes = require('lodash/includes')

const entityTypes = require('../entity-types')
const Id = require('../types/id')
const Direction = require('../types/direction')
const Model = require('../types/model')

const Move = Tc.struct({
  id: Tc.maybe(Id),
  direction: Direction
}, 'Move')

Move.prototype.update = function moveUpdate (model) {
  const action = this

  const agent = model.entities[action.id]
  const agentType = entityTypes[agent.entityType]
  if (!agentType.agent) return { model }

  const newPosition = move(agent.position, action.direction)

  // if collides with wall, ignore move
  const grid = Model.getGrid(model)
  const colliders = filter(
    grid.get(...newPosition),
    (c) => !entityTypes[c.entityType].walkable
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
