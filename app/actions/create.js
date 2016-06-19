const Tc = require('tcomb')
const filter = require('lodash/filter')
const sample = require('lodash/sample')

const Id = require('../types/id')
const Model = require('../types/model')
const Entity = require('../types/entity')

const Create = Entity.extend({}, 'Create')

Create.prototype.update = function createUpdate (model) {
  const action = this

  const newModel = Model.update(model, {
    entities: { [action.id]: { $set: action } }
  })

  return { model: newModel }
}

module.exports = Create
