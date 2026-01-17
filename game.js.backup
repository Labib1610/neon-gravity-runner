// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Resize canvas to fill window
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

// Initialize canvas size
resizeCanvas();

// Handle window resize
window.addEventListener('resize', resizeCanvas);

// Player class
class Player {
    constructor() {
        this.x = 100;
        this.y = 0;
        this.width = 40;
        this.height = 40;
        this.color = '#39FF14'; // Neon green
        this.gravityState = 'floor'; // 'floor' or 'ceiling'
        this.targetY = 0;
        this.lerpSpeed = 0.15; // Interpolation speed
    }

    toggleGravity() {
        this.gravityState = this.gravityState === 'floor' ? 'ceiling' : 'floor';
    }

    update(deltaTime) {
        // Calculate target Y position based on gravity state
        if (this.gravityState === 'floor') {
            this.targetY = canvas.height - 100;
        } else {
            this.targetY = 100;
        }

    player.update(deltaTime); position
        this.y += (this.targetY - this.y) * this.lerpSpeed;
    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }

    render() {
        // Set up neon glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        // Draw the player
        ctx.fillRect(this.x, this.y - this.height / 2, this.width, this.height);

        // Reset shadow
        ctx.shadowBlur = 0;
    }
}

// Obstacle class
class Obstacle {
    constructor(position) {
        this.x = canvas.width;
        this.size = 30;
        this.color = '#FF1744'; // Neon red
        this.speed = baseObstacleSpeed;
        this.position = position; // 'floor' or 'ceiling'
        
        if (this.position === 'floor') {
            this.y = canvas.height - 100;
        } else {
            this.y = 100;
        }
    }

    update() {
        this.x -= this.speed;
    }

    render() {
        // Set up neon glow effect
        ctx.shadowBlur = 20;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        // Draw triangular spike
        ctx.beginPath();
        if (this.position === 'floor') {
            // Triangle pointing up from floor
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.lineTo(this.x + this.size / 2, this.y - this.size);
        } else {
            // Triangle pointing down from ceiling
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.lineTo(this.x + this.size / 2, this.y + this.size);
        }
        ctx.closePath();
        ctx.fill();

        // Reset shadow
        ctx.shadowBlur = 0;
    }

    getBoundingBox() {
        // Simple bounding box for triangle
        if (this.position === 'floor') {
            return {
                x: this.x,
                y: this.y - this.size,
                width: this.size,
                height: this.size
            };
        } else {
            return {
                x: this.x,
                y: this.y,
                width: this.size,
                height: this.size
            };
        }
    }

    isOffScreen() {
        return this.x + this.size < 0;
    }
}

// Create player instance
const player = new Player();

// Obstacle system
const obstacles = [];
let spawnTimer = 0;
let nextSpawnTime = Math.floor(Math.random() * 61) + 60; // Random 60-120 frames
let baseObstacleSpeed = 8;

// Game state
let gameState = 'playing'; // 'playing' or 'gameOver'
let score = 0;

// Input handling
function handleGravityToggle() {
    if (gameState === 'playing') {
        player.toggleGravity();
    }
}

function handleRestart() {
    if (gameState === 'gameOver') {
        // Reset game
        gameState = 'playing';
        score = 0;
        baseObstacleSpeed = 8;
        obstacles.length = 0;
        spawnTimer = 0;
        nextSpawnTime = Math.floor(Math.random() * 61) + 60;
        player.gravityState = 'floor';
        player.y = canvas.height - 100;
        player.targetY = canvas.height - 100;
    }
}

// Keyboard input
window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleGravityToggle();
    }
});

// Mouse input
canvas.addEventListener('click', () => {
    if (gameState === 'playing') {
        handleGravityToggle();
    } else if (gameState === 'gameOver') {
        handleRestart();
    }
});

// Game state
let lastTime = 0;

// Collision detection
function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// Game loop
function gameLoop(timestamp) {
    // Calculate delta time
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    // Clear canvas
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Update game logic here
    if (gameState === 'playing') {
        update(deltaTime);
    }

    // Render game graphics here
    render();

    // Continue the loop
    requestAnimationFrame(gameLoop);
}

// Update function
function update(deltaTime) {
    player.update(deltaTime);
    
    // Increase score
    score++;
    
    // Increase difficulty every 500 points
    const difficultyLevel = Math.floor(score / 500);
    baseObstacleSpeed = 8 + difficultyLevel * 0.5;
    
    // Update spawn timer
    spawnTimer++;
    if (spawnTimer >= nextSpawnTime) {
        // Spawn new obstacle
        const position = Math.random() < 0.5 ? 'floor' : 'ceiling';
        obstacles.push(new Obstacle(position));
        
        // Reset timer with new random interval
        spawnTimer = 0;
        nextSpawnTime = Math.floor(Math.random() * 61) + 60;
    }
    
    // Update all obstacles
    for (let i = 0; i < obstacles.length; i++) {
        obstacles[i].update();
    }
    
    // Check collisions
    const playerBox = player.getBoundingBox();
    for (let obstacle of obstacles) {
        const obstacleBox = obstacle.getBoundingBox();
        if (checkCollision(playerBox, obstacleBox)) {
            gameState = 'gameOver';
            break;
        }
    }
    
    // Remove off-screen obstacles
    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].isOffScreen()) {
            obstacles.splice(i, 1);
        }
    }
}

// Render function
function render() {
    // Draw environment lines
    const lineColor = '#00D9FF'; // Neon blue
    ctx.shadowBlur = 15;
    ctx.shadowColor = lineColor;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;
    
    // Floor line
    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 100);
    ctx.lineTo(canvas.width, canvas.height - 100);
    ctx.stroke();
    
    // Ceiling line
    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(canvas.width, 100);
    ctx.stroke();
    
    ctx.shadowBlur = 0;
    
    // Render all obstacles
    for (let obstacle of obstacles) {
        obstacle.render();
    }
    
    // Render player
    player.render();
    
    // Draw score
    ctx.shadowBlur = 10;
    ctx.shadowColor = '#39FF14';
    ctx.fillStyle = '#39FF14';
    ctx.font = 'bold 24px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(`Score: ${score}`, 20, 40);
    ctx.shadowBlur = 0;
    
    // Draw game over screen
    if (gameState === 'gameOver') {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.shadowBlur = 30;
        ctx.shadowColor = '#FF1744';
        ctx.fillStyle = '#FF1744';
        ctx.font = 'bold 72px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 40);
        
        ctx.shadowColor = '#39FF14';
        ctx.fillStyle = '#39FF14';
        ctx.font = 'bold 32px Arial';
        ctx.fillText(`Final Score: ${score}`, canvas.width / 2, canvas.height / 2 + 30);
        
        ctx.shadowColor = '#00D9FF';
        ctx.fillStyle = '#00D9FF';
        ctx.font = 'bold 24px Arial';
        ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 80);
        
        ctx.shadowBlur = 0;
    }
}

// Start the game loop
requestAnimationFrame(gameLoop);