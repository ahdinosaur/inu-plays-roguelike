const ty = require('mintype')
const { pull } = require('inu')
const { assign } = require('lodash')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')
const pullNext = require('pull-next')

const actions = require('../actions')
const Action = require('../types/action')

const Connect = ty.struct('Connect', {
  url: ty.String
})

Connect.prototype.run = function runConnect (sources) {
  const effect = this
  
  return pullNext(function () {
    const server = ws.connect(effect.url)

    const client = {
      source: pull(
        sources.actions(),
        pull.filterNot((action) => {
          return action.type === 'Execute'
        })
      ),
      through: pull.map((action) => {
        const Type = actions[action.type]
        return ty.create(actions.Execute, {
          action: Type(action)
        })
      })
    }

    pull(client.source, pullJson(server.sink))

    return pull(pullJson(server.source), client.through)
  })
}

module.exports = Connect
