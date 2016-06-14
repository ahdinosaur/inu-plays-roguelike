const test = require('tape')

const uniqueId = require('../../app/util/unique-id')

const numIds = 10

test('uniqueId', function (t) {
  const ids = {}
  for (var i = 0; i < numIds; i++) {
    const id = uniqueId()
    t.notOk(ids[id], 'unique')
    ids[id] = true
  }
  t.end()
})
