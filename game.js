// ===================================
// NEON GRAVITY RUNNER - Enhanced Edition
// A gravity-defying browser game with advanced features
// ===================================

// Get canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// ===================================
// GAME CONFIGURATION
// ===================================

const CONFIG = {
    difficulty: {
        easy: { speedMultiplier: 0.7, spawnRate: 1.5 },
        normal: { speedMultiplier: 1, spawnRate: 1 },
        hard: { speedMultiplier: 1.3, spawnRate: 0.7 },
        insane: { speedMultiplier: 1.6, spawnRate: 0.5 }
    },
    effects: {
        high: { particles: 100, glow: 30, trails: true },
        medium: { particles: 50, glow: 15, trails: true },
        low: { particles: 20, glow: 10, trails: false }
    }
};

// ===================================
// GAME STATE & SETTINGS
// ===================================

let gameState = 'menu';
let score = 0;
let highScore = 0;
let level = 1;
let combo = 0;
let maxCombo = 0;

// Settings
let settings = {
    difficulty: 'normal',
    effects: 'high',
    particleDensity: 75,
    screenShake: true
};

// Statistics
let stats = {
    gamesPlayed: 0,
    totalTimePlayed: 0,
    obstaclesDodged: 0,
    powerUpsCollected: 0,
    perfectDodges: 0,
    highScore: 0
};

// Achievements
const achievements = [
    { id: 'first_blood', name: 'First Blood', desc: 'Score 100 points', unlocked: false, threshold: 100 },
    { id: 'survivor', name: 'Survivor', desc: 'Score 500 points', unlocked: false, threshold: 500 },
    { id: 'pro_runner', name: 'Pro Runner', desc: 'Score 1000 points', unlocked: false, threshold: 1000 },
    { id: 'gravity_master', name: 'Gravity Master', desc: 'Score 2500 points', unlocked: false, threshold: 2500 },
    { id: 'combo_king', name: 'Combo King', desc: 'Get a 10x combo', unlocked: false, combo: 10 },
    { id: 'power_collector', name: 'Power Collector', desc: 'Collect 50 power-ups', unlocked: false, powerups: 50 },
    { id: 'dodge_master', name: 'Dodge Master', desc: 'Perfect dodge 100 obstacles', unlocked: false, dodges: 100 }
];

// ===================================
// CANVAS SETUP
// ===================================

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// ===================================
// PARTICLE SYSTEM
// ===================================

class Particle {
    constructor(x, y, color, velocity = { x: 0, y: 0 }) {
        this.x = x;
        this.y = y;
        this.color = color;
        this.vx = velocity.x || (Math.random() - 0.5) * 8;
        this.vy = velocity.y || (Math.random() - 0.5) * 8;
        this.life = 1;
        this.decay = Math.random() * 0.02 + 0.01;
        this.size = Math.random() * 4 + 2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += 0.2;
        this.life -= this.decay;
        this.vx *= 0.98;
    }

    render() {
        if (this.life <= 0) return;
        
        ctx.globalAlpha = this.life;
        ctx.shadowBlur = 15;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        ctx.fillRect(this.x - this.size / 2, this.y - this.size / 2, this.size, this.size);
        ctx.globalAlpha = 1;
        ctx.shadowBlur = 0;
    }

    isDead() {
        return this.life <= 0;
    }
}

const particles = [];

function createExplosion(x, y, color, count = 20) {
    const effectSettings = CONFIG.effects[settings.effects];
    const adjustedCount = Math.floor(count * (settings.particleDensity / 100));
    
    for (let i = 0; i < adjustedCount; i++) {
        particles.push(new Particle(x, y, color));
    }
}

function createTrail(x, y, color) {
    if (!CONFIG.effects[settings.effects].trails) return;
    
    const trailCount = Math.floor(3 * (settings.particleDensity / 100));
    for (let i = 0; i < trailCount; i++) {
        particles.push(new Particle(x, y, color, { x: 0, y: (Math.random() - 0.5) * 2 }));
    }
}

