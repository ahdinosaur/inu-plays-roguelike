const Tc = require('tcomb')

const Id = require('./id')
const Entity = require('./entity')

const Entities = Tc.dict(Id, Entity)

module.exports = Entities
