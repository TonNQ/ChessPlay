import { PieceType, TeamType, Piece } from 'src/components/ChessBoard/ChessBoard'
import { Position } from 'src/models/Position'

export default class Referee {
  // check if tile is occupied
  tileIsOccupied(p: Position, boardState: Piece[]): boolean {
    const piece = boardState.find((piece) => piece.position.samePosition(p))
    return piece !== undefined
  }

  tileIsOccupiedByOpponent(p: Position, team: TeamType, boardState: Piece[]): boolean {
    const piece = boardState.find((piece) => piece.position.samePosition(p))
    return piece !== undefined && piece.teamType !== team
  }

  tileIsEmptyOrOccupiedByOpponent(p: Position, team: TeamType, boardState: Piece[]): boolean {
    return !this.tileIsOccupied(p, boardState) || this.tileIsOccupiedByOpponent(p, team, boardState)
  }

  isEnPassantMove(old_pos: Position, new_pos: Position, type: PieceType, boardState: Piece[]): boolean {
    if (type === PieceType.PAWN) {
      if ((old_pos.x === new_pos.x + 1 || old_pos.x === new_pos.x - 1) && old_pos.y - new_pos.y === 1) {
        // right or left
        const piece = boardState.find(
          (piece) => piece.position.x === new_pos.x && old_pos.y === new_pos.y - 1 && piece.enPassant
        )
        if (piece) {
          return true
        }
      }
    }
    return false
  }

