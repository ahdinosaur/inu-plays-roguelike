const { start, pull } = require('inu')
const Tc = require('tcomb')
const pullMany = require('pull-many')

const uniqueId = require('./util/unique-id')
const Entities = require('./types/entities')
const State = require('./types/state')
const Action = require('./types/action')
const Effect = require('./types/effect')
const Serve = require('./effects/serve')
const Genesis = require('./effects/genesis')
const Set = require('./actions/set')

const userId = uniqueId()

const app = {
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
  view: (model, dispatch) => {
    return Entities.stringify(model.entities)
  },
  update: (model, action) => {
    return State(Action(action).update(model))
  },
  run: (effect, streams) => {
    // allow for array of effects
    if (Array.isArray(effect)) {
      return pullMany(effect.map((eff) => {
        return Effect(eff).run(streams)
      }))
    }
    return Effect(effect).run(streams)
  }
}

const streams = start(app)

pull(
  streams.actions(),
  pull.log()
)

pull(
  streams.views(),
  pull.log()
)
