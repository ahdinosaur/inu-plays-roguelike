const Tc = require('tcomb')
const { pull } = require('inu')
const { assign } = require('lodash')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')

const Action = require('../types/action')
const Set = require('../actions/set')

const Connect = Tc.struct({
  url: Tc.String
})

Connect.prototype.run = function runConnect (streams) {
  const effect = this

  const server = ws.connect(effect.url)

  const client = {
    source: pull(
      streams.actions(),
      pull.filterNot(Set.is),
      pull.map((action) => {
        const Type = Action.dispatch(action)
        return assign({ type: Type.meta.name }, action)
      })
    ),
    through: pull(
      pull.map((model) => {
        return Set({ model })
      })
    )
  }

  pull(client.source, pullJson(server.sink))

  return pull(pullJson(server.source), client.through)
}

module.exports = Connect
