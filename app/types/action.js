const Tc = require('tcomb')

const Move = require('../actions/move')
const Create = require('../actions/create')
const Send = require('../actions/send')
const Set = require('../actions/set')
const Flush = require('../actions/flush')

const Action = Tc.union([Move, Create, Send, Set, Flush], 'Action')

module.exports = Action
