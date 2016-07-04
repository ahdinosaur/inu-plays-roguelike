const ty = require('mintype')
const assign = require('lodash/assign')
const filter = require('lodash/filter')
const sample = require('lodash/sample')

const Id = require('../types/id')
const Model = require('../types/model')
const Entity = require('../types/entity')

const Create = ty.struct('Create', {
  entity: Entity
})

Create.prototype.update = function createUpdate (model) {
  const action = this
  const { entity } = action

  const newModel = assign({}, model, {
    entities: assign({}, model.entities, {
      [entity.id]: ty.create(Entity, entity)
    })
  })

  return { model: ty.create(Model, newModel) }
}

module.exports = Create
