const dragon = document.getElementById('dragon');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');
const healthFill = document.getElementById('health-fill');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const finalScoreElement = document.getElementById('final-score');

let dragonX = 0;
let dragonY = 200;
let score = 0;
let health = 100;
let gameLoop;
let fireballInterval;
let obstacleInterval;
let powerUpInterval;
let isInvincible = false;

function updateDragonPosition() {
    dragon.style.left = dragonX + 'px';
    dragon.style.top = dragonY + 'px';
}

function createFireball() {
    const fireball = document.createElement('div');
    fireball.classList.add('fireball');
    fireball.style.left = '800px';
    fireball.style.top = Math.random() * 380 + 'px';
    gameScreen.appendChild(fireball);

    const fireballLoop = setInterval(() => {
        const left = parseInt(fireball.style.left);
        if (left > -20) {
            fireball.style.left = (left - 5) + 'px';
            checkCollision(fireball, 'fireball');
        } else {
            clearInterval(fireballLoop);
            gameScreen.removeChild(fireball);
        }
    }, 50);
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = '800px';
    obstacle.style.top = Math.random() * 350 + 'px';
    obstacle.style.width = '50px';
    obstacle.style.height = '50px';
    gameScreen.appendChild(obstacle);

    const obstacleLoop = setInterval(() => {
        const left = parseInt(obstacle.style.left);
        if (left > -50) {
            obstacle.style.left = (left - 3) + 'px';
            checkCollision(obstacle, 'obstacle');
        } else {
            clearInterval(obstacleLoop);
            gameScreen.removeChild(obstacle);
        }
    }, 50);
}

function createPowerUp() {
    const powerUp = document.createElement('div');
    powerUp.classList.add('power-up');
    powerUp.style.left = '800px';
    powerUp.style.top = Math.random() * 370 + 'px';
    gameScreen.appendChild(powerUp);

    const powerUpLoop = setInterval(() => {
        const left = parseInt(powerUp.style.left);
        if (left > -30) {
            powerUp.style.left = (left - 2) + 'px';
            checkCollision(powerUp, 'power-up');
        } else {
            clearInterval(powerUpLoop);
            gameScreen.removeChild(powerUp);
        }
    }, 50);
}

function checkCollision(element, type) {
    const dragonRect = dragon.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

    if (
        dragonRect.left < elementRect.right &&
        dragonRect.right > elementRect.left &&
        dragonRect.top < elementRect.bottom &&
        dragonRect.bottom > elementRect.top
    ) {
        if (type === 'fireball') {
            score++;
            scoreElement.textContent = `Score: ${score}`;
            gameScreen.removeChild(element);
        } else if (type === 'obstacle' && !isInvincible) {
            health -= 20;
            updateHealthBar();
            if (health <= 0) {
                gameOver();
            }
        } else if (type === 'power-up') {
            activatePowerUp();
            gameScreen.removeChild(element);
        }
    }
}

function updateHealthBar() {
    healthFill.style.width = `${health}%`;
}

function activatePowerUp() {
    isInvincible = true;
    dragon.style.filter = 'brightness(1.5) hue-rotate(90deg)';
    setTimeout(() => {
        isInvincible = false;
        dragon.style.filter = 'none';
    }, 5000);
}

function gameOver() {
    clearInterval(gameLoop);
    clearInterval(fireballInterval);
    clearInterval(obstacleInterval);
    clearInterval(powerUpInterval);
    gameScreen.classList.add('hidden');
    gameOverScreen.classList.remove('hidden');
    finalScoreElement.textContent = `Final Score: ${score}`;
}

function startGame() {
    dragonX = 0;
    dragonY = 200;
    score = 0;
    health = 100;
    scoreElement.textContent = 'Score: 0';
    updateHealthBar();
    updateDragonPosition();

    startScreen.classList.add('hidden');
    gameScreen.classList.remove('hidden');
    gameOverScreen.classList.add('hidden');

    gameLoop = setInterval(() => {
        dragonX += 1;
        if (dragonX > 750) {
            gameOver();
        }
        updateDragonPosition();
    }, 50);

    fireballInterval = setInterval(createFireball, 2000);
    obstacleInterval = setInterval(createObstacle, 3000);
    powerUpInterval = setInterval(createPowerUp, 10000);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (dragonY > 0) dragonY -= 10;
            break;
        case 'ArrowDown':
            if (dragonY < 360) dragonY += 10;
            break;
        case 'ArrowLeft':
            if (dragonX > 0) dragonX -= 10;
            break;
        case 'ArrowRight':
            if (dragonX < 740) dragonX += 10;
            break;
    }
    updateDragonPosition();
});

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);

const instructionsButton = document.getElementById('instructions-button');
const instructionsScreen = document.getElementById('instructions-screen');
const backButton = document.getElementById('back-button');
const powerUpIndicator = document.getElementById('power-up-indicator');

let level = 1;
let coins = 0;
let activePowerUp = null;
let enemyDragonInterval;

instructionsButton.addEventListener('click', () => {
    startScreen.classList.add('hidden');
    instructionsScreen.classList.remove('hidden');
});

backButton.addEventListener('click', () => {
    instructionsScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

function createEnemyDragon() {
    const enemyDragon = document.createElement('div');
    enemyDragon.classList.add('enemy-dragon');
    enemyDragon.style.left = '800px';
    enemyDragon.style.top = Math.random() * 350 + 'px';
    gameScreen.appendChild(enemyDragon);

    const enemyDragonLoop = setInterval(() => {
        const left = parseInt(enemyDragon.style.left);
        if (left > -50) {
            enemyDragon.style.left = (left - 4) + 'px';
            checkCollision(enemyDragon, 'enemy-dragon');
        } else {
            clearInterval(enemyDragonLoop);
            gameScreen.removeChild(enemyDragon);
        }
    }, 50);
}

function createCoin() {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = '800px';
    coin.style.top = Math.random() * 370 + 'px';
    gameScreen.appendChild(coin);

    const coinLoop = setInterval(() => {
        const left = parseInt(coin.style.left);
        if (left > -20) {
            coin.style.left = (left - 3) + 'px';
            checkCollision(coin, 'coin');
        } else {
            clearInterval(coinLoop);
            gameScreen.removeChild(coin);
        }
    }, 50);
}

function checkCollision(element, type) {
    // ... (existing collision code)

    if (
        dragonRect.left < elementRect.right &&
        dragonRect.right > elementRect.left &&
        dragonRect.top < elementRect.bottom &&
        dragonRect.bottom > elementRect.top
    ) {
        switch (type) {
            case 'fireball':
                score += 10;
                updateScore();
                gameScreen.removeChild(element);
                createExplosion(elementRect.left, elementRect.top);
                break;
            case 'obstacle':
                if (!isInvincible) {
                    health -= 20;
                    updateHealthBar();
                    createExplosion(elementRect.left, elementRect.top);
                    if (health <= 0) {
                        gameOver();
                    }
                }
                break;
            case 'power-up':
                activatePowerUp();
                gameScreen.removeChild(element);
                break;
            case 'enemy-dragon':
                if (!isInvincible) {
                    health -= 30;
                    updateHealthBar();
                    createExplosion(elementRect.left, elementRect.top);
                    if (health <= 0) {
                        gameOver();
                    }
                }
                gameScreen.removeChild(element);
                break;
            case 'coin':
                coins++;
                updateScore();
                gameScreen.removeChild(element);
                break;
        }
    }
}

