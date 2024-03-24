const paddle = document.getElementById('paddle');
const ball = document.getElementById('ball');
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');
const startScreen = document.getElementById('start-screen');

let yVelocity = 10;
let xVelocity = 10;
let score = 0;
let gameTimer = 0;
let gameInterval;
let timerInterval;

let gameStarted = false;

let pastScores = [];

document.addEventListener('mousemove', function(e) {
    if (gameStarted) {
        let gameRect = document.getElementById('pong-game').getBoundingClientRect();
        let newPaddlePosition = e.clientX - gameRect.left
        paddle.style.left = Math.max(0, Math.min(gameRect.width - paddle.offsetWidth, newPaddlePosition)) + paddle.offsetWidth/2 + 'px';
    }
});

document.addEventListener('keydown', function(e) {
    if (e.code === 'Space' && !gameStarted) {
        startGame();
    }
});

function startGame() {
    gameStarted = true;
    startScreen.style.display = 'none';

    let gameRect = document.getElementById('pong-game').getBoundingClientRect();
    let randomTopPosition = Math.random() * (gameRect.height / 2 - ball.offsetHeight);
    let randomLeftPosition = Math.random() * (gameRect.width - ball.offsetWidth);

    ball.style.top = randomTopPosition + 'px';
    ball.style.left = randomLeftPosition + 'px';

    yVelocity = 2;
    xVelocity = (Math.random() > 0.5 ? 1 : -1) * 2;
    score = 0;
    gameTimer = 0;
    scoreDisplay.innerText = 'Score: 0';
    timerDisplay.innerText = 'Time: 0';
    gameInterval = setInterval(moveBall, 20);
    timerInterval = setInterval(updateTimer, 1000);
}


function resetGame() {
    pastScores.push(score);

    clearInterval(gameInterval);
    clearInterval(timerInterval);
    startScreen.style.display = 'flex';
    gameStarted = false;
    
    displayPastScores(5);
}

function moveBall() {
    if (!gameStarted) return;

    let ballRect = ball.getBoundingClientRect();
    let paddleRect = paddle.getBoundingClientRect();
    let gameRect = document.getElementById('pong-game').getBoundingClientRect();

    if (ballRect.bottom >= gameRect.bottom && (ballRect.right < paddleRect.left || ballRect.left > paddleRect.right)) {
        resetGame();
        return;
    }

    if (ballRect.top <= gameRect.top || ballRect.bottom >= gameRect.bottom) {
        yVelocity *= -1;
    }
    if (ballRect.right >= paddleRect.left && ballRect.left <= paddleRect.right && ballRect.bottom >= paddleRect.top && ballRect.top <= paddleRect.bottom) {
        yVelocity *= -1;
        score++;
        scoreDisplay.innerText = `Score: ${score}`;
    }
    if (ballRect.left <= gameRect.left || ballRect.right >= gameRect.right) {
        xVelocity *= -1;
    }

    ball.style.left = ball.offsetLeft + xVelocity + 'px';
    ball.style.top = ball.offsetTop + yVelocity + 'px';
}

function updateTimer() {
    if (!gameStarted) return;

    gameTimer++;
    timerDisplay.innerText = `Time: ${gameTimer}`;
}

function displayPastScores() {
    const scoresList = document.getElementById('past-scores');
    scoresList.innerHTML = '';
    
    pastScores.forEach((score, index) => {
        const scoreItem = document.createElement('li');
        scoreItem.textContent = `Game ${index + 1}: ${score} points`;
        scoresList.appendChild(scoreItem);
    });
}
