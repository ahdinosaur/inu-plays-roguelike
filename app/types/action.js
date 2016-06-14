const Tc = require('tcomb')

const Move = require('../actions/move')
const Create = require('../actions/create')
const Set = require('../actions/set')
const Join = require('../actions/join')

const Action = Tc.union([Move, Create, Set, Join], 'Action')

module.exports = Action
