# 🚀 Quick Deployment Guide

## Deploy to GitHub Pages in 5 Minutes

### Step 1: Create GitHub Repository
```bash
# Initialize git (if not already done)
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Neon Gravity Runner Enhanced Edition"
```

### Step 2: Push to GitHub
```bash
# Create a new repository on GitHub first, then:
git remote add origin https://github.com/YOUR_USERNAME/neon-gravity-runner.git
git branch -M main
git push -u origin main
```

### Step 3: Enable GitHub Pages
1. Go to your repository on GitHub
2. Click **Settings**
3. Scroll to **Pages** section (left sidebar)
4. Under **Source**, select `main` branch
5. Click **Save**
6. Wait 2-3 minutes

### Step 4: Access Your Game
Your game will be live at:
```
https://YOUR_USERNAME.github.io/neon-gravity-runner
```

## Alternative: Quick Test Locally

### Option 1: Python Server
```bash
python3 -m http.server 8000
# Visit http://localhost:8000
```

### Option 2: Node.js Server
```bash
npx http-server -p 8000
# Visit http://localhost:8000
```

### Option 3: Just Open the File
```bash
open index.html
# Or double-click index.html
```

## 🎮 Test Checklist

Before deploying, test these:
- [ ] Main menu appears on load
- [ ] Start Game button works
- [ ] Gravity switching (SPACE/Click)
- [ ] Obstacles spawn and move
- [ ] Power-ups appear and work
- [ ] Collision detection accurate
- [ ] Game over screen appears
- [ ] Stats are saved (check after refresh)
- [ ] Settings persist
- [ ] Mobile touch controls (if applicable)

## 🐛 Common Issues

### "Cannot read property of undefined"
- **Fix**: Clear browser cache and refresh

### Game doesn't start
- **Fix**: Check browser console (F12) for errors

### Stats don't save
- **Fix**: Enable LocalStorage (not in incognito mode)

### Performance issues
- **Fix**: Lower visual effects in Settings menu

## 📝 Customization Before Deploy

Update these in the files:

**README.md:**
- Replace "Your Name" with your name
- Update email and social links
- Add actual screenshots

**index.html:**
- Update the `<title>` tag
- Add your favicon

**style.css:**
- Customize color scheme if desired

## 🎉 Post-Deploy

Share your game:
- Tweet it with #WebDev #GameDev
- Post on Reddit r/webdev
- Share on LinkedIn
- Add to your portfolio

## Need Help?

Check the main README.md for detailed documentation!
