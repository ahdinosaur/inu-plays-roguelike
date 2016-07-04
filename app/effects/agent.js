const ty = require('mintype')
const { pull } = require('inu')
const { assign } = require('lodash')
const pullThrough = require('pull-through')
const pullMany = require('pull-many')

const entityTypes = require('../entity-types')

const Model = require('../types/model')
const Action = require('../types/action')
const See = require('../actions/see')
const Create = require('../actions/create')
const Id = require('../types/id')

const Agent = ty.struct('Agent', {
  id: Id
})

Agent.prototype.run = function (sources) {
  const { id } = this

  return pullMany([
    // create agent on center
    pull(
      sources.models(),
      pull.take(1),
      pull.map(model => {
        return ty.create(Create, {
          entity: assign({
            id,
            position: model.center
          }, entityTypes.agent)
        })
      })
    ),
    // execute proposals
    pull(
      sources.actions(),
      pull.filter(action => action.type === 'Propose'),
      pull.map(proposal => {
        const { action } = proposal
        const ActionType = Action.dispatch(action)
        return ty.create(ActionType, assign({}, action, { id }))
      })
    ),
    // keep seeing agent position
    pull(
      sources.models(),
      pull.map(model => model.entities[id]),
      pull.filter(),
      pull.map(agent => agent.position),
      difference(),
      pull.map(position => {
        return ty.create(See, {
          center: position
        })
      })
    )
  ])
}

module.exports = Agent

// TODO extract out into `pull-difference`
function difference () {
  var lastValue
  return pull.filter(function (value) {
    var condition = value !== lastValue
    lastValue = value
    return condition
  })
}
