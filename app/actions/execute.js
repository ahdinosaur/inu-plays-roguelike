const Tc = require('tcomb')

const Execute = Tc.declare('Execute')

module.exports = Execute

const Action = require('../types/action')

Execute.define(Tc.struct({
  action: Action
}))

Execute.prototype.update = function (model) {
  const { action } = this
  return action.update(model)
}
