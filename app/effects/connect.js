const Tc = require('tcomb')
const { pull } = require('inu')
const ws = require('pull-ws-server')

const Send = require('../actions/send')

const Connect = Tc.struct({
  url: Tc.String
})

Connect.prototype.run = function runConnect (actions) {
  const effect = this

  const client = ws.connect(effect.url)

  pull(
    actions(),
    pull.filter((action) => Send.is),
    pull.map((send) => send.action),
    client.sink
  )

  pull(
    client.source,
    pull.log()
  )
}

module.exports = Connect