// ===================================
// PLAYER CLASS
// ===================================

class Player {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = 100;
        this.y = 0;
        this.width = 40;
        this.height = 40;
        this.color = '#39FF14';
        this.gravityState = 'floor';
        this.targetY = 0;
        this.lerpSpeed = 0.15;
        this.rotation = 0;
        this.targetRotation = 0;
        this.shield = false;
        this.shieldTime = 0;
        this.slowMo = false;
        this.slowMoTime = 0;
        this.multiplier = 1;
        this.multiplierTime = 0;
        this.pulseScale = 1;
        this.pulseDirection = 1;
    }

    toggleGravity() {
        this.gravityState = this.gravityState === 'floor' ? 'ceiling' : 'floor';
        this.targetRotation += 180;
        createExplosion(this.x + this.width / 2, this.y, this.color, 15);
    }

    update(deltaTime) {
        if (this.gravityState === 'floor') {
            this.targetY = canvas.height - 100;
        } else {
            this.targetY = 100;
        }

        this.y += (this.targetY - this.y) * this.lerpSpeed;
        this.rotation += (this.targetRotation - this.rotation) * 0.1;
        
        this.pulseScale += 0.01 * this.pulseDirection;
        if (this.pulseScale > 1.1 || this.pulseScale < 0.9) {
            this.pulseDirection *= -1;
        }

        if (this.shield && this.shieldTime > 0) {
            this.shieldTime -= deltaTime;
            if (this.shieldTime <= 0) this.shield = false;
        }

        if (this.slowMo && this.slowMoTime > 0) {
            this.slowMoTime -= deltaTime;
            if (this.slowMoTime <= 0) this.slowMo = false;
        }

        if (this.multiplier > 1 && this.multiplierTime > 0) {
            this.multiplierTime -= deltaTime;
            if (this.multiplierTime <= 0) this.multiplier = 1;
        }

        if (Math.random() < 0.3) {
            createTrail(this.x, this.y, this.color);
        }
    }

    render() {
        ctx.save();
        ctx.translate(this.x + this.width / 2, this.y);

        if (this.shield) {
            const effectSettings = CONFIG.effects[settings.effects];
            ctx.shadowBlur = effectSettings.glow * 2;
            ctx.shadowColor = '#00D9FF';
            ctx.strokeStyle = '#00D9FF';
            ctx.lineWidth = 3;
            ctx.beginPath();
            ctx.arc(0, 0, 35, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (this.multiplier > 1) {
            const effectSettings = CONFIG.effects[settings.effects];
            ctx.shadowBlur = effectSettings.glow * 1.5;
            ctx.shadowColor = '#FFD700';
            ctx.strokeStyle = '#FFD700';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(0, 0, 30, 0, Math.PI * 2);
            ctx.stroke();
        }

        const effectSettings = CONFIG.effects[settings.effects];
        ctx.shadowBlur = effectSettings.glow;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;
        
        const scale = this.pulseScale;
        const w = this.width * scale;
        const h = this.height * scale;
        
        ctx.fillRect(-w / 2, -h / 2, w, h);

        ctx.shadowBlur = 0;
        ctx.restore();
    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y - this.height / 2,
            width: this.width,
            height: this.height
        };
    }
}

// ===================================
// OBSTACLE CLASS
// ===================================

class Obstacle {
    constructor(position) {
        this.x = canvas.width;
        this.size = 30;
        this.color = '#FF1744';
        this.speed = baseObstacleSpeed * CONFIG.difficulty[settings.difficulty].speedMultiplier;
        this.position = position;
        this.passed = false;
        
        if (this.position === 'floor') {
            this.y = canvas.height - 100;
        } else {
            this.y = 100;
        }
    }

