const Tc = require('tcomb')
const { pull } = require('inu')
const { assign } = require('lodash')
const Pushable = require('pull-pushable')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')
const pullPairs = require('pull-pairs')

const Id = require('../types/id')
const Action = require('../types/action')
const actions = require('../actions')

const Serve = Tc.struct({
  port: Tc.Number,
  httpServer: Tc.maybe(Tc.Object),
  id: Id
}, 'Serve')

Serve.prototype.run = function (sources) {
  const effect = this
  const { port, httpServer, id } = effect

  const pushable = Pushable((err) => {
    console.log('closing server')
    console.error(err)
  })

  const wsServer = ws
  .createServer({ server: httpServer }, (client) => {

    pushable.push(actions.Join({ client }))

    const server = {
      source: pull(
        cat([
          pull(
            sources.models(),
            pull.take(1),
            pull.map((model) => actions.Set({ model }))
          ),
          pull(
            sources.models(),
            pullPairs((a, b) => {
              if (a != null) {
                return actions.Patch.diff(a, b)
              }
            })
          )
        ]),
        pull.map((action) => {
          const Type = Action.dispatch(action)
          return assign({ type: Type.meta.name }, action)
        })
      ),
      sink: pull(
        pull.drain((action) => {
          const Type = actions[action.type]
          pushable.push(Type(assign(action, { id })))
        }, (err) => {
          pushable.push(actions.Part({ client }))
        })
      )
    }

    pull(client, pullJson(server), client)
  })

  if (!httpServer) {
    wsServer.listen(port)
  }

  console.log(`websocket server is listening at ws://localhost:${port}`)

  return pushable
}

module.exports = Serve
