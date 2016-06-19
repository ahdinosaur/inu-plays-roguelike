const entityTypes = {
  agent: {
    character: '@',
    agent: true
  },
  dirt: {
    character: '.',
    open: true,
    walkable: true
  },
  grass: {
    character: '#',
    walkable: true
  },
  wall: {
    character: '|'
  }
}

module.exports = entityTypes
