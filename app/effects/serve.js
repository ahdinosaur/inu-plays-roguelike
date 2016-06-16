const Tc = require('tcomb')
const { pull } = require('inu')
const { assign } = require('lodash')
const Pushable = require('pull-pushable')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')

const Id = require('../types/id')
const actions = require('../actions')

const Serve = Tc.struct({
  port: Tc.Number,
  server: Tc.maybe(Tc.Object),
  id: Id
}, 'Serve')

Serve.prototype.run = function (streams) {
  const effect = this
  const { port, server, id } = effect

  const pushable = Pushable((err) => {
    console.log('closing server')
    console.error(err)
  })

  const wsServer = ws
  .createServer({ server }, (client) => {
    pull(
      pullJson(client.source),
      pull.drain((action) => {
        const Type = actions[action.type]
        pushable.push(Type(assign(
          action,
          { id }
        )))
      })
    )
      
    pull(
      streams.models(),
      pullJson(client.sink)
    )

    // push join after client connects
    // to cause model to be updated
    pushable.push(actions.Join({ client }))
  })

  if (!server) {
    wsServer.listen(port)
  }

  console.log(`websocket server is listening at ws://localhost:${port}`)

  return pushable
}

module.exports = Serve
