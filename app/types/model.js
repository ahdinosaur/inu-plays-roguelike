const Tc = require('tcomb')
const forEach = require('lodash/forEach')
const filter = require('lodash/filter')
const reduce = require('lodash/reduce')
const max = require('lodash/max')
const range = require('lodash/range')
const reverse = require('lodash/reverse')
const Ndarray = require('t-ndarray')
const { createSelector } = require('reselect')

const Vector = require('./vector')
const Entities = require('./entities')
const Chunk = require('./chunk')
const entityTypes = require('../entity-types')

const Model = Tc.struct({
  entities: Entities,
  chunks: Tc.list(Chunk),
  center: Vector,
  size: Vector,
  players: Tc.Number
})

Model.stringify = function stringifyEntities (model) {
  const { entities, center, size } = model
  const grid = getGrid(model)
  const strings = []
  reverse(range(center[1], size[1])).forEach((y) => {
    range(center[0], size[0]).forEach((x) => {
      const cellEntities = grid.get(x, y)
      if (cellEntities.length > 0) {
        const topEntity = reduce(cellEntities, (sofar, next) => {
          const nextEntityType = entityTypes[next.entityType]
          if (sofar != null && nextEntityType.character === '.') {
            return sofar
          }
          return next
        })
        const topEntityType = entityTypes[topEntity.entityType]
        strings.push(topEntityType.character)
      } else {
        strings.push(' ')
      }
    })
    strings.push('\n')
  })
  return strings.join('')
}

const getEntities = (model) => model.entities
const getCenter = (model) => model.center
const getSize = (model) => model.size

const getGrid = createSelector(
  getEntities, getCenter, getSize,
  (entities, center, size) => {
    const grid = Ndarray({
      data: new Array(size[0] * size[1]),
      shape: size,
      stride: [size[1], 1],
      offset: 0
    })

    forEach(entities, entity => {
      const pos = entity.position
      if (
        between(pos[0], center[0], center[0] + size[0])
        && between(pos[1], center[1], center[1] + size[1])
      ) {
        pushToGrid(pos, entity)
      }
    })

    function pushToGrid ([x, y], value) {
      var cellEntities = grid.get(x, y)
      if (!Array.isArray(cellEntities)) {
        cellEntities = []
      }
      cellEntities.push(value)
      grid.set(x, y, cellEntities)
    }

    return grid
  }
)

Model.getGrid = getGrid

module.exports = Model

function between (value, min, max) {
  return value >= min && value <= max
}
