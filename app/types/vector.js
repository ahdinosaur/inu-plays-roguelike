const Tc = require('tcomb')

// a vector is an [x, y] array
const Vector = Tc.refinement(
  Tc.list(Tc.Number),
  (p) => p.length === 2,
  'Vector'
)

module.exports = Vector
