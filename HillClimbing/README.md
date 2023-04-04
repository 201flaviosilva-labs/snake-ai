# Snake AI - Hill Climbing

## Description

Initially I created an array with 10000 positions, all with completely random values of possible snake positions (UP, DOWN, LEFT, RIGHT).

Each position represents the snake's new movement in each frame.

Each time the snake dies (colliding with walls or with his own body), the game restarts and if the current score was better than the previous one, I make 500 random changes to the array.

### Scoring

- 100p → Eat the apple;
- Between 40 to 0 → Depends on the distance from the death of the snake to the apple;

### Se more

See more in the [wikipedia](https://en.wikipedia.org/wiki/Hill_climbing)

## Preview

<iframe width="560" height="315" src="https://www.youtube.com/embed/9BctooqxYkk" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Check this demo in youtube: https://www.youtube.com/watch?v=9BctooqxYkk

## Make it run

### Clone and change directory

Clone the project and move it into the `HillClimbing` folder:

```sh
git clone https://github.com/201flaviosilva-labs/snake-ai.git
cd snake-ai/HillClimbing
```

### Install the dependencies

To install the node dependencies, you need to have [node and npm](https://nodejs.org) installed in you machine.

```sh
npm i
```

### Start the app

To make the app running and open a browser window just run:

```sh
npm start
```

Open your browser: http://localhost:5173/

## Available Commands

| Command         | Description                                                                     |
| --------------- | ------------------------------------------------------------------------------- |
| `npm i`         | Install project dependencies                                                    |
| `npm start`     | Start project and open web server running project                               |
| `npm run build` | Builds code bundle with production settings (minification, uglification, etc..) |

