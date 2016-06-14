const Tc = require('tcomb')
const { pull } = require('inu')
const pullKeys = require('pull-keys')
const cat = require('pull-cat')

const uniqueId = require('../util/unique-id')

const Create = require('../actions/create')
const Movement = require('../actions/move')

const Init = Tc.struct({}, 'Init')

const keyToDirection = {
  left: [-1, 0],
  down: [0, -1],
  right: [1, 0],
  up: [0, 1]
}

Init.prototype.run = function (actions) {
  const effect = this
  const userId = uniqueId()

  const createActions = pull.values([
    Create({ id: userId, character: '@' })
  ])

  const moveActions = pull(
    pullKeys({
      left: true,
      down: true,
      right: true,
      up: true
    }),
    pull.map((key) => {
      return Movement({
        id: userId,
        direction: keyToDirection[key]
      })
    })
  )

  return cat([createActions, moveActions])
}

module.exports = Init
