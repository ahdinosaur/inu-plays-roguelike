const filter = require('lodash/filter')

module.exports = atPosition

function atPosition (entities, position) {
  return filter(entities, (entity) => {
    return entity.position[0] === position[0]
    && entity.position[1] === position[1]
  })
}
