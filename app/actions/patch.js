const Tc = require('tcomb')
const jiff = require('jiff')

const Patch = Tc.struct({
  patch: Tc.Any
}, 'Patch')

Patch.diff = function diffPatch (a, b) {
  return Patch({ patch: jiff.diff(a, b) })
}

Patch.prototype.update = function patchUpdate (model) {
  const { patch } = this

  return { model: jiff.patch(patch, model) }
}

module.exports = Patch
