const ty = require('mintype')

// a vector is an [x, y] array
const Vector = ty.compose(
  ty.Array,
  (array) => {
    if (process.env.NODE_ENV !== 'production') {
      return array.reduce((sofar, n) => {
        return sofar && typeof n === 'number'
      }, true) ? array
      : new TypeError('Vector must contain numbers.')
    }
    return array
  },
  (array) => {
    if (process.env.NODE_ENV !== 'production') {
      return array.length === 2 ? array
      : new TypeError('Vector must have length 2.')
    }
    return array
  }
)

module.exports = Vector
