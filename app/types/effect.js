const Tc = require('tcomb')

const Serve = require('../effects/serve')
const ScheduleSend = require('../effects/schedule-send')
const Connect = require('../effects/connect')
const Genesis = require('../effects/genesis')
const Keys = require('../effects/keys')

const Effect = Tc.union([Serve, ScheduleSend, Connect, Genesis, Keys], 'Effect')

module.exports = Effect
