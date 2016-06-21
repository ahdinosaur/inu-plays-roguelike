const Tc = require('tcomb')
const Color = require('t-color')

// a code is a string with length 1
const Code = Tc.refinement(
  Tc.String,
  (s) => s.length == 1,
  'Code'
)

const Character = Tc.struct({
  code: Code,
  color: Tc.maybe(Color)
})

module.exports = Character
