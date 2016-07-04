const ty = require('mintype')
const assign = require('lodash/assign')
const map = require('lodash/map')
const filter = require('lodash/filter')
const includes = require('lodash/includes')
const maybe = require('../util/maybe')

const Id = require('../types/id')
const Direction = require('../types/direction')
const Entity = require('../types/entity')
const Model = require('../types/model')

const Move = ty.struct('Move', {
  id: maybe(Id),
  direction: Direction
})

Move.prototype.update = function moveUpdate (model) {
  const action = this

  const agent = model.entities[action.id]
  if (!agent.agent) return { model }

  const newPosition = move(agent.position, action.direction)

  // if collides with wall, ignore move
  const grid = Model.getGrid(model)
  const colliders = filter(
    grid.get(...newPosition),
    (c) => !c.walkable
  )
  if (colliders.length > 0) {
    return { model }
  }
  
  const oldEntity = model.entities[action.id]
  const newEntity = assign({}, oldEntity, {
    position: newPosition
  })
  const newModel = assign({}, model, {
    entities: assign({}, model.entities, {
      [action.id]: ty.create(Entity, newEntity)
    })
  })
  return { model: ty.create(Model, newModel) }
}

module.exports = Move

function move (position, direction) {
  return map(position, ((value, i) => value + direction[i]))
}
