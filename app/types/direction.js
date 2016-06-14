const Tc = require('tcomb')
const map = require('lodash/map')
const sum = require('lodash/sum')

const Vector = require('./vector')

// a direction is a unit vector
const Direction = Tc.refinement(
  Vector,
  (l) => sum(map(l, Math.abs)) === 1,
  'Direction'
)

module.exports = Direction