    update() {
        const slowMoMultiplier = player.slowMo ? 0.3 : 1;
        this.x -= this.speed * slowMoMultiplier;

        if (!this.passed && this.x + this.size < player.x) {
            this.passed = true;
            stats.obstaclesDodged++;
            
            const distance = Math.abs(this.x + this.size - player.x);
            if (distance < 20) {
                combo++;
                maxCombo = Math.max(maxCombo, combo);
                stats.perfectDodges++;
                createExplosion(this.x, this.y, '#FFD700', 10);
            } else {
                combo = 0;
            }
        }
    }

    render() {
        const effectSettings = CONFIG.effects[settings.effects];
        ctx.shadowBlur = effectSettings.glow;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        if (this.position === 'floor') {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.lineTo(this.x + this.size / 2, this.y - this.size);
        } else {
            ctx.moveTo(this.x, this.y);
            ctx.lineTo(this.x + this.size, this.y);
            ctx.lineTo(this.x + this.size / 2, this.y + this.size);
        }
        ctx.closePath();
        ctx.fill();

        ctx.shadowBlur = 0;
    }

    getBoundingBox() {
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

// ===================================
// POWER-UP CLASS
// ===================================

class PowerUp {
    constructor() {
        this.x = canvas.width;
        this.y = Math.random() < 0.5 ? canvas.height - 150 : 150;
        this.size = 20;
        this.speed = baseObstacleSpeed * 0.8;
        this.rotation = 0;
        this.collected = false;
        
        const rand = Math.random();
        if (rand < 0.4) {
            this.type = 'shield';
            this.color = '#00D9FF';
            this.symbol = '🛡️';
        } else if (rand < 0.7) {
            this.type = 'slowmo';
            this.color = '#9C27B0';
            this.symbol = '⏱️';
        } else {
            this.type = 'multiplier';
            this.color = '#FFD700';
            this.symbol = '⭐';
        }
    }

    update() {
        const slowMoMultiplier = player.slowMo ? 0.3 : 1;
        this.x -= this.speed * slowMoMultiplier;
        this.rotation += 0.05;
        this.y += Math.sin(Date.now() * 0.003) * 0.5;
    }

    render() {
        ctx.save();
        ctx.translate(this.x + this.size / 2, this.y);
        ctx.rotate(this.rotation);

        const effectSettings = CONFIG.effects[settings.effects];
        ctx.shadowBlur = effectSettings.glow;
        ctx.shadowColor = this.color;
        ctx.fillStyle = this.color;

        ctx.beginPath();
        ctx.arc(0, 0, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(this.symbol, 0, 0);

        ctx.restore();
    }

    getBoundingBox() {
        return {
            x: this.x,
            y: this.y - this.size,
            width: this.size * 2,
            height: this.size * 2
        };
    }

    isOffScreen() {
        return this.x + this.size < 0;
    }

    collect() {
        this.collected = true;
        stats.powerUpsCollected++;
        createExplosion(this.x, this.y, this.color, 25);

        switch (this.type) {
            case 'shield':
                player.shield = true;
                player.shieldTime = 5000;
                break;
            case 'slowmo':
                player.slowMo = true;
                player.slowMoTime = 3000;
                break;
            case 'multiplier':
                player.multiplier = 2;
                player.multiplierTime = 8000;
                break;
        }
    }
}

// ===================================
// BACKGROUND EFFECTS
// ===================================

class Star {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speed = Math.random() * 2 + 1;
        this.opacity = Math.random();
    }

    update() {
        this.x -= this.speed;
        if (this.x < 0) {
            this.x = canvas.width;
            this.y = Math.random() * canvas.height;
        }
    }

    render() {
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = '#fff';
        ctx.fillRect(this.x, this.y, this.size, this.size);
        ctx.globalAlpha = 1;
    }
}

// ===================================
// GAME VARIABLES
// ===================================

const player = new Player();
const obstacles = [];
const powerUps = [];
const stars = [];

let spawnTimer = 0;
let nextSpawnTime = 60;
let powerUpTimer = 0;
let nextPowerUpTime = 300;
let baseObstacleSpeed = 8;

let lastTime = 0;
let gameTime = 0;
let shakeX = 0;
let shakeY = 0;

for (let i = 0; i < 100; i++) {
    stars.push(new Star());
}

// ===================================
// COLLISION DETECTION
// ===================================

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

// ===================================
// SCREEN SHAKE
// ===================================

function applyScreenShake(intensity = 10) {
    if (!settings.screenShake) return;
    
    shakeX = (Math.random() - 0.5) * intensity;
    shakeY = (Math.random() - 0.5) * intensity;
    
    setTimeout(() => {
        shakeX = 0;
        shakeY = 0;
    }, 100);
}

// ===================================
// ACHIEVEMENT SYSTEM
// ===================================

function checkAchievements() {
    achievements.forEach(achievement => {
        if (achievement.unlocked) return;

        let shouldUnlock = false;

        if (achievement.threshold && score >= achievement.threshold) {
            shouldUnlock = true;
        } else if (achievement.combo && maxCombo >= achievement.combo) {
            shouldUnlock = true;
        } else if (achievement.powerups && stats.powerUpsCollected >= achievement.powerups) {
            shouldUnlock = true;
        } else if (achievement.dodges && stats.perfectDodges >= achievement.dodges) {
            shouldUnlock = true;
        }

        if (shouldUnlock) {
            achievement.unlocked = true;
            showAchievement(achievement.name, achievement.desc);
        }
    });
}

function showAchievement(name, desc) {
    const popup = document.getElementById('achievementPopup');
    const text = document.getElementById('achievementText');
    
    text.textContent = `${name}: ${desc}`;
    popup.classList.add('show');
    
    setTimeout(() => {
        popup.classList.remove('show');
    }, 3000);
}

// ===================================
// LEVEL SYSTEM
// ===================================

function updateLevel() {
    const newLevel = Math.floor(score / 500) + 1;
    if (newLevel > level) {
        level = newLevel;
        createExplosion(canvas.width / 2, canvas.height / 2, '#FFD700', 50);
        applyScreenShake(15);
    }
}

// ===================================
// GAME LOOP
// ===================================

function gameLoop(timestamp) {
    const deltaTime = timestamp - lastTime;
    lastTime = timestamp;

    ctx.save();
    ctx.translate(shakeX, shakeY);
    
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    for (let star of stars) {
        star.update();
        star.render();
    }

    if (gameState === 'playing') {
        update(deltaTime);
    }

    render();
    ctx.restore();

    requestAnimationFrame(gameLoop);
}

// ===================================
// UPDATE FUNCTION
// ===================================

function update(deltaTime) {
    gameTime += deltaTime;
    player.update(deltaTime);

    score += Math.floor(player.multiplier);
    updateLevel();

    const difficultyLevel = Math.floor(score / 500);
    baseObstacleSpeed = 8 + difficultyLevel * 0.5;

    spawnTimer++;
    const spawnRate = CONFIG.difficulty[settings.difficulty].spawnRate;
    if (spawnTimer >= nextSpawnTime * spawnRate) {
        const position = Math.random() < 0.5 ? 'floor' : 'ceiling';
        obstacles.push(new Obstacle(position));
        spawnTimer = 0;
        nextSpawnTime = Math.floor(Math.random() * 61) + 60;
    }

    powerUpTimer++;
    if (powerUpTimer >= nextPowerUpTime) {
        powerUps.push(new PowerUp());
        powerUpTimer = 0;
        nextPowerUpTime = Math.floor(Math.random() * 200) + 300;
    }

    for (let obstacle of obstacles) {
        obstacle.update();
    }

    for (let powerUp of powerUps) {
        powerUp.update();
    }

    for (let particle of particles) {
        particle.update();
    }

    const playerBox = player.getBoundingBox();
    for (let obstacle of obstacles) {
        const obstacleBox = obstacle.getBoundingBox();
        if (checkCollision(playerBox, obstacleBox)) {
            if (player.shield) {
                player.shield = false;
                player.shieldTime = 0;
                createExplosion(obstacle.x, obstacle.y, '#00D9FF', 30);
                obstacles.splice(obstacles.indexOf(obstacle), 1);
            } else {
                endGame();
                return;
            }
        }
    }

    for (let powerUp of powerUps) {
        if (!powerUp.collected) {
            const powerUpBox = powerUp.getBoundingBox();
            if (checkCollision(playerBox, powerUpBox)) {
                powerUp.collect();
            }
        }
    }

    for (let i = obstacles.length - 1; i >= 0; i--) {
        if (obstacles[i].isOffScreen()) {
            obstacles.splice(i, 1);
        }
    }

    for (let i = powerUps.length - 1; i >= 0; i--) {
        if (powerUps[i].isOffScreen() || powerUps[i].collected) {
            powerUps.splice(i, 1);
        }
    }

    for (let i = particles.length - 1; i >= 0; i--) {
        if (particles[i].isDead()) {
            particles.splice(i, 1);
        }
    }

    checkAchievements();
}

// ===================================
// RENDER FUNCTION
// ===================================

function render() {
    const effectSettings = CONFIG.effects[settings.effects];
    
    const lineColor = '#00D9FF';
    ctx.shadowBlur = effectSettings.glow * 0.5;
    ctx.shadowColor = lineColor;
    ctx.strokeStyle = lineColor;
    ctx.lineWidth = 3;

    ctx.beginPath();
    ctx.moveTo(0, canvas.height - 100);
    ctx.lineTo(canvas.width, canvas.height - 100);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0, 100);
    ctx.lineTo(canvas.width, 100);
    ctx.stroke();

    ctx.shadowBlur = 0;

    for (let particle of particles) {
        particle.render();
    }

    for (let obstacle of obstacles) {
        obstacle.render();
    }

    for (let powerUp of powerUps) {
        powerUp.render();
    }

    player.render();

    if (gameState === 'playing') {
        drawHUD();
    } else if (gameState === 'gameOver') {
        drawGameOver();
    }
}

// ===================================
// HUD RENDERING
// ===================================

function drawHUD() {
    const effectSettings = CONFIG.effects[settings.effects];
    
    ctx.shadowBlur = effectSettings.glow * 0.5;
    ctx.shadowColor = '#39FF14';
    ctx.fillStyle = '#39FF14';
    ctx.font = 'bold 32px Orbitron, monospace';
    ctx.textAlign = 'left';
    ctx.fillText(`SCORE: ${score}`, 20, 50);

    ctx.shadowColor = '#00D9FF';
    ctx.fillStyle = '#00D9FF';
    ctx.font = 'bold 20px Orbitron, monospace';
    ctx.fillText(`LEVEL ${level}`, 20, 85);

    if (combo > 0) {
        ctx.shadowColor = '#FFD700';
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 24px Orbitron, monospace';
        ctx.textAlign = 'center';
        ctx.fillText(`${combo}x COMBO!`, canvas.width / 2, 50);
    }

    ctx.textAlign = 'right';
    ctx.font = 'bold 18px Orbitron, monospace';
    let yOffset = 50;

    if (player.shield) {
        ctx.shadowColor = '#00D9FF';
        ctx.fillStyle = '#00D9FF';
        ctx.fillText(`🛡️ SHIELD: ${(player.shieldTime / 1000).toFixed(1)}s`, canvas.width - 20, yOffset);
        yOffset += 30;
    }

    if (player.slowMo) {
        ctx.shadowColor = '#9C27B0';
        ctx.fillStyle = '#9C27B0';
        ctx.fillText(`⏱️ SLOW-MO: ${(player.slowMoTime / 1000).toFixed(1)}s`, canvas.width - 20, yOffset);
        yOffset += 30;
    }

    if (player.multiplier > 1) {
        ctx.shadowColor = '#FFD700';
        ctx.fillStyle = '#FFD700';
        ctx.fillText(`⭐ ${player.multiplier}x: ${(player.multiplierTime / 1000).toFixed(1)}s`, canvas.width - 20, yOffset);
    }

    ctx.shadowBlur = 0;
}

// ===================================
// GAME OVER SCREEN
// ===================================

function drawGameOver() {
    const effectSettings = CONFIG.effects[settings.effects];
    
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.shadowBlur = effectSettings.glow * 1.5;
    ctx.shadowColor = '#FF1744';
    ctx.fillStyle = '#FF1744';
    ctx.font = 'bold 72px Orbitron, monospace';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2 - 80);

