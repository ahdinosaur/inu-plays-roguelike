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
    pull.filter(Set.is),
    pullJson.stringify(),
    client.sink
  )

  return pull(
    client.source,
    pullJson.parse(),
    pull.through(console.log.bind(console)),
    pull.filter((o) => !(o instanceof Error)),
    pull.map((model) => {
      return Set({ model })
    })
  )
}

module.exports = Connect
