const Simplex = require('simplex-noise')

const entities = require('../entities')

const simplex = new Simplex()
const Noise = simplex.noise2D.bind(simplex)

module.exports = plainTerrain

function plainTerrain (options) {
  return function (x, y) {
    const noise = Noise(x, y)
    const entityType =
      noise > 0.8 ? 'wall'
      : noise > 0.4 ? 'grass'
      : 'dirt'
    return entities[entityType]
  }
}
