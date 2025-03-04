type Direction = 'up' | 'down' | 'left' | 'right' | null;

export class InputHandler {
  private currentDirection: Direction = null;
  private lastDirection: Direction = null;
  private keys: Set<string> = new Set();

  constructor() {
    this.initEventListeners();
  }

  private handleKeyDown = (e: KeyboardEvent) => {
    if (e.key.startsWith('Arrow')) {
      e.preventDefault();
      this.keys.add(e.key);
      this.updateDirection();
    }
  };

  private handleKeyUp = (e: KeyboardEvent) => {
    if (e.key.startsWith('Arrow')) {
      this.keys.delete(e.key);
      this.updateDirection();
    }
  };

  private updateDirection() {
    this.lastDirection = this.currentDirection;
    
    if (this.keys.has('ArrowUp')) {
      this.currentDirection = 'up';
    } else if (this.keys.has('ArrowDown')) {
      this.currentDirection = 'down';
    } else if (this.keys.has('ArrowLeft')) {
      this.currentDirection = 'left';
    } else if (this.keys.has('ArrowRight')) {
      this.currentDirection = 'right';
    } else {
      this.currentDirection = null;
    }
  }

  private initEventListeners() {
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
  }

  public get direction(): Direction {
    return this.currentDirection;
  }

  public get directionChanged(): boolean {
    return this.currentDirection !== this.lastDirection;
  }

  public destroy() {
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
  }
}
