const ty = require('mintype')
const declare = require('../util/declare')

const Propose = declare()

module.exports = Propose

const Action = require('../types/action')

Propose.define(ty.struct('Propose', {
  action: Action
}))

Propose.prototype.update = (model) => ({ model })
