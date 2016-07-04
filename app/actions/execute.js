const ty = require('mintype')
const declare = require('../util/declare')

const Execute = declare()

module.exports = Execute

const Action = require('../types/action')

Execute.define(ty.struct('Execute', {
  action: Action
}))

Execute.prototype.update = function updateExecute (model) {
  const { action } = this
  return action.update(model)
}
