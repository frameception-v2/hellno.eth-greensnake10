```markdown
# Maschine-Snake Farcaster Frame v2 Specification

## 1. OVERVIEW

### Core Functionality
- Mobile-first Snake game implementation within Farcaster Frame v2
- Real-time canvas rendering for game mechanics
- Score tracking with victory condition at length 10
- Retro-styled visual theme with green snake
- Embedded instructions and persistent score display
- Touch and keyboard input support

### UX Flow
1. Frame Initialization:
   - Load retro-styled game interface
   - Display subtitle with swipe/key instructions
   - Show initial snake position and first food item

2. Gameplay Loop:
   - Continuous snake movement with directional control
   - Food consumption and score increment
   - Collision detection (walls/self)
   - Real-time score updates

3. End States:
   - Victory screen at length 10
   - Game over screen on collision
   - Restart option with preserved styling

## 2. TECHNICAL REQUIREMENTS

### Frontend Components
```tsx
// components/GameCanvas.tsx
"use client";
import { useEffect, useRef, useState } from 'react';

const GRID_SIZE = 20;
const INITIAL_SNAKE = [{x: 5, y: 5}];

export default function GameCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [direction, setDirection] = useState({x: 1, y: 0});
  const [snake, setSnake] = useState(INITIAL_SNAKE);
  const [food, setFood] = useState({x: 15, y: 15});

  // Game loop and drawing logic
  useEffect(() => {
    const ctx = canvasRef.current?.getContext('2d');
    if (!ctx) return;

    const gameLoop = () => {
      if (gameOver) return;
      
      // Movement and collision logic
      const newHead = {
        x: (snake[0].x + direction.x + GRID_SIZE) % GRID_SIZE,
        y: (snake[0].y + direction.y + GRID_SIZE) % GRID_SIZE
      };

      // Collision detection
      if (snake.some(segment => segment.x === newHead.x && segment.y === newHead.y)) {
        setGameOver(true);
        return;
      }

      // Food consumption
      if (newHead.x === food.x && newHead.y === food.y) {
        setScore(prev => prev + 1);
        setFood({
          x: Math.floor(Math.random() * GRID_SIZE),
          y: Math.floor(Math.random() * GRID_SIZE)
        });
      } else {
        snake.pop();
      }

      setSnake([newHead, ...snake]);
      
      // Canvas drawing
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      
      // Draw snake
      ctx.fillStyle = '#00ff00';
      snake.forEach(segment => {
        ctx.fillRect(
          segment.x * (ctx.canvas.width/GRID_SIZE),
          segment.y * (ctx.canvas.height/GRID_SIZE),
          (ctx.canvas.width/GRID_SIZE) - 1,
          (ctx.canvas.height/GRID_SIZE) - 1
        );
      });

      requestAnimationFrame(gameLoop);
    };

    const interval = setInterval(gameLoop, 150);
    return () => clearInterval(interval);
  }, [snake, direction, food, gameOver]);

  // Input handling
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      switch(e.key) {
        case 'ArrowUp': setDirection({x: 0, y: -1}); break;
        case 'ArrowDown': setDirection({x: 0, y: 1}); break;
        case 'ArrowLeft': setDirection({x: -1, y: 0}); break;
        case 'ArrowRight': setDirection({x: 1, y: 0}); break;
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  return (
    <div className="relative">
      <div className="retro-font text-green-500 text-center">
        <h2 className="text-xl">Score: {score}</h2>
        <p className="text-sm">Swipe or use arrow keys</p>
      </div>
      <canvas 
        ref={canvasRef}
        className="border-4 border-green-500 rounded-lg"
        style={{width: '100%', maxWidth: '400px', touchAction: 'none'}}
      />
      {gameOver && (
        <div className="retro-overlay">
          <button 
            onClick={() => {
              setSnake(INITIAL_SNAKE);
              setScore(0);
              setGameOver(false);
            }}
            className="retro-button"
          >
            {score >= 10 ? 'YOU WIN!' : 'TRY AGAIN'}
          </button>
        </div>
      )}
    </div>
  );
}
```

### API Integrations
- Frame SDK for wallet context (sdk.context)
- Wagmi for Ethereum provider connection
- No external APIs required

### State Management
- useState for game state (snake position, food location, score)
- useRef for canvas reference
- Directional state managed through keyboard/touch events
- Game loop managed with requestAnimationFrame

### Mobile Responsiveness
- Viewport meta tag: `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">`
- CSS Grid for layout adaptation
- Canvas size based on container width
- Touch gesture detection:
```ts
// Touch handling implementation
const [touchStart, setTouchStart] = useState({x: 0, y: 0});

const handleTouchStart = (e: TouchEvent) => {
  setTouchStart({
    x: e.touches[0].clientX,
    y: e.touches[0].clientY
  });
};

const handleTouchEnd = (e: TouchEvent) => {
  const dx = e.changedTouches[0].clientX - touchStart.x;
  const dy = e.changedTouches[0].clientY - touchStart.y;
  
  if (Math.abs(dx) > Math.abs(dy)) {
    setDirection(dx > 0 ? {x: 1, y: 0} : {x: -1, y: 0});
  } else {
    setDirection(dy > 0 ? {x: 0, y: 1} : {x: 0, y: -1});
  }
};
```

## 3. FRAMES v2 IMPLEMENTATION

### Interactive Elements
- Canvas-based game board
- Touch/swipe detection
- Keyboard input handling
- Dynamic score display
- Victory/defeat overlays

### Animation
- requestAnimationFrame for smooth updates
- CSS transitions for UI elements
- Retro-style pixel animations
- Snake movement at 150ms intervals

### Input Handling
- Keyboard events (Arrow keys)
- Touch gesture recognition
- Swipe direction detection
- Button-less interaction model

### Notifications
- In-canvas victory/defeat messages
- Score counter animation
- Direction change indicators

### Sharing
- Frame SDK's share capability:
```ts
sdk.actions.share({
  text: `I scored ${score} in Maschine-Snake!`,
  url: window.location.href
});
```

## 4. MOBILE CONSIDERATIONS

### Touch Patterns
- Swipe detection in 4 directions
- Touchstart/touchend event handlers
- Prevent default touch actions
- Visual touch feedback overlay

### Responsive Layout
- Fluid canvas sizing:
```css
canvas {
  width: 100%;
  height: auto;
  aspect-ratio: 1/1;
}
```
- Media queries for different aspect ratios
- Viewport unit scaling for text

### Performance
- Debounced animation frames
- Memoized game state
- Off-canvas buffer for rendering
- Hardware acceleration via will-change

## 5. CONSTRAINTS COMPLIANCE

### Data Storage
- No persistent storage required
- All state managed client-side
- Session-only game state

### Blockchain
- No smart contract interactions
- Wallet connection optional
- Pure client-side execution
```