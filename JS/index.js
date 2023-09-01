// Constants
const difficultyLevel = document.getElementById("select-difficulty");
const gameOverSound = document.getElementById("gameover-music");
const controlButtons = document.querySelectorAll(".control-btn");
const gameContainer = document.getElementById("game-container");
const bgMusic = document.getElementById("background-music");
const startScreen = document.getElementById("start-screen");
const startButton = document.getElementById("start-btn");
const moveMusic = document.getElementById("move-music");
const eatSound = document.getElementById("eat-music");
const scoreValue = document.getElementById("score-value");
const canvas = document.getElementById("canvas");
const context = canvas.getContext("2d");
const snakePosition = {
  x: 500,
  y: 600,
};
const foodPosition = {
  x: 800,
  y: 400,
};
const velocity = {
  x: 0,
  y: 0,
};
const snake = [];

// Setting canvas width and height
canvas.width = 1366;
canvas.height = 768;

// Variables
let extraSpeed = 1;
let score = 0;

// Snake particle
class SnakeBody {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.size,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }
  update() {
    this.x += velocity.x * extraSpeed;
    this.y += velocity.y * extraSpeed;
  }
}

// Food particle
class SnakeFood {
  constructor(x, y, size, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.color = color;
  }
  draw() {
    context.beginPath();
    context.arc(
      this.x,
      this.y,
      this.size,
      (Math.PI / 180) * 0,
      (Math.PI / 180) * 360,
      false
    );
    context.fillStyle = this.color;
    context.fill();
  }
}

// Functions
const randomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const startGame = () => {
  // Reset variables
  snakePosition.x = 500;
  snakePosition.y = 600;
  foodPosition.x = 800;
  foodPosition.y = 400;
  velocity.x = 0;
  velocity.y = 0;
  score = 0;
  scoreValue.innerHTML = score;
  snake.length = 0;
  snake.push(new SnakeBody(snakePosition.x, snakePosition.y, 8, "salmon"));

  // Hide start screen
  startScreen.style.opacity = "0";
  setTimeout(() => {
    startScreen.style.display = "none";
  }, 600);
  bgMusic.play();
  main();
};

const playMoveMusic = () => {
  moveMusic.currentTime = 0;
  moveMusic.play();
};

const generateFood = (food) => {
  foodPosition.x = randomNumber(
    0 + food.size * 2,
    Math.floor(canvas.width - food.size * 2)
  );
  foodPosition.y = randomNumber(
    0 + food.size * 2,
    Math.floor(canvas.height - food.size * 2)
  );
};

const growSnake = () => {
  const newBodyPart = new SnakeBody(
    snake[snake.length - 1].x,
    snake[snake.length - 1].y,
    7,
    "white"
  );
  snake.push(newBodyPart);
};

const playerControl = (event) => {
  // Giving some extra speed on pressing ctrl key.
  extraSpeed = event.ctrlKey ? 2 : 1;

  let speed;

  // set the speed according to difficulty level
  if (difficultyLevel.value === "easy") {
    speed = 5;
  } else if (difficultyLevel.value === "medium") {
    speed = 8;
  } else {
    speed = 12;
  }

  // detecting keyboard pressed key
  switch (event.key) {
    case "ArrowUp":
      playMoveMusic();
      velocity.x = 0;
      velocity.y = -1 * speed;
      break;
    case "ArrowDown":
      playMoveMusic();
      velocity.x = 0;
      velocity.y = 1 * speed;
      break;
    case "ArrowRight":
      playMoveMusic();
      velocity.x = 1 * speed;
      velocity.y = 0;
      break;
    case "ArrowLeft":
      playMoveMusic();
      velocity.x = -1 * speed;
      velocity.y = 0;
      break;
  }
};

const ctrlReleaseEvent = (event) => {
  if (!event.ctrlKey) {
    extraSpeed = 1;
  }
};

const moveSnakeBody = () => {
  for (let i = snake.length - 1; i > 0; i--) {
    snake[i].x = snake[i - 1].x;
    snake[i].y = snake[i - 1].y;
  }
};

const snakeEatFood = () => {
  const food = new SnakeFood(foodPosition.x, foodPosition.y, 8, "yellow");
  food.draw();
  // checking if snake eaten the food.
  if (
    Math.abs(snake[0].x - food.x) < snake[0].size + food.size &&
    Math.abs(snake[0].y - food.y) < snake[0].size + food.size
  ) {
    eatSound.currentTime = 0;
    eatSound.play();
    score++;
    scoreValue.innerHTML = score;
    growSnake();
    generateFood(food);
  }
};

const gameOver = () => {
  bgMusic.pause();
  bgMusic.currentTime = 0;
  gameOverSound.play();
  startScreen.style.display = "flex";
  setTimeout(() => {
    startScreen.style.opacity = "1";
  }, 100);
};

const checkCollision = () => {
  // check the snake collision with walls
  if (
    snake[0].x - snake[0].size < 0 ||
    snake[0].y - snake[0].size < 0 ||
    snake[0].x + snake[0].size > canvas.width ||
    snake[0].y + snake[0].size > canvas.height
  ) {
    gameOver();
    return true;
  }

  // check the snake collision with it's body part.
  for (let i = 3; i < snake.length; i++) {
    if (
      Math.abs(snake[0].x - snake[i].x) < 1 &&
      Math.abs(snake[0].y - snake[i].y) < 1
    ) {
      gameOver();
      return true;
    }
  }
};

const gameEngine = (Id) => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  snakeEatFood();

  checkCollision() && cancelAnimationFrame(Id);

  //Concept:- Only move snake head rather than moving complete snake with its body parts. By doing this only snake head is move and rest of the body parts will follow along the snake. snake must move tail to head.

  // Rendering the snake
  for (let i = snake.length - 1; i >= 0; i--) {
    snake[i].draw();
  }

  // Moving the snake head
  snake[0].update();

  // Moving the snake body parts
  moveSnakeBody();
};

const main = () => {
  const animationId = requestAnimationFrame(main);
  gameEngine(animationId);
};

// Attaching Event Listeners

if (window.screen.width <= 1000) {
  controlButtons.forEach((element) => {
    element.addEventListener("click", (event) => {
      playMoveMusic();

      let speed;

      // set the speed according to difficulty level
      if (difficultyLevel.value === "easy") {
        speed = 5;
      } else if (difficultyLevel.value === "medium") {
        speed = 8;
      } else {
        speed = 12;
      }

      switch (element.id) {
        case "left":
          velocity.x = -1 * speed;
          velocity.y = 0;
          break;
        case "right":
          velocity.x = 1 * speed;
          velocity.y = 0;
          break;
        case "down":
          velocity.x = 0;
          velocity.y = 1 * speed;
          break;
        case "up":
          velocity.x = 0;
          velocity.y = -1 * speed;
          break;
      }
    });
  });
} else {
  controlButtons.forEach((element) => {
    element.style.display = "none";
  });

  window.addEventListener("keydown", playerControl);

  window.addEventListener("keyup", ctrlReleaseEvent);
}

startButton.addEventListener("click", startGame);
