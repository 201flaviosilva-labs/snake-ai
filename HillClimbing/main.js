import { randomInt } from "201flaviosilva-utils";
import "css-free-style/build/canvas.min.css";
import "./style.css";

const choice = arr => arr[Math.floor(Math.random() * arr.length)];

function calcDist(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow((x2 - x1), 2) + Math.pow((y2 - y1), 2));
}


const COLORS = {
  tile: "rgba(100, 100, 100, 0.75)",
  apple: "#ffff00",
  wall: "#ff0000",
  head: "#00ffff",
  label: "#ffff00",
  background: "rgba(255, 255, 255, 0.1)",
};
const WIDTH = 800;
const HEIGHT = 800;
const TILE_SIZE = 40;

const APPLE_POSITIONS = [
  { x: 12, y: 12 },
  { x: 1, y: 1 },
  { x: 18, y: 18 },
  { x: 10, y: 10 },
  { x: 1, y: 18 },
  { x: 18, y: 1 },
];

const AVAILABLE_DIRECTION = [
  "UP",
  "DOWN",
  "LEFT",
  "RIGHT",
];

function drawCell(ctx, x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(
    x * TILE_SIZE + 1,
    y * TILE_SIZE + 1,
    TILE_SIZE - 2,
    TILE_SIZE - 2
  );
  ctx.strokeRect(
    x * TILE_SIZE,
    y * TILE_SIZE,
    TILE_SIZE,
    TILE_SIZE
  );
}

class Player {
  constructor(ctx, numRows, numColumns, movesList) {
    this.id = Math.random();
    this.ctx = ctx;
    this.score = 0;
    this.x = Math.floor(numRows / 2);
    this.y = Math.floor(numColumns / 2);
    this.movesList = movesList;
    this.body = [];
    this.isAlive = true;
  }

  update(currentFrame) {
    if (!this.isAlive) return;
    this.move(currentFrame);
    this.checkBodyCollision();
    this.checkBoundsCollision();
  }

  move(currentFrame) {
    const { x, y } = this;

    switch (this.movesList[currentFrame]) {
      case "UP":
        this.setPosition(x, y - 1);
        break;

      case "DOWN":
        this.setPosition(x, y + 1);
        break;

      case "LEFT":
        this.setPosition(x - 1, y);
        break;

      case "RIGHT":
        this.setPosition(x + 1, y);
        break;
    }
  }

  setPosition(x, y) {
    const { body } = this;

    if (body.length) {
      body.shift();
      body.push({ x: this.x, y: this.y });
    }

    this.x = x;
    this.y = y;

    this.setBodyColors();
  }

  setBodyColors() {
    const { body } = this;
    const colorSteep = 255 / body.length;

    for (let i = 0; i < body.length; i++) {
      const color = colorSteep * (i + 1);
      body[i].color = `rgb(0, ${color}, 0)`;
    }
  }

  draw() {
    const { ctx, x, y, body } = this;
    drawCell(ctx, x, y, COLORS.head);
    for (let i = 0; i < body.length; i++) {
      const b = body[i];
      drawCell(ctx, b.x, b.y, b.color);
    }
  }

  checkBodyCollision() {
    const { body, x, y } = this;

    body.map((b) => {
      if (b.x === x && b.y === y) this.isAlive = false;
    });
  }

  checkBoundsCollision() {
    const { x, y } = this;
    this.isAlive = (x >= 1 && x < (WIDTH / TILE_SIZE) - 1) && (y >= 1 && y < (HEIGHT / TILE_SIZE) - 1);
  }
}

class Agente {
  constructor() {
    this.MAX_OF_MOVES = 10000;
    this.NUMBER_OF_MUTATIONS = 500;

    this.currentMoveList = new Array(this.MAX_OF_MOVES).fill(AVAILABLE_DIRECTION[0])
      .map(() => choice(AVAILABLE_DIRECTION));
    this.bestMoveList = [...this.currentMoveList];
    this.bestScore = 0;
    this.generation = 0;
  }

