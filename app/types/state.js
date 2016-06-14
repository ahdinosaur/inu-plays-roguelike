const Tc = require('tcomb')

const Model = require('./model')
const Effect = require('./effect')

const State = Tc.struct({
  model: Model,
  effect: Tc.maybe(Effect)
})

module.exports = State
