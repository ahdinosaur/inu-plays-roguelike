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
  httpServer: Tc.maybe(Tc.Object),
  id: Id
}, 'Serve')

Serve.prototype.run = function (streams) {
  const effect = this
  const { port, httpServer, id } = effect

  const pushable = Pushable((err) => {
    console.log('closing server')
    console.error(err)
  })

  const wsServer = ws
  .createServer({ server: httpServer }, (client) => {

    const server = {
      source: streams.models(),
      sink: pull(
        pull.drain((action) => {
          const Type = actions[action.type]
          pushable.push(Type(assign(action, { id })))
        }, (err) => {
          pushable.push(actions.Part({ client }))
        })
      )
    }

    pull(pullJson(client.source), server.sink)
    pull(server.source, pullJson(client.sink))

    // push join after client connects
    // to cause model to be updated
    pushable.push(actions.Join({ client }))
  })

  if (!httpServer) {
    wsServer.listen(port)
  }

  console.log(`websocket server is listening at ws://localhost:${port}`)

  return pushable
}

module.exports = Serve
