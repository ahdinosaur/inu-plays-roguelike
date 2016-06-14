const Tc = require('tcomb')
const createId = require('./util/unique-id')

const Entity = Tc.struct({
  path: Path,
  character: Character
})

const keyToDirection = {
  left: [-1, 0],
  down: [0, -1],
  right: [1, 0],
  up: [0, 1]
}

const Entities = Tc.dict(Id, Entity)

function stringify (entities) {
}
