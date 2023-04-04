const randomNumber = (min = 0, max = 10) =>
	Math.floor(Math.random() * (max - min + 1) + min);

const colors = {
	tile: "rgba(100, 100, 100, 0.75)",
	apple: "#ff0000",
	head: "#00ffff",
	label: "#ffff00"
};

class Game {
	constructor() {
		const width = 800;
		const height = 800;

		this.canvas = document.getElementById("Canvas");
		this.canvas.width = width;
		this.canvas.height = height;
		this.ctx = this.canvas.getContext("2d");

		this.width = width;
		this.height = height;

		this.startDate = new Date().getTime();

		this.init();
		this.create();
		this.update();
	}

	init() {
		this.score = 0;
		this.tileSize = 40;
		this.numRows = 20;
		this.numColumns = 20;
	}

	create() {
		this.stopGame = false;

		this.player = {
			x: this.numRows - 1,
			y: this.numColumns - 1,
			body: []
		};

		this.apple = {
			x: 0,
			y: 0
		};
		this.setAppleRandomPosition();

		// Set Canvas Color
		this.ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
		this.ctx.textAlign = "left";
		this.ctx.textBaseline = "middle";
		this.ctx.font = "30px monospace";
	}

	setAppleRandomPosition() {
		let occupiedCell = false;

		do {
			const { apple, player } = this;
			occupiedCell = false;

			// Apple Random Position
			apple.x = randomNumber(0, this.numColumns - 1);
			apple.y = randomNumber(0, this.numColumns - 1);

			// Check Position Width Player
			if (apple.x == player.x && apple.y == player.y) {
				occupiedCell = true;
				continue;
			}

			// Check Position Width Player Body Cells
			if (player.body.length) {
				for (let i = 0; i < player.body.length; i++) {
					const b = player.body[i];
					if (apple.x == b.x && apple.y == b.y) {
						occupiedCell = true;
						break;
					}
				}
			}
		} while (occupiedCell);
	}

	update() {
		if (this.stopGame) return;

		this.movePlayer();
		// this.checkBodyCollision();
		this.checkAppleCollision();

		this.draw();

		requestAnimationFrame(this.update.bind(this));
	}

	draw() {
		this.ctx.clearRect(0, 0, this.width, this.height);

		// Map
		for (let x = 0; x < this.numRows; x++) {
			for (let y = 0; y < this.numColumns; y++) {
				this.drawCell(x, y, colors.tile);
			}
		}

		// Apple
		this.drawCell(this.apple.x, this.apple.y, colors.apple);

		// Snake
		this.drawCell(this.player.x, this.player.y, colors.head);
		for (let i = 0; i < this.player.body.length; i++) {
			const body = this.player.body[i];
			this.drawCell(body.x, body.y, body.color);
		}

		// Label Score
		this.ctx.fillStyle = colors.label;
		this.ctx.fillText(this.score, this.width / 2, 40);

		// Label Time
		this.ctx.fillStyle = colors.label;
		const txt = (new Date().getTime() - this.startDate) / 1000;
		this.ctx.fillText(txt, this.width / 2, this.height - 20);
	}

	drawCell(x, y, color) {
		this.ctx.fillStyle = color;
		this.ctx.fillRect(
			x * this.tileSize,
			y * this.tileSize,
			this.tileSize,
			this.tileSize
		);
		this.ctx.strokeRect(
			x * this.tileSize,
			y * this.tileSize,
			this.tileSize,
			this.tileSize
		);
	}

	movePlayer() {
		const { numRows, numColumns, player } = this;
		const { x, y } = player;

		let newX = x;
		let newY = y;

		if (x == numColumns - 1 && y !== numRows - 1) {
			newY++;
			this.setPlayerPosition(newX, newY);
			return;
		}

		if (y == 0) {
			newX++;
			this.setPlayerPosition(newX, newY);
			return;
		}

		if ((x === 0 && y % 2 == 1) || (x == numColumns - 2 && y % 2 == 0)) {
			newY--;
			this.setPlayerPosition(newX, newY);
			return;
		}

		if (y % 2 === 1) newX--;
		else newX++;

		this.setPlayerPosition(newX, newY);
	}

	setPlayerPosition(x, y) {
		const { body } = this.player;

		if (body.length) {
			body.shift();
			body.push({ x: this.player.x, y: this.player.y });
		}

		this.player.x = x;
		this.player.y = y;

		this.paintBody();
	}

	paintBody() {
		const { body } = this.player;
		const colorSteep = 255 / body.length;

		for (let i = 0; i < body.length; i++) {
			const color = colorSteep * (i + 1);
			body[i].color = `rgb(0, ${color}, 0)`;
		}
	}

	checkAppleCollision() {
		const { apple, player } = this;
		if (apple.x == player.x && apple.y == player.y) {
			this.score++;
			if (this.score >= 475) this.stopGame = true;
			this.player.body.push({ x: player.x, y: player.y });
			this.setAppleRandomPosition();
		}
	}

	checkBodyCollision() {
		const { player } = this;

		player.body.map((b, i) => {
			if (b.x == player.x && b.y == player.y) {
				this.stopGame = true;
				return;
			}
		});
	}
}

const game = new Game();
