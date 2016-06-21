const entityTypes = {
  user: {
    character: {
      code: '@'
    },
    agent: true
  },
  dirt: {
    character: {
      code: '.'
    },
    open: true,
    walkable: true
  },
  grass: {
    character: {
      code: '#'
    },
    walkable: true
  },
  wall: {
    character: {
      code: '|'
    }
  }
}

module.exports = entityTypes
