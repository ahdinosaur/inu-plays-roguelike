const Tc = require('tcomb')
const { values } = require('lodash')

const effects = require('../effects')

const Effect = Tc.union(values(effects), 'Effect')

module.exports = Effect
