const Tc = require('tcomb')
const { pull } = require('inu')
const { assign } = require('lodash')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')
const pullNext = require('pull-next')

const Action = require('../types/action')
const Set = require('../actions/set')

const Connect = Tc.struct({
  url: Tc.String
})

Connect.prototype.run = function runConnect (streams) {
  const effect = this
  
  return pullNext(function () {
    const client = ws.connect(effect.url)

    pull(
      streams.actions(),
      pull.filterNot(Set.is),
      pull.map((action) => {
        const Type = Action.dispatch(action)
        return assign({ type: Type.meta.name }, action)
      }),
      pullJson(client.sink)
    )

    return pull(
      pullJson(client.source),
      pull.map((model) => {
        return Set({ model })
      })
    )
  })
}

module.exports = Connect
