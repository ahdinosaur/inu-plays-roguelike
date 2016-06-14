// from https://github.com/UXtemple/mini-unique-id/
module.exports = uniqueId

var id = 1
function uniqueId () {
  return `${id++}`
}
