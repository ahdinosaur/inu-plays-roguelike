const Tc = require('tcomb')
const filter = require('lodash/filter')
const sample = require('lodash/sample')

const Id = require('../types/id')
const Character = require('../types/character')
const Model = require('../types/model')
const Vector = require('../types/vector')
const entities = require('../entities')

const Create = Tc.struct({
  id: Id,
  character: Character,
  position: Tc.maybe(Vector)
}, 'Create')

// place entity at a random open space '.'
Create.prototype.update = function createUpdate (model) {
  const action = this
  var position = action.position
  if (!position) {
    const openSpaces = filter(model.entities, (e) => e.open)
    position = sample(openSpaces).position
  }
  const entity = Object.assign(
    { id: action.id, position },
    entities.you
  )
  const newModel = Model.update(model, {
    entities: { [action.id]: { $set: entity } }
  })
  return { model: newModel }
}

module.exports = Create
