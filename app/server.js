const { start, pull } = require('inu')
const Tc = require('tcomb')
const pullMany = require('pull-many')
const { keys } = require('lodash')

const app = require('./')
const uniqueId = require('./util/unique-id')
const openSpace = require('./util/open-space')
const Entities = require('./types/entities')
const State = require('./types/state')
const Action = require('./types/action')
const Serve = require('./effects/serve')
const World = require('./effects/world')
const Agent = require('./effects/agent')
const Set = require('./actions/set')
const terrain = require('./terrain/plain')

const userId = uniqueId()

var httpServer
const isProd = process.env.NODE_ENV === 'production'
const port = process.env.PORT || 9965
if (isProd) {
  const http = require('http')
  const ecstatic = require('ecstatic')

  httpServer = http.createServer(
    ecstatic(__dirname)
  ).listen(port)

  console.log(`http server is listening at http://localhost:${port}`)
}

const server = {
  init: () => {
    return {
      model: {
        entities: {},
        chunks: [],
        center: [0, 0],
        size: [128, 32],
        players: 0
      },
      effect: [
        Serve({
          id: userId,
          port,
          httpServer
        }),
        World({
          generate: terrain()
        }),
        Agent({
          id: userId
        })
      ]
    }
  },
  update: app.update,
  view: app.view,
  run: app.run
}

const streams = start(server)
