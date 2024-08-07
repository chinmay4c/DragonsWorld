// Game elements
const gameContainer = document.getElementById('game-container');
const startScreen = document.getElementById('start-screen');
const gameScreen = document.getElementById('game-screen');
const gameOverScreen = document.getElementById('game-over-screen');
const instructionsScreen = document.getElementById('instructions-screen');
const highScoresScreen = document.getElementById('high-scores-screen');
const pauseScreen = document.getElementById('pause-screen');

// Buttons
const startButton = document.getElementById('start-button');
const restartButton = document.getElementById('restart-button');
const instructionsButton = document.getElementById('instructions-button');
const backButton = document.getElementById('back-button');
const highScoresButton = document.getElementById('high-scores-button');
const backFromScoresButton = document.getElementById('back-from-scores-button');
const resumeButton = document.getElementById('resume-button');
const quitButton = document.getElementById('quit-button');
const submitScoreButton = document.getElementById('submit-score');

// Game state
let playerDragon;
let enemyDragons = [];
let fireballs = [];
let obstacles = [];
let powerUps = [];
let coins = [];
let score = 0;
let health = 100;
let level = 1;
let isGameOver = false;
let isPaused = false;
let isBreathingFire = false;
let gameLoop;
let enemyDragonInterval;
let obstacleInterval;
let powerUpInterval;
let coinInterval;
let currentMission;
let gameStartTime;

// Game settings
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;

// Initialize game
function initGame() {
    playerDragon = {
        element: document.getElementById('dragon'),
        x: 50,
        y: 200,
        width: 80,
        height: 60,
        speed: 5
    };
    updateDragonPosition();
    score = 0;
    health = 100;
    level = 1;
    isGameOver = false;
    isPaused = false;
    enemyDragons = [];
    fireballs = [];
    obstacles = [];
    powerUps = [];
    coins = [];
    gameStartTime = Date.now();
    updateScore();
    updateHealthBar();
    updateLevelIndicator();
    setNewMission();
}

// Update functions
function updateDragonPosition() {
    playerDragon.element.style.left = playerDragon.x + 'px';
    playerDragon.element.style.top = playerDragon.y + 'px';
}

function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

function updateHealthBar() {
    const healthFill = document.getElementById('health-fill');
    healthFill.style.width = `${health}%`;
}

function updateLevelIndicator() {
    document.getElementById('level-indicator').textContent = `Level: ${level}`;
}

// Create game elements
function createEnemyDragon() {
    const enemyDragon = document.createElement('div');
    enemyDragon.classList.add('enemy-dragon');
    enemyDragon.style.left = `${GAME_WIDTH}px`;
    enemyDragon.style.top = `${Math.random() * (GAME_HEIGHT - 60)}px`;
    gameScreen.appendChild(enemyDragon);

    const enemy = {
        element: enemyDragon,
        x: GAME_WIDTH,
        y: parseInt(enemyDragon.style.top),
        width: 70,
        height: 50,
        speed: 2 + Math.random() * 2
    };

    enemyDragons.push(enemy);
}

function createObstacle() {
    const obstacle = document.createElement('div');
    obstacle.classList.add('obstacle');
    obstacle.style.left = `${GAME_WIDTH}px`;
    obstacle.style.top = `${Math.random() * (GAME_HEIGHT - 50)}px`;
    gameScreen.appendChild(obstacle);

    obstacles.push({
        element: obstacle,
        x: GAME_WIDTH,
        y: parseInt(obstacle.style.top),
        width: 50,
        height: 50,
        speed: 3
    });
}

function createPowerUp() {
    const powerUpTypes = ['shield', 'speed', 'health'];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    const powerUp = document.createElement('div');
    powerUp.classList.add('power-up', type);
    powerUp.style.left = `${GAME_WIDTH}px`;
    powerUp.style.top = `${Math.random() * (GAME_HEIGHT - 30)}px`;
    gameScreen.appendChild(powerUp);

    powerUps.push({
        element: powerUp,
        x: GAME_WIDTH,
        y: parseInt(powerUp.style.top),
        width: 30,
        height: 30,
        speed: 2,
        type: type
    });
}

