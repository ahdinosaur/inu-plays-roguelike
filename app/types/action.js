const Tc = require('tcomb')
const { values } = require('lodash')

const Action = Tc.declare('Action')

module.exports = Action

const actions = require('../actions')

Action.define(Tc.union(values(actions)))
