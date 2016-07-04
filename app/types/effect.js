const declare = require('../util/declare')
const union = require('../util/union')

const Effect = declare()

module.exports = Effect

const effects = require('../effects')

Effect.define(union(effects))
