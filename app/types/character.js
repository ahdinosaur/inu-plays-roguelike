const Tc = require('tcomb')

// a character is a string with length 1
const Character = Tc.refinement(
  Tc.String,
  (s) => s.length == 1,
  'Character'
)

module.exports = Character