    ctx.shadowColor = '#39FF14';
    ctx.fillStyle = '#39FF14';
    ctx.font = 'bold 36px Orbitron, monospace';
    ctx.fillText(`SCORE: ${score}`, canvas.width / 2, canvas.height / 2 - 10);

    if (score > highScore) {
        ctx.shadowColor = '#FFD700';
        ctx.fillStyle = '#FFD700';
        ctx.font = 'bold 28px Orbitron, monospace';
        ctx.fillText('🏆 NEW HIGH SCORE! 🏆', canvas.width / 2, canvas.height / 2 + 35);
    }

    ctx.shadowColor = '#00D9FF';
    ctx.fillStyle = '#00D9FF';
    ctx.font = 'bold 24px Orbitron, monospace';
    ctx.fillText(`Level ${level} • Max Combo: ${maxCombo}x`, canvas.width / 2, canvas.height / 2 + 75);

    ctx.font = 'bold 20px Orbitron, monospace';
    ctx.fillText('Click to Restart', canvas.width / 2, canvas.height / 2 + 120);

    ctx.shadowBlur = 0;
}

// ===================================
// GAME STATE MANAGEMENT
// ===================================

function startGame() {
    document.getElementById('mainMenu').classList.add('hidden');
    
    gameState = 'playing';
    score = 0;
    level = 1;
    combo = 0;
    maxCombo = 0;
    gameTime = 0;
    baseObstacleSpeed = 8;
    
    obstacles.length = 0;
    powerUps.length = 0;
    particles.length = 0;
    
    spawnTimer = 0;
    nextSpawnTime = 60;
    powerUpTimer = 0;
    nextPowerUpTime = 300;
    
    player.reset();
    
    stats.gamesPlayed++;
}

