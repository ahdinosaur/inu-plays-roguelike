const Tc = require('tcomb')
const forEach = require('lodash/forEach')
const filter = require('lodash/filter')
const reduce = require('lodash/reduce')
const max = require('lodash/max')
const range = require('lodash/range')
const reverse = require('lodash/reverse')

const Vector = require('./vector')
const Entities = require('./entities')
const Chunk = require('./chunk')
const entityTypes = require('../entity-types')

const Model = Tc.struct({
  center: Vector,
  size: Vector,
  entities: Entities,
  chunks: Tc.list(Chunk),
  players: Tc.Number
})

Model.stringify = function stringifyEntities (model) {
  const { center, size, entities } = model
  const strings = []
  reverse(range(center[1], size[1])).forEach((y) => {
    const rowEntities = filter(
      entities,
      (entity) => entity.position[1] === y
    )
    range(center[0], size[0]).forEach((x) => {
      const cellEntities = filter(
        rowEntities,
        (entity) => entity.position[0] === x
      )
      if (cellEntities.length > 0) {
        const topEntity = reduce(cellEntities, (sofar, next) => {
          if (sofar != null && next.character === '.') {
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

module.exports = Model
