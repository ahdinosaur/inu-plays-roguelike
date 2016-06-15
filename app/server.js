const { start, pull } = require('inu')
const Tc = require('tcomb')
const pullMany = require('pull-many')

const app = require('./')
const uniqueId = require('./util/unique-id')
const Entities = require('./types/entities')
const State = require('./types/state')
const Action = require('./types/action')
const Serve = require('./effects/serve')
const Genesis = require('./effects/genesis')
const Set = require('./actions/set')

const userId = uniqueId()

const server = {
  init: () => ({
    model: {
      entities: Entities.parse([
        '-----------',
        '|.........|',
        '|.........|',
        '|.........|',
        '|.........|',
        '|.........|',
        '-----------'
      ].join('\n')),
      players: 0
    },
    effect: [
      Serve({
        id: userId,
        port: 9965
      }),
      Genesis({
        id: userId
      })
    ]
  }),
  update: app.update,
  view: app.view,
  run: app.run
}

const streams = start(server)

pull(
  streams.actions(),
  pull.log()
)

pull(
  streams.views(),
  pull.log()
)
