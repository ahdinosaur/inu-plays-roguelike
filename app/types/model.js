const Tc = require('tcomb')

const Entities = require('./entities')

const Model = Tc.struct({
  entities: Entities,
// viewPoint
  players: Tc.Number
})


module.exports = Model
