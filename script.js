const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

let x = canvas.width / 2;
let y = canvas.height - 30;

let dx = 4.2;
let dy = -4.2;

let ballRadius = 10;

let paddleHeight = 10;
let paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;

let leftPressed = false;
let rightPressed = false;

let brickRowCount = 3;
let brickColumnCount = 5;
let brickWidth = 75;
let brickHeight = 20;
let brickPadding = 10;
let brickOffsetTop = 30;
let brickOffsetLeft = 30;

let bricks = initBricks();

let score = 0;

let lives = 3;

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

function mouseMoveHandler(event) {
  let relativeX = event.clientX - canvas.offsetLeft;
  if(relativeX > 0 && relativeX < canvas.width) {
      paddleX = relativeX - paddleWidth/2;
  }
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function initBricks() {
  const bricksArr = [];
  for (let c = 0; c < brickColumnCount; c++) {
    bricksArr[c] = [];
    for (let r = 0; r < brickRowCount; r++) {
      bricksArr[c][r] = { x: 0, y: 0, status: 1 };
    }
  }

  return bricksArr;
}

function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;
        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function collisionDetection() {
  for (var c = 0; c < brickColumnCount; c++) {
    for (var r = 0; r < brickRowCount; r++) {
      var b = bricks[c][r];
      if (b.status === 1) {
        if (
          x > b.x &&
          x < b.x + brickWidth &&
          y > b.y &&
          y < b.y + brickHeight
        ) {
          reflectY();
          b.status = 0;
          score++;

          if (score == brickRowCount * brickColumnCount) {
            alert("YOU WIN, CONGRATULATIONS!");
            document.location.reload();
          }
        }
      }
    }
  }
}

function drawScore() {
  ctx.font = "bold 24px Arial";
  ctx.fillStyle = "#0095DD";
  ctx.fillText(score, 14, 20);
}

function drawHeart(hx, hy, width, height, color) {
  ctx.save();
  ctx.beginPath();
  var topCurveHeight = height * 0.3;
  ctx.moveTo(hx, hy + topCurveHeight);
  // top left curve
  ctx.bezierCurveTo(
    hx, hy, 
    hx - width / 2, hy, 
    hx - width / 2, hy + topCurveHeight
  );

  // bottom left curve
  ctx.bezierCurveTo(
    hx - width / 2, hy + (height + topCurveHeight) / 2, 
    hx, hy + (height + topCurveHeight) / 2, 
    hx, hy + height
  );

  // bottom right curve
  ctx.bezierCurveTo(
    hx, hy + (height + topCurveHeight) / 2, 
    hx + width / 2, hy + (height + topCurveHeight) / 2, 
    hx + width / 2, hy + topCurveHeight
  );

  // top right curve
  ctx.bezierCurveTo(
    hx + width / 2, hy, 
    hx, hy, 
    hx, hy + topCurveHeight
  );

  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.restore();
}

function drawLives() {
  for (let l = 1; l <= lives; l++) {
    drawHeart(canvas.width - 30 * l, 10, 10, 10, '#FF0000');
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function reflectX() {
  const random = (Math.random() * (score / 20 - 0.01) + 0.01);
  dx < 0 ? dx = -dx + random : dx = -dx - random;
  console.log("???");
}

function reflectY() {
  const random = (Math.random() * (score / 20 - 0.01) + 0.01);
  dy < 0 ? dy = -dy + random : dy = -dy - random;
}

function draw() {
  clearCanvas();
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection();
  drawScore();
  drawLives();

  // bounce off top
  if (y + dy < ballRadius) {
    reflectY();
  }

  // bounce off bottom
  if (y + dy > canvas.height - ballRadius) {
    // (paddleMiddleX - ballMiddleX) > paddleWidth / 2
    if (Math.abs(paddleX + paddleWidth / 2 - x) > paddleWidth / 2) {
      if (lives > 1) {
        lives--;
        reflectY();
      } else {
        document.location.reload();
        alert("GAME OVER!");
      }
    } else {
      reflectY();
    }
  }

  // bounce of left
  if (x + dx < ballRadius) {
    reflectX();
  }

  // bounce of right
  if (x + dx > canvas.width - ballRadius) {
    reflectX();
  }

  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  }

  if (leftPressed) {
    paddleX += -7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }

  x += dx;
  y += dy;
  requestAnimationFrame(draw);
}

draw();
