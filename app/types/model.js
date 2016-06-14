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
const Entities = require('./entities')
const aboveOpenSpace = require('../util/above-open-space')

const Model = Tc.struct({
  entities: Entities
// viewPoint
})

Model.parse = function parseModel (string) {
  const lines = string.split('\n')
  const height = lines.length
  const entities = {}
  lines.forEach((line, lineNum) => {
    const chars = line.split('')
    chars.forEach((character, charNum) => {
      const position = [charNum, height - lineNum - 1]
      const entity = {
        id: uniqueId(),
        position,
      character}
      entities[entity.id] = entity

      if (aboveOpenSpace(entity.character)) {
        const openSpace = {
          id: uniqueId,
          position,
          character: '.'
        }
        entities[openSpace.id] = openSpace
      }
    })
  })
  return Model({ entities})
}

Model.stringify = function stringifyModel (model) {
  const { entities } = model
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

module.exports = Model
