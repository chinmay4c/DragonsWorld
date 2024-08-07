const dragon = document.getElementById('dragon');
const gameContainer = document.getElementById('game-container');
const scoreElement = document.getElementById('score');

let dragonX = 0;
let dragonY = 200;
let score = 0;
let gameLoop;
let fireballInterval;

function updateDragonPosition() {
    dragon.style.left = dragonX + 'px';
    dragon.style.top = dragonY + 'px';
}

function createFireball() {
    const fireball = document.createElement('div');
    fireball.classList.add('fireball');
    fireball.style.left = '800px';
    fireball.style.top = Math.random() * 380 + 'px';
    gameContainer.appendChild(fireball);

    const fireballLoop = setInterval(() => {
        const left = parseInt(fireball.style.left);
        if (left > -20) {
            fireball.style.left = (left - 5) + 'px';
            checkCollision(fireball);
        } else {
            clearInterval(fireballLoop);
            gameContainer.removeChild(fireball);
        }
    }, 50);
}

function checkCollision(fireball) {
    const dragonRect = dragon.getBoundingClientRect();
    const fireballRect = fireball.getBoundingClientRect();

    if (
        dragonRect.left < fireballRect.right &&
        dragonRect.right > fireballRect.left &&
        dragonRect.top < fireballRect.bottom &&
        dragonRect.bottom > fireballRect.top
    ) {
        score++;
        scoreElement.textContent = `Score: ${score}`;
        gameContainer.removeChild(fireball);
    }
}

function gameOver() {
    clearInterval(gameLoop);
    clearInterval(fireballInterval);
    alert(`Game Over! Your score: ${score}`);
}

function startGame() {
    dragonX = 0;
    dragonY = 200;
    score = 0;
    scoreElement.textContent = 'Score: 0';
    updateDragonPosition();

    gameLoop = setInterval(() => {
        dragonX += 1;
        if (dragonX > 750) {
            gameOver();
        }
        updateDragonPosition();
    }, 50);

    fireballInterval = setInterval(createFireball, 2000);
}

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (dragonY > 0) dragonY -= 10;
            break;
        case 'ArrowDown':
            if (dragonY < 350) dragonY += 10;
            break;
        case 'ArrowLeft':
            if (dragonX > 0) dragonX -= 10;
            break;
        case 'ArrowRight':
            if (dragonX < 750) dragonX += 10;
            break;
    }
    updateDragonPosition();
});

startGame();