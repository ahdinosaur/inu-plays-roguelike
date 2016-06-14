const Tc = require('tcomb')

const Genesis = require('../effects/genesis')
const Serve = require('../effects/serve')
const Connect = require('../effects/connect')
const Keys = require('../effects/keys')

const Effect = Tc.union([Genesis, Serve, Connect, Keys], 'Effect')

module.exports = Effect
