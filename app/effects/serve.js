const Tc = require('tcomb')
const { pull } = require('inu')
const Pushable = require('pull-pushable')
const ws = require('pull-ws-server')
const cat = require('pull-cat')
const pullJson = require('pull-json-doubleline')

const Id = require('../types/id')
const Join = require('../actions/join')
const Move = require('../actions/move')

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
        const userAction = Object.assign(action, {
          id: effect.id
        })
        pushable.push(Move(userAction))
      })
    )
      
    pull(
      streams.models(),
      pullJson(client.sink)
    )

    // push join after client connects
    // to cause model to be updated
    pushable.push(Join({ client }))
  })
  .listen(effect.port)

  console.log(`server is listening at ws://localhost:${effect.port}`)

  return pushable
}

module.exports = Serve
