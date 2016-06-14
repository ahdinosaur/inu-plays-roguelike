const Tc = require('tcomb')
const { pull } = require('inu')

const Send = require('../actions/send')
const Action = require('../types/action')

const ScheduleSend = Tc.struct({
  action: Action
}, 'ScheduleSend')

ScheduleSend.prototype.run = function (actions) {
  const effect = this
  const action = effect.action

  return pull.values([
    Send({ action})
  ])
}

module.exports = ScheduleSend
