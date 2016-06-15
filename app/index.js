const pullMany = require('pull-many')

const State = require('./types/state')
const Action = require('./types/action')
const Entities = require('./types/entities')
const Effect = require('./types/effect')

const app = {
  update: (model, action) => {
    return State(Action(action).update(model))
  },

  view: (model, dispatch) => {
    return Entities.stringify(model.entities)
      + `players: ${model.players}`
  },

  run: (effect, streams) => {
    // allow for array of effects
    if (Array.isArray(effect)) {
      return pullMany(effect.map((eff) => {
        return Effect(eff).run(streams)
      }))
    }
    return Effect(effect).run(streams)
  }
}

module.exports = app
