const { start, pull } = require('inu')
const Tc = require('tcomb')
const pullMany = require('pull-many')

const uniqueId = require('./util/unique-id')
const Model = require('./types/model')
const State = require('./types/state')
const Action = require('./types/action')
const Effect = require('./types/effect')
const Serve = require('./effects/serve')
const Genesis = require('./effects/genesis')
const ScheduleSend = require('./effects/schedule-send')
const Send = require('./actions/send')
const Set = require('./actions/set')

const userId = uniqueId()

const app = {
  init: () => ({
    model: Model.parse([
      '-----------',
      '|.........|',
      '|.........|',
      '|.........|',
      '|.........|',
      '|.........|',
      '-----------'
    ].join('\n')),
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
    return Model.stringify(model)
  },
  update: (model, action) => {
    const state = State(Action(action).update(model))

    // hmm, model is meant for client, ignore
    if (Send.is(action)) {
      return State({ model })
    }

    // send model to client
    // HACK assumes state does not include effect
    return State.update(state, {
      effect: { $set: ScheduleSend({
        action: Set({ model: state.model })
      }) }
    })
  },
  run: (effect, actions) => {
    // allow for array of effects
    if (Array.isArray(effect)) {
      return pullMany(effect.map((eff) => {
        return Effect(eff).run(actions)
      }))
    }
    return Effect(effect).run(actions)
  }
}

const streams = start(app)

pull(
  streams.actions(),
  pull.log()
)

pull(
  streams.views(),
  console.log()
)
