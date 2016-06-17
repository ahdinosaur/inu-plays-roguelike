const Tc = require('tcomb')
const forEach = require('lodash/forEach')
const map = require('lodash/map')
const filter = require('lodash/filter')
const reduce = require('lodash/reduce')
const values = require('lodash/values')
const max = require('lodash/max')
const range = require('lodash/range')
const reverse = require('lodash/reverse')

const uniqueId = require('../util/unique-id')
const Id = require('./id')
const Entity = require('./entity')

const Entities = Tc.dict(Id, Entity)

Entities.generate = function generateEntities (generateFn) {
  const size = [80, 25]
  const entities = {}
  for (var x = 0; x < size[0]; x++) {
    for (var y = 0; y < size[1]; y++) {
      const entity = generateFn(x, y)
      const id = uniqueId()
      entities[id] = Object.assign(
        { id, position: [x, y] }, entity
      )
    }
  }
  return entities
}

Entities.stringify = function stringifyEntities (entities) {
  const positions = map(values(entities), 'position')
  const width = max(map(positions, 0))
  const height = max(map(positions, 1))
  const strings = []
  reverse(range(height + 1)).forEach((y) => {
    const rowEntities = filter(
      entities,
      (entity) => entity.position[1] === y
    )
    range(width + 1).forEach((x) => {
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
        strings.push(topEntity.character)
      } else {
        strings.push(' ')
      }
    })
    strings.push('\n')
  })
  return strings.join('')
}

module.exports = Entities
