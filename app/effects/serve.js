const ty = require('mintype')
const { pull } = require('inu')
const { assign } = require('lodash')
const Pushable = require('pull-pushable')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')

const maybe = require('../util/maybe')
const Action = require('../types/action')
const actions = require('../actions')

const Serve = ty.struct('Serve', {
  port: ty.Number,
  httpServer: maybe(ty.Object)
})

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
      source: cat([
        pull(
          sources.models(),
          pull.take(1),
          pull.map((model) => ty.create(actions.Set, { model }))
        ),
        pull(
          sources.actions(),
          pull.filterNot((action) => {
            return action.type === 'Propose'
          })
        )
      ]),
      sink: pull.drain((action) => {
        const Type = Action.dispatch(action)
        pushable.push(ty.create(actions.Propose, {
          action: Type(action)
        }))
      }, (err) => {
        pushable.push(ty.create(actions.Part, {}))
      })
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