  mutate(newScore) {
    this.generation++;
    if (newScore > this.bestScore) {
      this.bestScore = newScore;
      this.bestMoveList = [...this.currentMoveList];
    }

    const bml = [...this.bestMoveList];
    for (let i = 0; i < this.NUMBER_OF_MUTATIONS; i++) {
      bml[randomInt(0, bml.length - 1)] = choice(AVAILABLE_DIRECTION);
    }

    this.currentMoveList = [...bml];
  }
}

class Game {
  constructor() {
    this.canvas = document.getElementById("Canvas");
    this.canvas.width = WIDTH;
    this.canvas.height = HEIGHT;
    this.ctx = this.canvas.getContext("2d");

    this.startDate = new Date().getTime();
    this.agente = new Agente();

    this.init();
    this.create();
    this.update();
  }

  restart() {
    const distance = Math.round(TILE_SIZE - calcDist(this.player.x, this.player.y, this.apple.x, this.apple.y)); // bonus for distance;
    this.agente.mutate(this.player.score + distance);
    this.init();
    this.create();
  }

  init() {
    this.numRows = 20;
    this.numColumns = 20;
    this.currentFrame = 0;
    this.eatenApples = 0;
  }

  create() {
    this.player = new Player(this.ctx, this.numRows, this.numColumns, this.agente.currentMoveList);

    this.apple = APPLE_POSITIONS[0];

    // Set Canvas Color
    this.ctx.strokeStyle = COLORS.background;
    this.ctx.textAlign = "left";
    this.ctx.textBaseline = "middle";
    this.ctx.font = "30px monospace";
  }

  update() {
    if (!this.player.isAlive) this.restart();

    this.currentFrame++;

    this.player.update(this.currentFrame);
    this.checkAppleCollision();

    this.draw();

    requestAnimationFrame(this.update.bind(this));
  }

  draw() {
    this.ctx.clearRect(0, 0, WIDTH, HEIGHT);

    // Map
    for (let x = 0; x < this.numRows; x++) {
      for (let y = 0; y < this.numColumns; y++) {
        drawCell(this.ctx, x, y, COLORS.tile);
      }
    }

    // Walls
    for (let x = 0; x < this.numRows; x++) {
      for (let y = 0; y < this.numColumns; y++) {
        if (
          x === 0 ||
          y === 0 ||
          x === this.numRows - 1 ||
          y === this.numColumns - 1
        ) drawCell(this.ctx, x, y, COLORS.wall);
      }
    }

    // Apple
    drawCell(this.ctx, this.apple.x, this.apple.y, COLORS.apple);

    // Snake
    this.player.draw();

    // Labels
    const distance = Math.round(TILE_SIZE - calcDist(this.player.x, this.player.y, this.apple.x, this.apple.y));
    const lineHeight = 15;
    const txt = `
    Time: ${Math.floor((new Date().getTime() - this.startDate) / 1000)}\n
    Generation: ${this.agente.generation}\n
    Frame: ${this.currentFrame}\n
    Score: ${(this.player.score + distance)}\n
    Best score: ${this.agente.bestScore}\n
    `;
    const lines = txt.split('\n');

    this.ctx.fillStyle = COLORS.label;
    for (var i = 0; i < lines.length; i++) {
      const x = WIDTH / 2 - 150;
      const y = HEIGHT / 2 + (i * lineHeight) - 75;
      this.ctx.fillText(lines[i], x, y);
    }
  }

  checkAppleCollision() {
    const { apple, player } = this;
    if (apple.x === player.x && apple.y === player.y) {
      this.player.score += 100;
      this.eatenApples++;
      this.apple = { ...APPLE_POSITIONS[this.eatenApples] };
      this.player.body.push({ x: player.x, y: player.y });
    }
  }
}

new Game();
