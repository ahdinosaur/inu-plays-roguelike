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
  id: Id
}, 'Serve')

Serve.prototype.run = function (streams) {
  const effect = this

  const pushable = Pushable((err) => {
    console.log('closing server')
    console.error(err)
  })

  /*
  var lastModel
  pull(
    streams.models(),
    pull.drain((model) => {
      lastModel = model
    })
  )
  */

  const server = ws
  .createServer((client) => {
    pull(
      pullJson(client.source),
      pull.drain((action) => {
        const Type = actions[action.type]
        pushable.push(Type(assign(
          action,
          { id: effect.id }
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
  .listen(effect.port)

  console.log(`server is listening at ws://localhost:${effect.port}`)

  return pushable
}

module.exports = Serve
