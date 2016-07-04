const Ty = require('mintype')

// a code is a string with length 1
const Code = Ty.compose(
  Ty.String,
  (s) => s.length == 1 ? s
    : new TypeError('Code must be 1 character long.')
)

const Character = Ty.struct('Character', {
  code: Code
})

module.exports = Character
