const Tc = require('tcomb')

const State = Tc.struct({
  model: Model,
  effect: Tc.maybe(Effect)
})

module.exports = State
