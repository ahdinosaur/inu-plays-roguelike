const Tc = require('tcomb')
const { pull } = require('inu')
const { assign } = require('lodash')

const Action = require('../types/action')
const Propose = require('../actions/propose')
const Execute = require('../actions/execute')
const Id = require('../types/id')

const Agent = Tc.struct({
  id: Id
}, 'Agent')

Agent.prototype.run = function (sources) {
  const { id } = this

  return pull(
    sources.actions(),
    pull.filter(action => Propose.is(action)),
    pull.map(proposal => {
      const { action } = proposal
      const ActionType = Action.dispatch(action)
      return Execute({
        action: ActionType(assign({}, action, { id }))
      })
    })
  )
}

module.exports = Agent
