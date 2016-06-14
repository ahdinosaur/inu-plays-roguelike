const Tc = require('tcomb')

const Send = Tc.struct({
  action: Tc.Object
})

// send doesn't update because it's
// for the remote client / server
Send.prototype.update = function passThrough (model) {
  return { model}
}

module.exports = Send
