const ty = require('mintype')
const maybe = require('../util/maybe')

const Model = require('./model')
const Effect = require('./effect')

const State = ty.struct('State', {
  model: Model,
  effect: maybe(Effect)
})

module.exports = State
