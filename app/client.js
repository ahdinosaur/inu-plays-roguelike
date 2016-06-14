const { start, pull, html } = require('inu')
const Tc = require('tcomb')

const Model = require('./types/model')
const State = require('./types/state')
const Action = require('./types/action')
const Effect = require('./types/effect')
const Connect = require('./effects/connect')

const app = {
  init: () => ({
    model: {
      entities: {}
    },
    effect: Connect({
      url: 'ws://localhost:9965'
    })
  }),
  view: (model, dispatch) => {
    return html`
      <main>
        <pre>${
    Model.stringify(model)
    }</pre>
      </main>
    `
  },
  update: (model, action) => {
    return State(Action(action).update(model))
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
