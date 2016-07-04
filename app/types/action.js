const declare = require('../util/declare')
const union = require('../util/union')

const Action = declare()

module.exports = Action

const actions = require('../actions')

Action.define(union(actions))
