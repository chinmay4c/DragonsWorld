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

function activatePowerUp() {
    const powerUps = ['shield', 'speed', 'magnet'];
    activePowerUp = powerUps[Math.floor(Math.random() * powerUps.length)];
    isInvincible = true;
    dragon.style.filter = 'brightness(1.5) hue-rotate(90deg)';
    powerUpIndicator.textContent = `Power-up: ${activePowerUp}`;
    
    switch (activePowerUp) {
        case 'shield':
            // Shield logic (already implemented with isInvincible)
            break;
        case 'speed':
            dragon.style.transition = 'all 0.05s ease';
            break;
        case 'magnet':
            // Magnet logic will be implemented in the game loop
            break;
    }

    setTimeout(() => {
        isInvincible = false;
        dragon.style.filter = 'none';
        dragon.style.transition = 'all 0.1s ease';
        activePowerUp = null;
        powerUpIndicator.textContent = '';
    }, 10000);
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

function levelUp() {
    level++;
    const levelIndicator = document.createElement('div');
    levelIndicator.id = 'level-indicator';
    levelIndicator.textContent = `Level ${level}`;
    gameScreen.appendChild(levelIndicator);

    setTimeout(() => {
        gameScreen.removeChild(levelIndicator);
    }, 2000);

    // Increase game difficulty
    clearInterval(fireballInterval);
    clearInterval(obstacleInterval);
    clearInterval(powerUpInterval);
    clearInterval(enemyDragonInterval);

    fireballInterval = setInterval(createFireball, 2000 - level * 100);
    obstacleInterval = setInterval(createObstacle, 3000 - level * 150);
    powerUpInterval = setInterval(createPowerUp, 10000 - level * 500);
    enemyDragonInterval = setInterval(createEnemyDragon, 5000 - level * 200);
}

function gameLoop() {
    dragonX += 1;
    if (dragonX > 750) {
        gameOver();
    }

    if (activePowerUp === 'magnet') {
        const items = document.querySelectorAll('.fireball, .coin');
        items.forEach(item => {
            const itemRect = item.getBoundingClientRect();
            const dragonRect = dragon.getBoundingClientRect();
            const dx = (dragonRect.left + dragonRect.width / 2) - (itemRect.left + itemRect.width / 2);
            const dy = (dragonRect.top + dragonRect.height / 2) - (itemRect.top + itemRect.height / 2);
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 150) {
                item.style.left = `${parseInt(item.style.left) + dx / 10}px`;
                item.style.top = `${parseInt(item.style.top) + dy / 10}px`;
            }
        });
    }

    if (score > 0 && score % 100 === 0) {
        levelUp();
    }

    updateDragonPosition();
    requestAnimationFrame(gameLoop);
}

function startGame() {
    // ... (existing startGame code)

    enemyDragonInterval = setInterval(createEnemyDragon, 5000);
    setInterval(createCoin, 4000);

    requestAnimationFrame(gameLoop);
}
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

let highScores = [];
let currentMission = null;
let isPaused = false;

highScoresButton.addEventListener('click', showHighScores);
backFromScoresButton.addEventListener('click', () => {
    highScoresScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
});

resumeButton.addEventListener('click', resumeGame);
quitButton.addEventListener('click', quitToMenu);
submitScoreButton.addEventListener('click', submitScore);

document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !startScreen.classList.contains('hidden')) {
        togglePause();
    }
});

function showHighScores() {
    startScreen.classList.add('hidden');
    highScoresScreen.classList.remove('hidden');
    displayHighScores();
}