function createCoin() {
    const coin = document.createElement('div');
    coin.classList.add('coin');
    coin.style.left = `${GAME_WIDTH}px`;
    coin.style.top = `${Math.random() * (GAME_HEIGHT - 20)}px`;
    gameScreen.appendChild(coin);

    coins.push({
        element: coin,
        x: GAME_WIDTH,
        y: parseInt(coin.style.top),
        width: 20,
        height: 20,
        speed: 3
    });
}

function createFireball() {
    const fireball = document.createElement('div');
    fireball.classList.add('fireball');
    fireball.style.left = `${playerDragon.x + playerDragon.width}px`;
    fireball.style.top = `${playerDragon.y + playerDragon.height / 2}px`;
    gameScreen.appendChild(fireball);

    fireballs.push({
        element: fireball,
        x: playerDragon.x + playerDragon.width,
        y: playerDragon.y + playerDragon.height / 2,
        width: 20,
        height: 20,
        speed: 8
    });
}

// Movement and collision functions
function moveEnemyDragons() {
    enemyDragons.forEach((enemy, index) => {
        enemy.x -= enemy.speed;
        enemy.element.style.left = `${enemy.x}px`;

        if (enemy.x < -enemy.width) {
            gameScreen.removeChild(enemy.element);
            enemyDragons.splice(index, 1);
        }

        if (checkCollision(playerDragon, enemy)) {
            hitObstacle();
            gameScreen.removeChild(enemy.element);
            enemyDragons.splice(index, 1);
        }
    });
}

function moveObstacles() {
    obstacles.forEach((obstacle, index) => {
        obstacle.x -= obstacle.speed;
        obstacle.element.style.left = `${obstacle.x}px`;

        if (obstacle.x < -obstacle.width) {
            gameScreen.removeChild(obstacle.element);
            obstacles.splice(index, 1);
        }

        if (checkCollision(playerDragon, obstacle)) {
            hitObstacle();
            gameScreen.removeChild(obstacle.element);
            obstacles.splice(index, 1);
        }
    });
}

function movePowerUps() {
    powerUps.forEach((powerUp, index) => {
        powerUp.x -= powerUp.speed;
        powerUp.element.style.left = `${powerUp.x}px`;

        if (powerUp.x < -powerUp.width) {
            gameScreen.removeChild(powerUp.element);
            powerUps.splice(index, 1);
        }

        if (checkCollision(playerDragon, powerUp)) {
            activatePowerUp(powerUp.type);
            gameScreen.removeChild(powerUp.element);
            powerUps.splice(index, 1);
        }
    });
}

function moveCoins() {
    coins.forEach((coin, index) => {
        coin.x -= coin.speed;
        coin.element.style.left = `${coin.x}px`;

        if (coin.x < -coin.width) {
            gameScreen.removeChild(coin.element);
            coins.splice(index, 1);
        }

        if (checkCollision(playerDragon, coin)) {
            score += 10;
            updateScore();
            gameScreen.removeChild(coin.element);
            coins.splice(index, 1);
        }
    });
}

function moveFireballs() {
    fireballs.forEach((fireball, index) => {
        fireball.x += fireball.speed;
        fireball.element.style.left = `${fireball.x}px`;

        if (fireball.x > GAME_WIDTH) {
            gameScreen.removeChild(fireball.element);
            fireballs.splice(index, 1);
        }

        enemyDragons.forEach((enemy, enemyIndex) => {
            if (checkCollision(fireball, enemy)) {
                score += 20;
                updateScore();
                gameScreen.removeChild(enemy.element);
                enemyDragons.splice(enemyIndex, 1);
                gameScreen.removeChild(fireball.element);
                fireballs.splice(index, 1);
            }
        });
    });
}

function checkCollision(obj1, obj2) {
    return (
        obj1.x < obj2.x + obj2.width &&
        obj1.x + obj1.width > obj2.x &&
        obj1.y < obj2.y + obj2.height &&
        obj1.y + obj1.height > obj2.y
    );
}

function hitObstacle() {
    health -= 10;
    updateHealthBar();
    if (health <= 0) {
        gameOver();
    }
}

// Power-up functions
function activatePowerUp(type) {
    switch (type) {
        case 'shield':
            playerDragon.element.classList.add('shielded');
            setTimeout(() => playerDragon.element.classList.remove('shielded'), 5000);
            break;
        case 'speed':
            playerDragon.speed *= 1.5;
            setTimeout(() => playerDragon.speed /= 1.5, 5000);
            break;
        case 'health':
            health = Math.min(health + 20, 100);
            updateHealthBar();
            break;
    }
}

