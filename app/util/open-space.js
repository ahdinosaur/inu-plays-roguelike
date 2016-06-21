const { filter, sample } = require('lodash')

const entityTypes = require('../entity-types')

module.exports = getOpenSpace

// return a random open space position
function getOpenSpace (entities) {
  const openSpaces = filter(entities, (e) => {
    return e.open === true
  })
  return sample(openSpaces).position
}
