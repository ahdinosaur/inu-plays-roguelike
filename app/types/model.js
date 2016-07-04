const ty = require('mintype')
const forEach = require('lodash/forEach')
const filter = require('lodash/filter')
const reduce = require('lodash/reduce')
const max = require('lodash/max')
const range = require('lodash/range')
const reverse = require('lodash/reverse')
const Ndarray = require('ndarray')
const { createSelector } = require('reselect')

const Vector = require('./vector')
const Chunks = require('./chunks')
const Entities = require('./entities')

const Model = ty.struct('Model', {
  entities: Entities,
  chunks: Chunks,
  center: Vector,
  size: Vector,
  players: ty.Number
})

Model.stringify = function stringifyEntities (model) {
  const { entities, center, size } = model
  const grid = getGrid(model)
  const strings = []

  const min = [center[0] - size[0] / 2, center[1] - size[1] / 2]
  const max = [center[0] + size[0] / 2, center[1] + size[1] / 2]

  reverse(range(min[1], max[1])).forEach((y) => {
    range(min[0], max[0]).forEach((x) => {
      const cellEntities = grid.get(x, y)
      if (cellEntities != null && cellEntities.length > 0) {
        const topEntity = reduce(cellEntities, (sofar, next) => {
          if (sofar != null && next.character.code === '.') {
            return sofar
          }
          return next
        })
        strings.push(topEntity.character.code)
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
    const grid = Ndarray(new Array(size[0] * size[1]), size)

    const min = [center[0] - size[0] / 2, center[1] - size[1] / 2]
    const max = [center[0] + size[0] / 2, center[1] + size[1] / 2]

    forEach(entities, entity => {
      const pos = entity.position
      if (
        between(pos[0], min[0], max[0])
        && between(pos[1], min[1], max[1])
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
  return value >= min && value < max
}
