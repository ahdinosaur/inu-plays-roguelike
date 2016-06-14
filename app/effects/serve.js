const Tc = require('tcomb')
const { pull } = require('inu')
const Pushable = require('pull-pushable')
const ws = require('pull-ws-server')
const cat = require('pull-cat')

const Id = require('../types/id')
const Send = require('../actions/send')

const Serve = Tc.struct({
  port: Tc.Number,
  id: Id
}, 'Serve')

Serve.prototype.run = function (actions) {
  const effect = this

  const pushable = Pushable((err) => {
    console.log('closing server')
    console.error(err)
  })

  console.log('creating server')

  const server = ws
    .createServer((client) => {
      console.log('client', client)

    /*
    pull(
      cat(
        pull.values([Flush({})]),
        stream.source
      ),
      pull.log()
      //pull.drain(pushable.push)
    )

    pull(
      actions(),
      pull.filter((action) => Send.is),
      pull.map((send) => {
        return Action.update(send.action, {
          id: { $set: effect.id }
        })
      }),
      stream.sink
    )
    */
    })
    .listen(effect.port)

  //return pushable
  return pull.empty()
}

module.exports = Serve