// Mission functions
function setNewMission() {
    const missions = [
        { description: "Defeat 5 enemy dragons", condition: () => score >= 100 },
        { description: "Collect 10 coins", condition: () => score % 100 === 0 },
        { description: "Survive for 1 minute", condition: () => (Date.now() - gameStartTime) >= 60000 }
    ];

    currentMission = missions[Math.floor(Math.random() * missions.length)];
    updateMissionIndicator();
}

function updateMissionIndicator() {
    document.getElementById('mission-indicator').textContent = `Mission: ${currentMission.description}`;
}

function checkMissionCompletion() {
    if (currentMission.condition()) {
        score += 50;
        updateScore();
        setNewMission();
    }
}

// Game loop
function gameLoop() {
    if (!isPaused && !isGameOver) {
        moveEnemyDragons();
        moveObstacles();
        movePowerUps();
        moveCoins();
        moveFireballs();
        checkMissionCompletion();
        requestAnimationFrame(gameLoop);
    }
}

// Game control functions
function startGame() {
    initGame();
    hideAllScreens();
    gameScreen.style.display = 'block';
    gameLoop();
    enemyDragonInterval = setInterval(createEnemyDragon, 3000);
    obstacleInterval = setInterval(createObstacle, 2000);
    powerUpInterval = setInterval(createPowerUp, 10000);
    coinInterval = setInterval(createCoin, 1500);
}

function pauseGame() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseScreen.style.display = 'flex';
    } else {
        pauseScreen.style.display = 'none';
        gameLoop();
    }
}

function gameOver() {
    isGameOver = true;
    clearAllIntervals();
    gameOverScreen.style.display = 'flex';
    document.getElementById('final-score').textContent = `Final Score: ${score}`;
}

function clearAllIntervals() {
    clearInterval(enemyDragonInterval);
    clearInterval(obstacleInterval);
    clearInterval(powerUpInterval);
    clearInterval(coinInterval);
}

function hideAllScreens() {
    startScreen.style.display = 'none';
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    instructionsScreen.style.display = 'none';
    highScoresScreen.style.display = 'none';
    pauseScreen.style.display = 'none';
}

// Event listeners
startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
instructionsButton.addEventListener('click', () => {
    hideAllScreens();
    instructionsScreen.style.display = 'flex';
});
backButton.addEventListener('click', () => {
    hideAllScreens();
    startScreen.style.display = 'flex';
});
highScoresButton.addEventListener('click', () => {
    hideAllScreens();
    highScoresScreen.style.display = 'flex';
    // Implement high score display logic here
});
backFromScoresButton.addEventListener('click', () => {
    hideAllScreens();
    startScreen.style.display = 'flex';
});
resumeButton.addEventListener('click', pauseGame);
quitButton.addEventListener('click', () => {
    hideAllScreens();
    startScreen.style.display = 'flex';
});
submitScoreButton.addEventListener('click', () => {
    const playerName = document.getElementById('player-name').value;
    // Implement score submission logic here
});

document.addEventListener('keydown', (event) => {
    if (!isPaused && !isGameOver) {
        switch (event.key) {
            case 'ArrowUp':
                playerDragon.y = Math.max(playerDragon.y - playerDragon.speed, 0);
                break;
            case 'ArrowDown':
                playerDragon.y = Math.min(playerDragon.y + playerDragon.speed, GAME_HEIGHT - playerDragon.height);
                break;
            case 'ArrowLeft':
                playerDragon.x = Math.max(playerDragon.x - playerDragon.speed, 0);
                break;
            case 'ArrowRight':
                playerDragon.x = Math.min(playerDragon.x + playerDragon.speed, GAME_WIDTH - playerDragon.width);
                break;
            case ' ':
                if (!isBreathingFire) {
                    isBreathingFire = true;
                    createFireball();
                    setTimeout(() => { isBreathingFire = false; }, 500);
                }
                break;
            case 'p':
                pauseGame();
                break;
        }
        updateDragonPosition();
    }
});

// Initialize the game when the window loads
window.addEventListener('load', () => {
    hideAllScreens();
    startScreen.style.display = 'flex';
});