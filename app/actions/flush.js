const Tc = require('tcomb')

const Set = require('./set')
const ScheduleSend = require('../effects/schedule-send')

const Flush = Tc.struct({
  model: Tc.Object
})

Flush.prototype.update = function moveUpdate (model) {
  const action = this

  return {
    model,
    effect: ScheduleSend({ action: Set({ model})})
  }
}

module.exports = Flush
