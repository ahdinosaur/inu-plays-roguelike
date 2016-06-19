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
const Set = require('./actions/set')
const terrain = require('./terrain/plain')
const entityTypes = require('./entity-types')

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
    const generator = terrain()
    const entities = World.generateChunk(generator, [0, 0])
    const chunk = {
      position: [0, 0],
      entityIds: keys(entities)
    }
    const size = [World.chunkSize[0], World.chunkSize[1] / 4]
    const user = {
      id: userId,
      entityType: 'agent',
      position: [size[0] / 2, size[1] / 2]
    }

    console.log('entities', JSON.stringify(Object.assign(entities, {}, { [userId]: user }), null, 2).slice(0, 100))

    return {
      model: {
        entityTypes,
        entities: Object.assign({}, entities, {
          [userId]: user
        }),
        chunks: [chunk],
        center: [0, 0],
        size: [World.chunkSize[0], World.chunkSize[1] / 4],
        players: 0
      },
      effect: [
        Serve({
          id: userId,
          port,
          httpServer
        }),
        World({})
      ]
    }
  },
  update: app.update,
  view: app.view,
  run: app.run
}

const streams = start(server)

pull(
  streams.actions(),
  pull.log()
)

/*
pull(
  streams.views(),
  pull.log()
)
*/
