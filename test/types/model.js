const test = require('tape')
const Model = require('../../app/types/model')

test('parses basic model', function (t) {
  const string = [
    '-----------',
    '|.........|',
    '|.........|',
    '|.........|',
    '|.........|',
    '|.........|',
    '-----------'
  ].join('\n')
  const scene = Model.parse(string)
  console.log('scene', scene)
  t.end()
})
