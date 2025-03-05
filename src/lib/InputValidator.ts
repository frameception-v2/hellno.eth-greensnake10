import type { Direction } from './InputHandler';

export class InputValidator {
  private handler: any;
  private lastValidDirection: Direction = null;

  constructor(handler: any) {
    this.handler = handler;
  }

  get currentDirection(): Direction {
    return this.handler.currentDirection;
  }

  set currentDirection(newDirection: Direction) {
    if (this.isValidDirectionChange(newDirection)) {
      this.lastValidDirection = newDirection;
      this.handler.currentDirection = newDirection;
    }
  }

  private isValidDirectionChange(newDirection: Direction): boolean {
    if (!this.lastValidDirection || !newDirection) return true;
    
    const oppositeDirections: Record<Direction, Direction> = {
      up: 'down',
      down: 'up',
      left: 'right',
      right: 'left',
      null: null
    };

    return newDirection !== oppositeDirections[this.lastValidDirection];
  }

  // Proxy other properties/methods
  get lastDirection() { return this.handler.lastDirection; }
  get keys() { return this.handler.keys; }
  destroy() { this.handler.destroy(); }
}
