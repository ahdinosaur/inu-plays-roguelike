const ty = require('mintype')
const { pull } = require('inu')
const pullKeys = require('pull-keys')

const Move = require('../actions/move')

const Keys = ty.struct('Keys', {})

const keyToDirection = {
  left: [-1, 0],
  down: [0, -1],
  right: [1, 0],
  up: [0, 1]
}

Keys.prototype.run = function (sources) {
  const effect = this

  return pull(
    pullKeys({
      left: true,
      down: true,
      right: true,
      up: true
    }),
    pull.map((key) => {
      return ty.create(Move, {
        direction: keyToDirection[key]
      })
    })
  )
}

module.exports = Keys