function endGame() {
    gameState = 'gameOver';
    applyScreenShake(20);
    createExplosion(player.x + player.width / 2, player.y, '#FF1744', 50);
    
    stats.totalTimePlayed += Math.floor(gameTime / 1000);
    
    if (score > highScore) {
        highScore = score;
        stats.highScore = highScore;
    }
    
    saveStats();
}

function pauseGame() {
    if (gameState === 'playing') {
        gameState = 'paused';
        document.getElementById('pauseMenu').classList.remove('hidden');
    }
}

function resumeGame() {
    if (gameState === 'paused') {
        gameState = 'playing';
        document.getElementById('pauseMenu').classList.add('hidden');
    }
}

function restartFromPause() {
    document.getElementById('pauseMenu').classList.add('hidden');
    startGame();
}

function quitToMenu() {
    gameState = 'menu';
    document.getElementById('pauseMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

// ===================================
// MENU FUNCTIONS
// ===================================

function showSettings() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('settingsMenu').classList.remove('hidden');
    
    document.getElementById('difficultySelect').value = settings.difficulty;
    document.getElementById('effectsSelect').value = settings.effects;
    document.getElementById('particleSlider').value = settings.particleDensity;
    document.getElementById('shakeSelect').value = settings.screenShake ? 'on' : 'off';
}

function saveSettings() {
    settings.difficulty = document.getElementById('difficultySelect').value;
    settings.effects = document.getElementById('effectsSelect').value;
    settings.particleDensity = parseInt(document.getElementById('particleSlider').value);
    settings.screenShake = document.getElementById('shakeSelect').value === 'on';
    
    localStorage.setItem('neonRunnerSettings', JSON.stringify(settings));
    
    document.getElementById('settingsMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function showStats() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('statsMenu').classList.remove('hidden');
    
    document.getElementById('highScoreStat').textContent = stats.highScore;
    document.getElementById('gamesPlayedStat').textContent = stats.gamesPlayed;
    document.getElementById('timePlayedStat').textContent = Math.floor(stats.totalTimePlayed / 60) + 'm';
    document.getElementById('obstaclesDodgedStat').textContent = stats.obstaclesDodged;
    document.getElementById('powerUpsCollectedStat').textContent = stats.powerUpsCollected;
    document.getElementById('perfectDodgesStat').textContent = stats.perfectDodges;
    document.getElementById('currentLevelStat').textContent = level;
}

function hideStats() {
    document.getElementById('statsMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

function resetStats() {
    if (confirm('Are you sure you want to reset all statistics? This cannot be undone.')) {
        stats = {
            gamesPlayed: 0,
            totalTimePlayed: 0,
            obstaclesDodged: 0,
            powerUpsCollected: 0,
            perfectDodges: 0,
            highScore: 0
        };
        highScore = 0;
        saveStats();
        showStats();
    }
}

function showHelp() {
    document.getElementById('mainMenu').classList.add('hidden');
    document.getElementById('helpMenu').classList.remove('hidden');
}

function hideHelp() {
    document.getElementById('helpMenu').classList.add('hidden');
    document.getElementById('mainMenu').classList.remove('hidden');
}

// ===================================
// LOCAL STORAGE
// ===================================

function loadStats() {
    const savedStats = localStorage.getItem('neonRunnerStats');
    if (savedStats) {
        stats = JSON.parse(savedStats);
        highScore = stats.highScore || 0;
    }
    
    const savedSettings = localStorage.getItem('neonRunnerSettings');
    if (savedSettings) {
        settings = JSON.parse(savedSettings);
    }
    
    const savedAchievements = localStorage.getItem('neonRunnerAchievements');
    if (savedAchievements) {
        const loaded = JSON.parse(savedAchievements);
        loaded.forEach((saved, index) => {
            if (achievements[index]) {
                achievements[index].unlocked = saved.unlocked;
            }
        });
    }
}

function saveStats() {
    localStorage.setItem('neonRunnerStats', JSON.stringify(stats));
    localStorage.setItem('neonRunnerAchievements', JSON.stringify(achievements));
}

// ===================================
// INPUT HANDLING
// ===================================

function handleGravityToggle() {
    if (gameState === 'playing') {
        player.toggleGravity();
    }
}

function handleRestart() {
    if (gameState === 'gameOver') {
        startGame();
    }
}

window.addEventListener('keydown', (e) => {
    if (e.code === 'Space') {
        e.preventDefault();
        handleGravityToggle();
    } else if (e.code === 'Escape') {
        e.preventDefault();
        if (gameState === 'playing') {
            pauseGame();
        } else if (gameState === 'paused') {
            resumeGame();
        }
    }
});

canvas.addEventListener('click', () => {
    if (gameState === 'playing') {
        handleGravityToggle();
    } else if (gameState === 'gameOver') {
        handleRestart();
    }
});

canvas.addEventListener('touchstart', (e) => {
    e.preventDefault();
    if (gameState === 'playing') {
        handleGravityToggle();
    } else if (gameState === 'gameOver') {
        handleRestart();
    }
});

// ===================================
// INITIALIZATION
// ===================================

loadStats();
requestAnimationFrame(gameLoop);

console.log('🎮 Neon Gravity Runner - Enhanced Edition loaded!');
console.log('Press SPACE or Click to flip gravity');
console.log('Press ESC to pause');
