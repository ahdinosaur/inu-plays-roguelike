const Tc = require('tcomb')
const { pull } = require('inu')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')

const Set = require('../actions/set')

const Connect = Tc.struct({
  url: Tc.String
})

Connect.prototype.run = function runConnect (streams) {
  const effect = this

  const client = ws.connect(effect.url)

  pull(
    streams.actions(),
    pull.filterNot(Set.is),
    pullJson(client.sink)
  )

  return pull(
    pullJson(client.source),
    pull.map((model) => {
      console.log('model', model)
      return Set({ model })
    })
  )
}

module.exports = Connect
