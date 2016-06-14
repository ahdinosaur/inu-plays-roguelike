# multiplayer roguelike

## overview

- `inu` walkthrough
  - state
  - actions
  - effects
    - like elm effects
  - update function
    - like redux reducer
  - view function
    - like pure react component
  - run function
    - composable streams everwhere
- [programming because it's fun](https://gist.github.com/data-doge/2d5d34bf8ffa9f0add72)
- what we're going to build

## what we're building

- "Twitch plays Pokemon"
- rougelike

## architecture

- server has state of app
- when user joins, connects to server to receive state
  - if user moves, sends action to server
  - server updates state and sends new state to all users


## model

```json
{
  
}
```

## actions

### move (server)

```js
{
  type: 'move',
  direction
}
```

### set (client)

```js
{
  type: 'set',
  model: {
    size: [width, height],
    position: [x, y]
  }
}
```

## effects

### listenToKeys

### scheduleSend

---

# notes

## livecode features

- single room
- single character
- everyone controls character

## demo features

- single room
- single character
- TODO: single baddy doing basic pathfinding
- TODO: tests

## adventure features

- multiple players
- multiple rooms and hallways
- line of sight
- fog of war
- multiple levels
- baddies
- inventory
- pickup items
- powerups
- weapons
- armor
- traps
