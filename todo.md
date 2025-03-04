Here's the structured todo list following your requirements:

### Frame Structure
- [x] Create core GameCanvas component with dynamic ref-based canvas sizing (GameCanvas.tsx)
- [x] Implement base Frame layout with responsive 1:1 aspect ratio container (layout.tsx)
- [x] Set up viewport meta configuration for mobile scaling (metadata.ts)
- [x] Configure CSS touch-action: none on game container (globals.css)
- [x] Create double buffered canvas system with offscreen rendering (GameCanvas.tsx)

### UI Components & Interactions
- [x] Implement keyboard event handler for arrow keys (InputHandler.ts)
- [x] Create TouchOverlay component with swipe detection (TouchOverlay.tsx)
- [x] Build score display using shadcn Card component (ScoreDisplay.tsx)
- [x] Add visual feedback for collisions using shadcn Toast (GameManager.ts)
- [ ] Create pause/restart menu with shadcn Dropdown (GameMenu.tsx)
- [ ] Implement directional input validation middleware (InputValidator.ts)

### API Integration
- [ ] Integrate Frame SDK for share capabilities (page.tsx)
- [ ] Set up Wagmi wallet context provider (providers.tsx)
- [ ] Create share image generator using Canvas API (ShareGenerator.ts)
- [ ] Implement Frame meta tags for OG image sharing (page.tsx)
- [ ] Add vibration API integration for mobile feedback (MobileUtils.ts)

### Client-Side State Management
- [ ] Create game state machine with useReducer (gameReducer.ts)
- [ ] Implement localStorage persistence for high scores (useGameStorage.ts)
- [ ] Set up state serialization/deserialization system (gameStateUtils.ts)
- [ ] Create memoized grid calculation utilities (gridUtils.ts)
- [ ] Add mobile storage quota management checks (useStorageValidator.ts)

### User Experience & Animations
- [ ] Implement Web Audio API sound system (SoundManager.ts)
- [ ] Create pixel-perfect canvas rendering pipeline (CanvasRenderer.ts)
- [ ] Add snake body animation using gradient patterns (SnakeRenderer.ts)
- [ ] Implement game over screen with shadcn Dialog (GameOverModal.tsx)
- [ ] Create food spawn particle effect (FoodRenderer.ts)
- [ ] Add CRT screen filter effect via CSS (CRTEffect.css)

### Mobile Optimization
- [ ] Implement touch coordinate normalization (TouchNormalizer.ts)
- [ ] Add swipe distance threshold detection (SwipeDetector.ts)
- [ ] Create mobile-first responsive layout breakpoints (layout.module.css)
- [ ] Implement touch latency compensation buffer (InputBuffer.ts)
- [ ] Add CSS will-change optimizations for canvas (GameCanvas.css)
- [ ] Create device performance tier detection (PerformanceDetector.ts)
- [ ] Implement battery-conscious animation throttling (useAnimationThrottle.ts)
- [ ] Add mobile browser prefix handling (BrowserNormalizer.css)
- [ ] Create touch target size constants (touchConstants.ts)
- [ ] Implement network condition monitoring (useNetworkStatus.ts)

Tasks are ordered from foundational to dependent features, with mobile considerations integrated at each layer. The list leverages:
- Next.js App Router structure
- shadcn UI components for consistent styling
- Canvas API for rendering
- React hooks for state management
- Frame SDK v2 capabilities for social features
- Web Platform APIs for mobile optimization

No database or contract dependencies - all persistence handled through localStorage and Frame SDK's client-side capabilities.