function displayHighScores() {
    highScoresList.innerHTML = '';
    highScores.sort((a, b) => b.score - a.score);
    highScores.slice(0, 10).forEach((score, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${score.name}: ${score.score}`;
        highScoresList.appendChild(li);
    });
}

function togglePause() {
    isPaused = !isPaused;
    if (isPaused) {
        pauseScreen.classList.remove('hidden');
        cancelAnimationFrame(gameLoop);
    } else {
        pauseScreen.classList.add('hidden');
        requestAnimationFrame(gameLoop);
    }
}

function resumeGame() {
    togglePause();
}

function quitToMenu() {
    isPaused = false;
    pauseScreen.classList.add('hidden');
    gameScreen.classList.add('hidden');
    startScreen.classList.remove('hidden');
    resetGame();
}

function submitScore() {
    const playerName = playerNameInput.value.trim();
    if (playerName) {
        highScores.push({ name: playerName, score: score });
        highScores.sort((a, b) => b.score - a.score);
        highScores = highScores.slice(0, 10);
        localStorage.setItem('highScores', JSON.stringify(highScores));
        showHighScores();
    }
}

function loadHighScores() {
    const savedScores = localStorage.getItem('highScores');
    if (savedScores) {
        highScores = JSON.parse(savedScores);
    }
}

function generateMission() {
    const missionTypes = [
        { type: 'score', target: 50 * level, description: 'Reach {target} points' },
        { type: 'coins', target: 10 * level, description: 'Collect {target} coins' },
        { type: 'survive', target: 30 * level, description: 'Survive for {target} seconds' }
    ];

    const randomMission = missionTypes[Math.floor(Math.random() * missionTypes.length)];
    currentMission = {
        ...randomMission,
        progress: 0,
        description: randomMission.description.replace('{target}', randomMission.target)
    };

    updateMissionIndicator();
}

function updateMissionIndicator() {
    missionIndicator.textContent = `Mission: ${currentMission.description} (${currentMission.progress}/${currentMission.target})`;
}

function updateMissionProgress() {
    switch (currentMission.type) {
        case 'score':
            currentMission.progress = score;
            break;
        case 'coins':
            currentMission.progress = coins;
            break;
        case 'survive':
            currentMission.progress = Math.floor((Date.now() - gameStartTime) / 1000);
            break;
    }

    if (currentMission.progress >= currentMission.target) {
        completeMission();
    }

    updateMissionIndicator();
}

function completeMission() {
    score += 100 * level;
    updateScore();
    generateMission();
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
    fireballInterval = setInterval(createFireball, 2000 - level * 100);
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

function updateScore() {
    scoreElement.textContent = `Score: ${score}`;
    coinsElement.textContent = `Coins: ${coins}`;
}

function updateHealthBar() {
    healthFill.style.width = `${health}%`;
}

function levelUp() {
    level++;
    levelIndicator.textContent = `Level: ${level}`;
    
    // Increase game difficulty
    clearInterval(obstacleInterval);
    clearInterval(powerUpInterval);
    clearInterval(enemyDragonInterval);
    clearInterval(coinInterval);

    obstacleInterval = setInterval(createObstacle, 3000 - level * 150);
    powerUpInterval = setInterval(createPowerUp, 10000 - level * 500);
    enemyDragonInterval = setInterval(createEnemyDragon, 5000 - level * 200);
    coinInterval = setInterval(createCoin, 4000 - level * 100);

    // Add a boss every 5 levels
    if (level % 5 === 0) {
        createBoss();
    }
}

function createBoss() {
    const boss = document.createElement('div');
    boss.classList.add('boss');
    boss.style.left = '800px';
    boss.style.top = '150px';
    boss.style.width = '100px';
    boss.style.height = '100px';
    boss.style.backgroundImage = 'url("https://example.com/boss.png")';
    boss.style.backgroundSize = 'contain';
    boss.style.backgroundRepeat = 'no-repeat';
    gameScreen.appendChild(boss);

    let bossHealth = 100 * level;
    let bossDirection = 1;

    const bossLoop = setInterval(() => {
        const left = parseInt(boss.style.left);
        const top = parseInt(boss.style.top);

        if (left > 600) {
            boss.style.left = (left - 1) + 'px';
        } else {
            boss.style.top = (top + bossDirection * 2) + 'px';
            if (top <= 0 || top >= 300) {
                bossDirection *= -1;
            }

            if (Math.random() < 0.05) {
                createBossProjectile(left, top);
            }
        }

        checkBossCollision(boss);
    }, 50);
