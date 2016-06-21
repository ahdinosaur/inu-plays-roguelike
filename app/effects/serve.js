const Tc = require('tcomb')
const { pull } = require('inu')
const { assign } = require('lodash')
const Pushable = require('pull-pushable')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')

const Action = require('../types/action')
const actions = require('../actions')
const Propose = require('../actions/propose')

const Serve = Tc.struct({
  port: Tc.Number,
  httpServer: Tc.maybe(Tc.Object)
}, 'Serve')

Serve.prototype.run = function (sources) {
  const effect = this
  const { port, httpServer } = effect

  const pushable = Pushable((err) => {
    console.log('closing server')
    console.error(err)
  })

  const wsServer = ws
  .createServer({ server: httpServer }, (client) => {

    pushable.push(actions.Join({}))

    const server = {
      source: pull(
        cat([
          pull(
            sources.models(),
            pull.take(1),
            pull.map((model) => actions.Set({ model }))
          ),
          pull(
            sources.actions(),
            pull.filterNot(Propose.is)
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
          const proposal = Propose({
            action: Type(action)
          })
          pushable.push(proposal)
        }, (err) => {
          pushable.push(actions.Part({}))
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
