const Tc = require('tcomb')

const Init = require('../effects/init')

// const Effect = Tc.union([Init], 'Effect')
const Effect = Init

module.exports = Effect
