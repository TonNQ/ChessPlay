export class Position {
  x: number
  y: number
  constructor(x: number, y: number) {
    this.x = x
    this.y = y
  }

  samePosition(other: Position): boolean {
    return this.x === other.x && this.y === other.y
  }

  copy(): Position {
    return new Position(this.x, this.y)
  }

  outOfBoard(): boolean {
    return this.x < 0 || this.x > 7 || this.y < 0 || this.y > 7
  }
}
