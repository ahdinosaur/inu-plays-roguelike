const { start, pull, html } = require('inu')
const Tc = require('tcomb')

/*

possible characters:

- empty space: ' '
- open space: '.'
- vertical wall: '|'
- horizontal wall: '-'
- adventurer: '@'
- dragon: 'D'

*/

const Model = require('./types/model')
const State = require('./types/state')
const Action = require('./types/action')
const Effect = require('./types/effect')
const Init = require('./effects/init')

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
    effect: Init({})
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
