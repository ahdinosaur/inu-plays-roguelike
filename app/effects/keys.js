const Tc = require('tcomb')
const { pull } = require('inu')
const pullKeys = require('pull-keys')

const Send = require('../actions/send')
const Move = require('../actions/move')

const Keys = Tc.struct({}, 'Keys')

const keyToDirection = {
  left: [-1, 0],
  down: [0, -1],
  right: [1, 0],
  up: [0, 1]
}

Keys.prototype.run = function (actions) {
  const effect = this

  return pull(
    pullKeys({
      left: true,
      down: true,
      right: true,
      up: true
    }),
    pull.map((key) => {
      return Send({
        action: Move({
          direction: keyToDirection[key]
        })
      })
    })
  )
}

module.exports = Keys
