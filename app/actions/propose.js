const Tc = require('tcomb')

const Propose = Tc.declare('Propose')

module.exports = Propose

const Action = require('../types/action')

Propose.define(Tc.struct({
  action: Action
}))

Propose.prototype.update = (model) => ({ model })
