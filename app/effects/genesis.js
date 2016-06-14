const Tc = require('tcomb')
const { pull } = require('inu')

const Id = require('../types/id')
const Create = require('../actions/create')
const Movement = require('../actions/move')

const Genesis = Tc.struct({
  id: Id
}, 'Genesis')

Genesis.prototype.run = function (actions) {
  const effect = this

  return pull.values([
    Create({ id: effect.id, character: '@' })
  ])
}

module.exports = Genesis
