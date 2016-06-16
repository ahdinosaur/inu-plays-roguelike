# inu-plays-rougelike

**work in progress**

['Twitch Plays Pokémon'](https://en.wikipedia.org/wiki/Twitch_Plays_Pok%C3%A9mon)-style ['Rouglelike'](https://en.wikipedia.org/wiki/Roguelike) game using [`inu`](https://github.com/ahdinosaur/inu)

## architecture

- server has state of app
- when user joins, connects to server to receive state
  - if user moves, sends action to server
  - server updates state and sends new state to *all* users

TODO: use [Entity Component System](https://en.wikipedia.org/wiki/Entity_component_system) architecture.

TODO: use [`webtrc-swarm`](https://github.com/mafintosh/webrtc-swarm/) instead of central server.

## characters

- empty space: ' '
- open space: '.'
- vertical wall: '|'
- horizontal wall: '-'
- adventurer: '@'
- dragon: 'D'

as in

```
-----------
|....@....|
|.........|
|.........|
|.........|
|....D....|
-----------
```

## developer how to

### install

```shell
git clone git://github.com/ahdinosaur/inu-plays-rougelike
cd inu-plays-roguelike
npm install
```

### start development server

```shell
npm start
```

### deploy to production

```shell
npm run deploy
```

## resources

- [Amit’s Game Programming Information](http://www-cs-students.stanford.edu/~amitp/gameprog.html)
- [Procedural Content Generation Wiki - Map Generation](http://pcg.wikidot.com/pcg-algorithm%3amap-generation)

## license

The Apache License

Copyright &copy; 2016 Michael Williams

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
