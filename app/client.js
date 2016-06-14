const { start, pull, html } = require('inu')
const Tc = require('tcomb')

const Entities = require('./types/entities')
const State = require('./types/state')
const Action = require('./types/action')
const Effect = require('./types/effect')
const Connect = require('./effects/connect')
const Set = require('./actions/set')

const app = {
  init: () => ({
    model: {
      entities: {},
      players: 1
    },
    effect: Connect({
      url: 'ws://localhost:9965'
    })
  }),
  view: (model, dispatch) => {
    return html`
      <main>
        <pre>${
          Entities.stringify(model.entities)
        }</pre>
      </main>
    `
  },
  update: (model, action) => {
    if (Set.is(action)) {
      return State(Action(action).update(model))
    }
    // otherwise ignore action
    return State({ model })
  },
  run: (effect, actions) => {
    return Effect(effect).run(actions)
  }
}

const streams = start(app)
const main = document.querySelector('main')

pull(
  streams.views(),
  pull.drain((view) => {
    html.update(main, view)
  })
)
