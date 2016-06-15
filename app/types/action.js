const Tc = require('tcomb')
const { values } = require('lodash')

const actions = require('../actions')

const Action = Tc.union(values(actions), 'Action')

module.exports = Action
