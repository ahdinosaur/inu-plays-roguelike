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
  init: () => ({
    model: {
      entities: Entities.parse([
        '-----------------------------------------------------------',
        '|.........................................................|',
        '|.........................................................|',
        '|............................###..........................|',
        '|.......------.............####...........................|',
        '|.......|     |.............####..........................|',
        '|.......|     |............###............................|',
        '|.......-------.............#.............................|',
        '|.........................................................|',
        '|.........................................................|',
        '|.........................................................|',
        '|............................-----------------............|',
        '|............................|               |............|',
        '|............................|               |............|',
        '|............................|               |............|',
        '|............................-----------------............|',
        '|.........................................................|',
        '|.........................................................|',
        '|.........................................................|',
        '-----------------------------------------------------------'
      ].join('\n')),
      players: 0
    },
    effect: [
      Serve({
        id: userId,
        port: port,
        server: httpServer
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
