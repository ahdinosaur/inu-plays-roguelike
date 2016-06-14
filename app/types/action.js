const Tc = require('tcomb')

const Move = require('../actions/move')
const Create = require('../actions/create')

const Action = Tc.union([Move, Create], 'Action')

module.exports = Action