  // check if the move is valid
  isValidMove(old_pos: Position, new_pos: Position, type: PieceType, team: TeamType, boardState: Piece[]) {
    // console.log('Previous x: ' + px + ' Previous y: ' + py + ' New x: ' + x + ' New y: ' + y + ' Type: ' + type);
    // console.log('Team: ' + team)
    if (type === PieceType.PAWN) {
      if (team === TeamType.USERTEAM) {
        // MOVEMENT LOGIC
        if (old_pos.x === new_pos.x) {
          if (new_pos.y - old_pos.y === 1) {
            if (!this.tileIsOccupied(new_pos, boardState)) {
              return true
            }
          } else if (old_pos.y == 1 && new_pos.y - old_pos.y === 2) {
            if (
              !this.tileIsOccupied(new_pos, boardState) &&
              !this.tileIsOccupied(new Position(new_pos.x, new_pos.y - 1), boardState)
            ) {
              return true
            }
          }
        }
        // ATTACKMENT LOGIC
        else if (old_pos.x === new_pos.x + 1 || old_pos.x === new_pos.x - 1) {
          // right or left
          if (new_pos.y - old_pos.y === 1) {
            if (this.tileIsOccupiedByOpponent(new_pos, team, boardState)) {
              return true
            }
          }
        }
      }
      // FOR COMPUTER TEAM
      //   else {
      //     if (old_pos.y === 6) {
      //       if (old_pos.x === x && (old_pos.y - y === 1 || old_pos.y - y === 2)) {
      //         return true
      //       }
      //     } else {
      //       if (old_pos.x === x && old_pos.y - y === 1) {
      //         return true
      //       }
      //     }
      //   }
    } else if (type === PieceType.KNIGHT) {
      if (team === TeamType.USERTEAM) {
        for (let i = -1; i < 2; i += 2) {
          for (let j = -1; j < 2; j += 2) {
            if (
              (new_pos.y - old_pos.y == 2 * i && new_pos.x - old_pos.x == j) ||
              (new_pos.x - old_pos.x == 2 * i && new_pos.y - old_pos.y == j)
            ) {
              if (this.tileIsEmptyOrOccupiedByOpponent(new_pos, team, boardState)) {
                return true
              }
            }
          }
        }
      }
    } else if (type === PieceType.BISHOP) {
      if (team === TeamType.USERTEAM) {
        for (let i = 1; i < 8; i++) {
          // Top right
          if (new_pos.x > old_pos.x && new_pos.y > old_pos.y) {
            const checkPosition = new Position(old_pos.x + i, old_pos.y + i)
            console.log(checkPosition)
            if (checkPosition.outOfBoard()) {
              break
            } else {
              if (
                checkPosition.samePosition(new_pos) &&
                this.tileIsEmptyOrOccupiedByOpponent(new_pos, team, boardState)
              ) {
                return true
              } else {
                if (this.tileIsOccupied(checkPosition, boardState)) {
                  break
                }
              }
            }
          }
          // Top left
          if (new_pos.x < old_pos.x && new_pos.y > old_pos.y) {
            const checkPosition = new Position(old_pos.x - i, old_pos.y + i)
            if (checkPosition.outOfBoard()) {
              break
            } else {
              if (
                checkPosition.samePosition(new_pos) &&
                this.tileIsEmptyOrOccupiedByOpponent(new_pos, team, boardState)
              ) {
                return true
              } else {
                if (this.tileIsOccupied(checkPosition, boardState)) {
                  break
                }
              }
            }
          }

          // Bottom right
          if (new_pos.x > old_pos.x && new_pos.y < old_pos.y) {
            const checkPosition = new Position(old_pos.x + i, old_pos.y - i)
            if (checkPosition.outOfBoard()) {
              break
            } else {
              if (
                checkPosition.samePosition(new_pos) &&
                this.tileIsEmptyOrOccupiedByOpponent(new_pos, team, boardState)
              ) {
                return true
              } else {
                if (this.tileIsOccupied(checkPosition, boardState)) {
                  break
                }
              }
            }
          }

          // Bottom left
          if (new_pos.x < old_pos.x && new_pos.y < old_pos.y) {
            const checkPosition = new Position(old_pos.x - i, old_pos.y - i)
            if (checkPosition.outOfBoard()) {
              break
            } else {
              if (
                checkPosition.samePosition(new_pos) &&
                this.tileIsEmptyOrOccupiedByOpponent(new_pos, team, boardState)
              ) {
                return true
              } else {
                if (this.tileIsOccupied(checkPosition, boardState)) {
                  break
                }
              }
            }
          }
        }
      }
    } else if (type === PieceType.QUEEN) {
      if (team === TeamType.USERTEAM) {
        const dx = new_pos.x - old_pos.x < 0 ? -1 : new_pos.x - old_pos.x > 0 ? 1 : 0
        const dy = new_pos.y - old_pos.y < 0 ? -1 : new_pos.y - old_pos.y > 0 ? 1 : 0
        for (let i = 1; i < 8; i++) {
          const checkPosition = new Position(old_pos.x + i * dx, old_pos.y + i * dy)
          if (
            checkPosition.samePosition(new_pos) &&
            this.tileIsEmptyOrOccupiedByOpponent(checkPosition, team, boardState)
          ) {
            return true
          } else {
            if (this.tileIsOccupied(checkPosition, boardState)) {
              break
            }
          }
        }
      }
    }
    return false
  }
  getPossibleKnightMoves(knight: Piece, boardState: Piece[]): Position[] {
    const possibleMoves: Position[] = []
    for (let i = -1; i < 2; i += 2) {
      for (let j = -1; j < 2; j += 2) {
        const horizontalMove = new Position(knight.position.x + i * 2, knight.position.y + j)
        const verticalMove = new Position(knight.position.x + j, knight.position.y + i * 2)
        if (
          !horizontalMove.outOfBoard() &&
          this.tileIsEmptyOrOccupiedByOpponent(horizontalMove, knight.teamType, boardState)
        ) {
          possibleMoves.push(verticalMove)
        }
        if (
          !verticalMove.outOfBoard() &&
          this.tileIsEmptyOrOccupiedByOpponent(verticalMove, knight.teamType, boardState)
        ) {
          possibleMoves.push(horizontalMove)
        }
      }
    }
    return possibleMoves
  }
  getPossibleBishopMoves(bishop: Piece, boardState: Piece[]): Position[] {
    const possibleMoves: Position[] = []

    // Top right
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(bishop.position.x + i, bishop.position.y + i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, bishop.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Top left
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(bishop.position.x - i, bishop.position.y + i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, bishop.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Bottom right
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(bishop.position.x + i, bishop.position.y - i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, bishop.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Bottom left
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(bishop.position.x - i, bishop.position.y - i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, bishop.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }
    return possibleMoves
  }

  getPossibleQueenMoves(queen: Piece, boardState: Piece[]): Position[] {
    const possibleMoves: Position[] = []

    // Left
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(queen.position.x - i, queen.position.y)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, queen.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Right
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(queen.position.x + i, queen.position.y)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, queen.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Top
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(queen.position.x, queen.position.y + i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, queen.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Bottom
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(queen.position.x, queen.position.y - i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, queen.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Top left
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(queen.position.x - i, queen.position.y + i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, queen.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Top right
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(queen.position.x + i, queen.position.y + i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, queen.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Bottom left
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(queen.position.x - i, queen.position.y - i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, queen.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Bottom right
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(queen.position.x + i, queen.position.y - i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, queen.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    return possibleMoves
  }
}
