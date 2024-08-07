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
const instructionsButton = document.getElementById('instructions-button');
const instructionsScreen = document.getElementById('instructions-screen');
const backButton = document.getElementById('back-button');
const powerUpIndicator = document.getElementById('power-up-indicator');
const highScoresButton = document.getElementById('high-scores-button');
const highScoresScreen = document.getElementById('high-scores-screen');
const backFromScoresButton = document.getElementById('back-from-scores-button');
const highScoresList = document.getElementById('high-scores-list');
const pauseScreen = document.getElementById('pause-screen');
const resumeButton = document.getElementById('resume-button');
const quitButton = document.getElementById('quit-button');
const playerNameInput = document.getElementById('player-name');
const submitScoreButton = document.getElementById('submit-score');
const missionIndicator = document.getElementById('mission-indicator');
const levelIndicator = document.getElementById('level-indicator');

let dragonX = 0;
let dragonY = 200;
let score = 0;
let health = 100;
let gameLoop;
let fireballInterval;
let obstacleInterval;
let powerUpInterval;
let enemyDragonInterval;
let coinInterval;
let isInvincible = false;
let level = 1;
let coins = 0;
let activePowerUp = null;
let highScores = [];
let currentMission = null;
let isPaused = false;
let gameStartTime;

function updateDragonPosition() {
    dragon.style.left = dragonX + 'px';
    dragon.style.top = dragonY + 'px';
}

