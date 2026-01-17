# 🎮 Neon Gravity Runner - Enhanced Edition

![Version](https://img.shields.io/badge/version-2.0.0-brightgreen)
![License](https://img.shields.io/badge/license-MIT-blue)
![Status](https://img.shields.io/badge/status-active-success)

> **An intense, gravity-defying browser game with stunning neon aesthetics and addictive gameplay!**

Run, flip, and dodge your way through an endless neon world where gravity is your greatest ally. Switch between floor and ceiling to avoid deadly spikes, collect power-ups, and chase the ultimate high score!

---

## ✨ Features

### 🎯 Core Gameplay
- **Gravity-Switching Mechanic** - Instantly flip between floor and ceiling
- **Procedural Obstacle Generation** - Endless, randomly spawned challenges
- **Progressive Difficulty** - Game speeds up every 500 points
- **Smooth Animations** - Buttery-smooth interpolation and transitions

### 💫 Power-Up System
- **🛡️ Shield** - Protects you from one hit (5 seconds)
- **⏱️ Slow-Mo** - Slows down obstacles (3 seconds)
- **⭐ Multiplier** - 2x score multiplier (8 seconds)

### 🎨 Visual Effects
- **Particle System** - Explosions, trails, and visual feedback
- **Neon Glow Effects** - Dynamic shadows and lighting
- **Screen Shake** - Impact feedback on collisions
- **Animated Backgrounds** - Scrolling starfield
- **Pulsing Player** - Breathing effect on character

### 🏆 Progression & Achievements
- **Level System** - Progress through levels every 500 points
- **Combo System** - Build combos with perfect dodges
- **7 Achievements** - Unlock as you play
  - First Blood (100 points)
  - Survivor (500 points)
  - Pro Runner (1000 points)
  - Gravity Master (2500 points)
  - Combo King (10x combo)
  - Power Collector (50 power-ups)
  - Dodge Master (100 perfect dodges)

### 📊 Statistics Tracking
- High Score
- Total Games Played
- Total Time Played
- Obstacles Dodged
- Power-Ups Collected
- Perfect Dodges
- Current Level

### ⚙️ Customization
- **4 Difficulty Levels** - Easy, Normal, Hard, Insane
- **Visual Effects Settings** - High, Medium, Low
- **Particle Density Slider** - Adjust performance
- **Screen Shake Toggle** - Enable/disable impact effects

### 📱 Platform Support
- **Desktop** - Full keyboard and mouse support
- **Mobile** - Touch controls optimized
- **Responsive Design** - Adapts to any screen size

---

## 🎮 How to Play

### Controls
- **SPACE** or **Click/Tap** - Switch gravity
- **ESC** - Pause game

### Objective
Survive as long as possible by switching between floor and ceiling to dodge red triangular spikes. Collect power-ups to gain advantages and rack up high scores!

### Tips
1. **Master the Timing** - Switch gravity at the last moment for combo bonuses
2. **Use Power-Ups Wisely** - Shields save you, multipliers boost scores
3. **Watch the Patterns** - Obstacles spawn in predictable intervals
4. **Stay Centered** - Position yourself for quick reactions
5. **Chase Combos** - Perfect dodges give golden particle effects and combo multipliers

---

## 🚀 Getting Started

### Quick Start (No Installation Required!)
1. Download or clone this repository
2. Open `index.html` in any modern browser
3. Click "START GAME" and play!

### Hosting on GitHub Pages
1. Create a new repository on GitHub
2. Upload all files (`index.html`, `style.css`, `game.js`)
3. Go to Settings → Pages
4. Select `main` branch as source
5. Your game will be live at `https://labib1610.github.io/repo-name`

### Local Development
```bash
# Clone the repository
git clone https://github.com/yourusername/neon-gravity-runner.git

# Navigate to directory
cd neon-gravity-runner

# Open in browser (or use a local server)
open index.html

# Or use Python's built-in server
python3 -m http.server 8000
# Then visit http://localhost:8000
```

---

## 🏗️ Project Structure

```
neon-gravity-runner/
│
├── index.html          # Main HTML structure with menus
├── style.css           # Neon-themed styling and UI
├── game.js             # Complete game logic (1000+ lines)
└── README.md           # This file
```

### Code Organization (`game.js`)
- **Configuration** - Difficulty and effects settings
- **Game State** - Score, level, combo management
- **Particle System** - Dynamic particle effects
- **Player Class** - Character logic and rendering
- **Obstacle Class** - Enemy spike generation
- **Power-Up Class** - Collectible items
- **Background Effects** - Animated starfield
- **Collision Detection** - AABB bounding boxes
- **Achievement System** - Unlock tracking
- **Level System** - Progression management
- **Game Loop** - RequestAnimationFrame based
- **Rendering** - Canvas 2D API
- **Input Handling** - Keyboard, mouse, touch
- **Local Storage** - Save/load stats and settings

---

## 🎨 Customization Guide

### Changing Colors
```javascript
// In game.js, modify these color values:
player.color = '#39FF14';     // Neon green
obstacle.color = '#FF1744';   // Neon red
const lineColor = '#00D9FF';  // Neon blue
```

### Adjusting Difficulty
```javascript
// Modify CONFIG object in game.js:
const CONFIG = {
    difficulty: {
        normal: { 
            speedMultiplier: 1.5,  // Increase for harder
            spawnRate: 0.8         // Decrease for more obstacles
        }
    }
};
```

### Performance Tuning
```javascript
// Reduce particles for better performance:
const CONFIG = {
    effects: {
        medium: { 
            particles: 30,   // Lower = better performance
            glow: 10,        // Lower = better performance
            trails: false    // Disable for major boost
        }
    }
};
```

---

## 🔧 Technical Details

### Technologies Used
- **HTML5 Canvas** - 2D rendering
- **Vanilla JavaScript (ES6+)** - Game logic
- **CSS3** - UI styling and animations
- **LocalStorage API** - Data persistence
- **RequestAnimationFrame** - Smooth 60 FPS loop
- **Google Fonts** - Orbitron font family

### Browser Compatibility
- ✅ Chrome 80+
- ✅ Firefox 75+
- ✅ Safari 13+
- ✅ Edge 80+
- ✅ Mobile browsers (iOS Safari, Chrome Mobile)

### Performance
- **60 FPS** on modern devices
- **Optimized rendering** - Minimal redraws
- **Efficient collision detection** - AABB algorithm
- **Particle pooling** - Memory-efficient
- **Configurable effects** - Scale down for older devices

---

## 🎯 Game Mechanics Deep Dive

### Gravity System
The player smoothly interpolates between two Y positions using linear interpolation (lerp):
```javascript
this.y += (this.targetY - this.y) * this.lerpSpeed;
```
This creates a sliding effect instead of instant teleportation.

### Combo System
Perfect dodges occur when you pass an obstacle within 20 pixels:
```javascript
const distance = Math.abs(this.x + this.size - player.x);
if (distance < 20) {
    combo++;  // Build combo
} else {
    combo = 0;  // Reset
}
```

### Difficulty Progression
Speed increases every 500 points:
```javascript
const difficultyLevel = Math.floor(score / 500);
baseObstacleSpeed = 8 + difficultyLevel * 0.5;
```

### Particle Physics
Particles have velocity, gravity, and decay:
```javascript
this.x += this.vx;
this.y += this.vy;
this.vy += 0.2;  // Gravity
this.life -= this.decay;
```

---

## 🏆 Achievement Guide

| Achievement | Requirement | Tip |
|------------|-------------|-----|
| First Blood | Score 100 | Just survive the first minute |
| Survivor | Score 500 | Master the basic timing |
| Pro Runner | Score 1000 | Use power-ups strategically |
| Gravity Master | Score 2500 | Perfection required |
| Combo King | 10x combo | Perfect dodge 10 obstacles in a row |
| Power Collector | 50 power-ups | Play multiple games |
| Dodge Master | 100 perfect dodges | Risk/reward: pass close! |

---

## 🐛 Troubleshooting

### Game runs slowly
1. Lower visual effects in Settings
2. Reduce particle density slider
3. Disable screen shake
4. Close other browser tabs

### Controls not working
1. Click on the game canvas
2. Ensure browser window is focused
3. Try refreshing the page

### Stats not saving
1. Check browser's LocalStorage is enabled
2. Not using incognito/private mode
3. Clear cache and restart

### Mobile touch issues
1. Enable touch scrolling prevention
2. Use fullscreen mode
3. Try landscape orientation

---

## 📈 Future Enhancements (Roadmap)

### v2.1 (Planned)
- [ ] Sound effects and background music
- [ ] Multiple themes (Cyberpunk, Retrowave, Matrix)
- [ ] Daily challenges
- [ ] Online leaderboards
- [ ] Boss battles every 10 levels

### v2.2 (Ideas)
- [ ] Multiplayer race mode
- [ ] Custom obstacle editor
- [ ] Replay system
- [ ] Social media sharing
- [ ] Mobile app version

---

## 🤝 Contributing

Contributions are welcome! Here's how you can help:

1. **Fork** the repository
2. **Create** a feature branch (`git checkout -b feature/AmazingFeature`)
3. **Commit** your changes (`git commit -m 'Add some AmazingFeature'`)
4. **Push** to the branch (`git push origin feature/AmazingFeature`)
5. **Open** a Pull Request

### Development Guidelines
- Keep code modular and commented
- Test on multiple browsers
- Maintain 60 FPS performance
- Follow existing code style
- Update README for new features

---

## 📄 License

This project is licensed under the MIT License - see below for details:

```
MIT License

Copyright (c) 2026 Neon Gravity Runner

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

## 🎓 Learning Resources

Want to understand the code better? Check out these concepts:

- **HTML5 Canvas API** - [MDN Canvas Tutorial](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial)
- **RequestAnimationFrame** - [Game Loop Patterns](https://developer.mozilla.org/en-US/docs/Web/API/window/requestAnimationFrame)
- **Collision Detection** - [AABB Algorithm](https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection)
- **Linear Interpolation** - [Lerp Explained](https://en.wikipedia.org/wiki/Linear_interpolation)
- **Particle Systems** - [Game Dev Particles](https://gameprogrammingpatterns.com/object-pool.html)

---

## 💬 Community & Support

- **Issues** - Report bugs on GitHub Issues
- **Discussions** - Share ideas in GitHub Discussions
- **Email** - your.email@example.com (Update this!)
- **Twitter** - @yourusername (Update this!)

---

## 🌟 Credits

**Developer** - Your Name  
**Font** - Orbitron by Google Fonts  
**Inspiration** - Classic arcade endless runners  
**Built with** - ❤️, ☕, and lots of late nights

---

## 📸 Screenshots

### Main Menu
![Main Menu](https://via.placeholder.com/800x450/111111/39FF14?text=NEON+RUNNER+-+Main+Menu)

### Gameplay
![Gameplay](https://via.placeholder.com/800x450/111111/FF1744?text=Intense+Neon+Action!)

### Settings
![Settings](https://via.placeholder.com/800x450/111111/00D9FF?text=Customization+Options)

---

## 🎉 Thank You!

Thank you for playing **Neon Gravity Runner**! If you enjoyed the game, please:
- ⭐ Star this repository
- 🍴 Fork and customize it
- 🐛 Report any bugs you find
- 💡 Suggest new features
- 📢 Share with friends!

---

**Made with 💚 for the love of gaming**

*Press SPACE to continue...*
