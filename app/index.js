const { start, pull, html } = require('inu')
const Tc = require('tcomb')
const pullKeys = require('pull-keys')

/*

possible characters:

- empty space: ' '
- vertical wall: '|'
- horizontal wall: '-'
- adventurer: '@'
- dragon: 'D'

*/

// a position is represented as [x, y] array
//
// a map is represented as string
//   (0, 0) is top-left
//   (width, height) is bottom-right

function get (map, [x, y]) {
  const lines = map.split('\n')
  const line = lines[y]
  const chars = line.split('')
  return chars[x]
}

function set (map, [x, y], newValue) {
  return map.split('\n').map((line, lineNum) => {
    return line.split('').map((value, charNum) => {
      if (x === charNum && y === lineNum) {
        return newValue
      }
      return value
    }).join('')
  }).join('\n')
}

function findAll (map, searchValue) {
  const positions = []
  map.split('\n').forEach((line, lineNum) => {
    line.split('').forEach((value, charNum) => {
      if (value === searchValue) {
        positions.push([charNum, lineNum])
      }
    })
  })
  return positions
}


const Model = Tc.struct({
  map: Tc.String
})

const Vector = Tc.refinement(Tc.list(Tc.Number), (l) => l.length === 2, 'Vector')
const Character = Tc.refinement(Tc.String, (s) => s.length == 1, 'Character')
const Direction = Tc.refinement(Vector, (l) => sum(l.map(Math.abs)) === 1, 'Direction')

const Movement = Tc.struct({
  position: Tc.maybe(Vector),
  character: Character,
  direction: Direction
}, 'Movement')

function move (position, direction) {
  return position.map((value, i) => value + direction[i])
}

Movement.prototype.update = function (model) {
  const action = this
  const { map } = model
  var { position, direction, character } = action
  // HACK for moving '@' via effect
  if (!position) {
    position = findAll(map, character)[0]
  }
  const premove = set(map, position, ' ')
  const postmove = set(premove, move(position, direction), character)
  return State({
    model: Model.update(model, {
      map: { $set: postmove }
    })
  })
}

// const Action = Tc.union([Movement], 'Action')
const Action = Movement

const Init = Tc.struct({}, 'Init')

const keyToDirection = {
  left: [-1, 0],
  down: [0, 1],
  right: [1, 0],
  up: [0, -1]
}

Init.prototype.run = function (actions) {
  const effect = this
  console.log('weee')
  return pull(
    pullKeys({
      left: true,
      down: true,
      right: true,
      up: true
    }),
    pull.map((key) => {
      return Movement({
        character: '@',
        direction: keyToDirection[key]
      })
    })
  )
}

// const Effect = Tc.union([Init], 'Effect')
const Effect = Init

const State = Tc.struct({
  model: Model,
  effect: Tc.maybe(Effect)
})

const app = {
  init: () => ({
    model: {
      map: [
        '-----------',
        '|    @    |',
        '|         |',
        '|         |',
        '|         |',
        '|    D    |',
        '-----------'
      ].join('\n')
    },
    effect: Init({})
  }),
  view: (model, dispatch) => {
    return html`
      <main>
        ${renderMap(model.map)}
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

function renderMap (map) {
  return html`
    <pre>${map}</pre>
  `
}

function sum (array) {
  return array.reduce(add, 0)
}

function add (a, b) { return a + b }
