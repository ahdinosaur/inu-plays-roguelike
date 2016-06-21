const Tc = require('tcomb')
const { pull } = require('inu')
const { assign } = require('lodash')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')
const pullNext = require('pull-next')

const actions = require('../actions')
const Action = require('../types/action')

const Connect = Tc.struct({
  url: Tc.String
})

Connect.prototype.run = function runConnect (sources) {
  const effect = this
  
  return pullNext(function () {
    const server = ws.connect(effect.url)

    const client = {
      source: pull(
        sources.actions(),
        pull.filterNot(actions.Set.is),
        pull.filterNot(actions.Execute.is),
        pull.map((action) => {
          const Type = Action.dispatch(action)
          return assign({ type: Type.meta.name }, action)
        })
      ),
      through: pull.map((action) => {
        const Type = actions[action.type]
        return actions.Execute({
          action: Type(action)
        })
      })
    }

    pull(client.source, pullJson(server.sink))

    return pull(pullJson(server.source), client.through)
  })
}

module.exports = Connect