function createFireball(angle = 0) {
    const fireball = document.createElement('div');
    fireball.classList.add('fireball');
    fireball.style.left = `${dragonX + 60}px`;
    fireball.style.top = `${dragonY + 20}px`;
    gameScreen.appendChild(fireball);

    const fireballLoop = setInterval(() => {
        const left = parseInt(fireball.style.left);
        const top = parseInt(fireball.style.top);
        if (left < 800 && top > 0 && top < 400) {
            fireball.style.left = (left + 5 * Math.cos(angle * Math.PI / 180)) + 'px';
            fireball.style.top = (top + 5 * Math.sin(angle * Math.PI / 180)) + 'px';
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
    const powerUpTypes = ['shield', 'speed', 'magnet', 'multi-shot', 'health'];
    const type = powerUpTypes[Math.floor(Math.random() * powerUpTypes.length)];
    const powerUp = document.createElement('div');
    powerUp.classList.add('power-up');
    powerUp.dataset.type = type;
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
    const dragonRect = dragon.getBoundingClientRect();
    const elementRect = element.getBoundingClientRect();

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
                activatePowerUp(element.dataset.type);
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

function createExplosion(x, y) {
    const explosion = document.createElement('div');
    explosion.classList.add('explosion');
    explosion.style.left = `${x}px`;
    explosion.style.top = `${y}px`;
    gameScreen.appendChild(explosion);

    setTimeout(() => {
        gameScreen.removeChild(explosion);
    }, 500);
}

function updateScore() {
    scoreElement.textContent = `Score: ${score} | Coins: ${coins}`;
}

function updateHealthBar() {
    healthFill.style.width = `${health}%`;
}

function activatePowerUp(type) {
    isInvincible = true;
    dragon.style.filter = 'brightness(1.5) hue-rotate(90deg)';
    powerUpIndicator.textContent = `Power-up: ${type}`;
    
    switch (type) {
        case 'shield':
            // Shield logic (already implemented with isInvincible)
            break;
        case 'speed':
            dragon.style.transition = 'all 0.05s ease';
            break;
        case 'magnet':
            // Magnet logic will be implemented in the game loop
            break;
        case 'multi-shot':
            activateMultiShot();
            break;
        case 'health':
            health = Math.min(health + 30, 100);
            updateHealthBar();
            break;
    }

    setTimeout(() => {
        deactivatePowerUp(type);
    }, 10000);
}

function deactivatePowerUp(type) {
    isInvincible = false;
    dragon.style.filter = 'none';
    dragon.style.transition = 'all 0.1s ease';
    powerUpIndicator.textContent = '';

    switch (type) {
        case 'multi-shot':
            deactivateMultiShot();
            break;
    }
}

function activateMultiShot() {
    clearInterval(fireballInterval);
    fireballInterval = setInterval(() => {
        createFireball(0);
        createFireball(-30);
        createFireball(30);
    }, 1000);
}

function deactivateMultiShot() {
    clearInterval(fireballInterval);
    fireballInterval = setInterval(() => {
        createFireball();
    }, 1000);
}

function loadHighScores() {
    const storedScores = localStorage.getItem('highScores');
    if (storedScores) {
        highScores = JSON.parse(storedScores);
    }
}

function saveHighScores() {
    localStorage.setItem('highScores', JSON.stringify(highScores));
}

function displayHighScores() {
    highScoresList.innerHTML = '';
    highScores.forEach((score, index) => {
        const listItem = document.createElement('li');
        listItem.textContent = `${index + 1}. ${score.name} - ${score.score}`;
        highScoresList.appendChild(listItem);
    });
}

function updateMission() {
    // Define mission types and conditions
    const missions = [
        { description: "Collect 10 coins", condition: () => coins >= 10 },
        { description: "Reach a score of 100", condition: () => score >= 100 },
        { description: "Survive for 1 minute", condition: () => (new Date().getTime() - gameStartTime) >= 60000 }
    ];

    // If there's no current mission or it is completed, assign a new mission
    if (!currentMission || currentMission.condition()) {
        currentMission = missions[Math.floor(Math.random() * missions.length)];
    }

    missionIndicator.textContent = `Mission: ${currentMission.description}`;
}

function gameOver() {
    clearInterval(gameLoop);
    clearInterval(obstacleInterval);
    clearInterval(powerUpInterval);
    clearInterval(enemyDragonInterval);
    clearInterval(coinInterval);
    clearInterval(fireballInterval);

    finalScoreElement.textContent = `Final Score: ${score}`;
    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'flex';
}

function startGame() {
    score = 0;
    health = 100;
    level = 1;
    coins = 0;
    isPaused = false;
    gameStartTime = new Date().getTime();

    updateScore();
    updateHealthBar();
    updateMission();

    gameScreen.style.display = 'block';
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'none';
    instructionsScreen.style.display = 'none';
    highScoresScreen.style.display = 'none';
    pauseScreen.style.display = 'none';

    gameLoop = setInterval(() => {
        updateDragonPosition();
        updateMission();
    }, 50);

    fireballInterval = setInterval(() => {
        createFireball();
    }, 1000);

    obstacleInterval = setInterval(() => {
        createObstacle();
    }, 2000);

    powerUpInterval = setInterval(() => {
        createPowerUp();
    }, 10000);

    enemyDragonInterval = setInterval(() => {
        createEnemyDragon();
    }, 15000);

    coinInterval = setInterval(() => {
        createCoin();
    }, 5000);
}

function pauseGame() {
    if (isPaused) {
        gameLoop = setInterval(() => {
            updateDragonPosition();
            updateMission();
        }, 50);
        fireballInterval = setInterval(() => {
            createFireball();
        }, 1000);
        obstacleInterval = setInterval(() => {
            createObstacle();
        }, 2000);
        powerUpInterval = setInterval(() => {
            createPowerUp();
        }, 10000);
        enemyDragonInterval = setInterval(() => {
            createEnemyDragon();
        }, 15000);
        coinInterval = setInterval(() => {
            createCoin();
        }, 5000);
        pauseScreen.style.display = 'none';
    } else {
        clearInterval(gameLoop);
        clearInterval(fireballInterval);
        clearInterval(obstacleInterval);
        clearInterval(powerUpInterval);
        clearInterval(enemyDragonInterval);
        clearInterval(coinInterval);
        pauseScreen.style.display = 'flex';
    }
    isPaused = !isPaused;
}

function quitGame() {
    clearInterval(gameLoop);
    clearInterval(fireballInterval);
    clearInterval(obstacleInterval);
    clearInterval(powerUpInterval);
    clearInterval(enemyDragonInterval);
    clearInterval(coinInterval);

    gameScreen.style.display = 'none';
    gameOverScreen.style.display = 'none';
    startScreen.style.display = 'flex';
    pauseScreen.style.display = 'none';
}

startButton.addEventListener('click', startGame);
restartButton.addEventListener('click', startGame);
instructionsButton.addEventListener('click', () => {
    startScreen.style.display = 'none';
    instructionsScreen.style.display = 'flex';
});
backButton.addEventListener('click', () => {
    instructionsScreen.style.display = 'none';
    startScreen.style.display = 'flex';
});
highScoresButton.addEventListener('click', () => {
    loadHighScores();
    displayHighScores();
    startScreen.style.display = 'none';
    highScoresScreen.style.display = 'flex';
});
backFromScoresButton.addEventListener('click', () => {
    highScoresScreen.style.display = 'none';
    startScreen.style.display = 'flex';
});
resumeButton.addEventListener('click', pauseGame);
quitButton.addEventListener('click', quitGame);
submitScoreButton.addEventListener('click', () => {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        highScores.push({ name: playerName, score });
        highScores.sort((a, b) => b.score - a.score);
        if (highScores.length > 10) {
            highScores.pop();
        }
        saveHighScores();
        playerNameInput.value = '';
        gameOverScreen.style.display = 'none';
        highScoresScreen.style.display = 'flex';
        displayHighScores();
    }
});

document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            dragonY = Math.max(dragonY - 20, 0);
            break;
        case 'ArrowDown':
            dragonY = Math.min(dragonY + 20, 380);
            break;
        case 'ArrowLeft':
            dragonX = Math.max(dragonX - 20, 0);
            break;
        case 'ArrowRight':
            dragonX = Math.min(dragonX + 20, 740);
            break;
        case ' ':
            createFireball();
            break;
        case 'p':
            pauseGame();
            break;
        case 'q':
            quitGame();
            break;
    }
});

window.addEventListener('load', () => {
    loadHighScores();
});
