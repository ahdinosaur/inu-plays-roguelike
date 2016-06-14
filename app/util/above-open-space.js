module.exports = aboveOpenSpace

function aboveOpenSpace (character) {
  return character === '|'
    && character === '-'
    && character === ' '
    && character === '.'
}
