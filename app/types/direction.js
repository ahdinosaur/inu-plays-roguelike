const ty = require('mintype')
const assert = require('assert')

const Vector = require('./vector')

// a direction is a unit vector
const Direction = ty.compose(
  Vector,
  (vector) => {
    return Math.abs(vector[0]) + Math.abs(vector[1]) === 1
      ? vector : new TypeError('Direction must be a unit vector (Math.abs(x) + Math.abs(y) === 1)')
  }
)

module.exports = Direction
