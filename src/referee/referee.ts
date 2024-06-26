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
      console.log('old_pos', old_pos)
      console.log('new_pos', new_pos)
      if ((old_pos.x === new_pos.x + 1 || old_pos.x === new_pos.x - 1) && Math.abs(old_pos.y - new_pos.y) === 1) {
        // right or left
        const piece = boardState.find(
          (p) => p.position.x === new_pos.x && Math.abs(old_pos.y - new_pos.y) === 1 && p.enPassant
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
    if (type === PieceType.PAWN) {
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
    } else if (type === PieceType.BISHOP) {
      for (let i = 1; i < 8; i++) {
        // Top right
        if (new_pos.x > old_pos.x && new_pos.y > old_pos.y) {
          const checkPosition = new Position(old_pos.x + i, old_pos.y + i)
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
    } else if (type === PieceType.ROOK) {
      // horizontal move
      if (old_pos.x === new_pos.x) {
        const multipler = new_pos.y - old_pos.y < 0 ? -1 : 1
        for (let i = 1; i < 8; i++) {
          const passedPosition: Position = new Position(old_pos.x, old_pos.y + i * multipler)
          if (passedPosition.samePosition(new_pos)) {
            if (this.tileIsEmptyOrOccupiedByOpponent(new_pos, team, boardState)) {
              return true
            }
          } else {
            if (this.tileIsOccupied(passedPosition, boardState)) {
              break
            }
          }
        }
      }

      // vertical move
      if (old_pos.y === new_pos.y) {
        const multipler = new_pos.x - old_pos.x < 0 ? -1 : 1
        for (let i = 1; i < 8; i++) {
          const passedPosition: Position = new Position(old_pos.x + i * multipler, old_pos.y)
          if (passedPosition.samePosition(new_pos)) {
            if (this.tileIsEmptyOrOccupiedByOpponent(new_pos, team, boardState)) {
              return true
            }
          } else {
            if (this.tileIsOccupied(passedPosition, boardState)) {
              break
            }
          }
        }
      }
      return false
    } else if (type === PieceType.QUEEN) {
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
    } else if (type === PieceType.KING) {
      const dx = new_pos.x - old_pos.x < 0 ? -1 : new_pos.x - old_pos.x > 0 ? 1 : 0
      const dy = new_pos.y - old_pos.y < 0 ? -1 : new_pos.y - old_pos.y > 0 ? 1 : 0

      const checkPosition = new Position(old_pos.x + dx, old_pos.y + dy)
      if (
        checkPosition.samePosition(new_pos) &&
        this.tileIsEmptyOrOccupiedByOpponent(checkPosition, team, boardState)
      ) {
        return true
      } else {
        return false
      }
    }
  }

  getPossiblePawnMoves = (pawn: Piece, boardState: Piece[]): Position[] => {
    const possibleMoves: Position[] = []

    const specialRow = 1

    const normalMove = new Position(pawn.position.x, pawn.position.y + 1)
    const specialMove = new Position(normalMove.x, normalMove.y + 1)
    const upperLeftAttack = new Position(pawn.position.x - 1, pawn.position.y + 1)
    const upperRightAttack = new Position(pawn.position.x + 1, pawn.position.y + 1)
    const leftPosition = new Position(pawn.position.x - 1, pawn.position.y)
    const rightPosition = new Position(pawn.position.x + 1, pawn.position.y)

    if (!this.tileIsOccupied(normalMove, boardState)) {
      possibleMoves.push(normalMove)

      if (pawn.position.y === specialRow && !this.tileIsOccupied(specialMove, boardState)) {
        possibleMoves.push(specialMove)
      }
    }

    if (this.tileIsOccupiedByOpponent(upperLeftAttack, pawn.teamType, boardState)) {
      possibleMoves.push(upperLeftAttack)
    } else if (!this.tileIsOccupied(upperLeftAttack, boardState)) {
      const leftPiece = boardState.find((p) => p.position.samePosition(leftPosition))
      if (leftPiece != null && this.isEnPassantMove(pawn.position, upperLeftAttack, PieceType.PAWN, boardState)) {
        possibleMoves.push(upperLeftAttack)
      }
    }

    if (this.tileIsOccupiedByOpponent(upperRightAttack, pawn.teamType, boardState)) {
      possibleMoves.push(upperRightAttack)
    } else if (!this.tileIsOccupied(upperRightAttack, boardState)) {
      const rightPiece = boardState.find((p) => p.position.samePosition(rightPosition))
      if (rightPiece != null && this.isEnPassantMove(pawn.position, upperRightAttack, PieceType.PAWN, boardState)) {
        possibleMoves.push(upperRightAttack)
      }
    }

    return possibleMoves
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
          possibleMoves.push(horizontalMove)
        }
        if (
          !verticalMove.outOfBoard() &&
          this.tileIsEmptyOrOccupiedByOpponent(verticalMove, knight.teamType, boardState)
        ) {
          possibleMoves.push(verticalMove)
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

  getPossibleRookMoves(rook: Piece, boardState: Piece[]): Position[] {
    const possibleMoves: Position[] = []

    // Left
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(rook.position.x - i, rook.position.y)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, rook.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Right
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(rook.position.x + i, rook.position.y)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, rook.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Top
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(rook.position.x, rook.position.y + i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, rook.teamType, boardState)) {
          possibleMoves.push(destinationPosition)
          break
        } else {
          break
        }
      }
    }

    // Bottom
    for (let i = 1; i < 8; i++) {
      const destinationPosition = new Position(rook.position.x, rook.position.y - i)
      if (destinationPosition.outOfBoard()) {
        break
      } else {
        if (!this.tileIsOccupied(destinationPosition, boardState)) {
          possibleMoves.push(destinationPosition)
        } else if (this.tileIsOccupiedByOpponent(destinationPosition, rook.teamType, boardState)) {
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

  getPossibleKingMoves(king: Piece, boardState: Piece[]): Position[] {
    const possibleMoves: Position[] = []

    for (let i = -1; i < 2; i++) {
      for (let j = -1; j < 2; j++) {
        const destinationPosition = new Position(king.position.x + i, king.position.y + j)
        if (
          !destinationPosition.outOfBoard() &&
          this.tileIsEmptyOrOccupiedByOpponent(destinationPosition, king.teamType, boardState)
        ) {
          possibleMoves.push(destinationPosition)
        }
      }
    }

    const safeMoves: Position[] = []

    for (const move of possibleMoves) {
      let safe: boolean = true
      const piece: Piece = { ...king, position: move.copy() }
      const cloneBoardState = [
        ...boardState.filter(
          (p) => !p.position.samePosition(move) && !(p.teamType === TeamType.USERTEAM && p.type === PieceType.KING)
        ),
        piece
      ]
      for (const piece of cloneBoardState) {
        if (piece.teamType === TeamType.USERTEAM || piece.position.samePosition(move)) continue
        if (piece.type !== PieceType.PAWN && piece.type !== PieceType.KING) {
          const computerMoves = this.getPossibleMoves(piece, cloneBoardState)
          if (computerMoves.find((m) => m.samePosition(move))) {
            safe = false
            break
          }
        } else if (piece.type === PieceType.PAWN) {
          if (move.y === piece.position.y - 1 && Math.abs(move.x - piece.position.x) === 1) {
            safe = false
            break
          }
        } else if (
          piece.type === PieceType.KING &&
          Math.abs(move.x - piece.position.x) <= 1 &&
          Math.abs(move.y - piece.position.y) <= 1
        ) {
          // Tìm ra các ô của vua đen, kiểm tra vua trắng đi được không
          safe = false
          break
        }
      }
      if (safe) {
        safeMoves.push(move)
      }
    }
    return safeMoves
  }

  getCastlingMoves(king: Piece, boardState: Piece[]): Position[] {
    if (king.hasMoved) return []
    // Kiểm tra quân vua có đang bị chiếu tướng không
    const enemyPieces = boardState.filter((p) => p.teamType === TeamType.COMPUTERTEAM)
    for (const enemy of enemyPieces) {
      const moves = this.getPossibleMoves(enemy, boardState)
      if (moves.find((m) => m.samePosition(king.position))) {
        return []
      }
    }

    const possibleMoves: Position[] = []
    const rooks = boardState.filter((p) => p.type === PieceType.ROOK && p.teamType === TeamType.USERTEAM && !p.hasMoved)
    for (const rook of rooks) {
      // Queenside rook
      if (rook.position.samePosition(new Position(0, 0))) {
        const moves = this.getPossibleMoves(rook, boardState)
        if (moves.filter((move) => move.y === king.position.y).length === 3) {
          possibleMoves.push(rook.position)
        }
      }
      // Kingside rook
      else if (rook.position.samePosition(new Position(7, 0))) {
        const moves = this.getPossibleMoves(rook, boardState)
        if (moves.filter((move) => move.y === king.position.y).length === 2) {
          possibleMoves.push(rook.position)
        }
      }
    }
    return possibleMoves
  }

  // Những nước đi có thể đi của mỗi quân cờ (chưa tính trường hợp king danger)
  getPossibleMoves(piece: Piece, boardState: Piece[]): Position[] {
    if (piece.type === PieceType.BISHOP) {
      return this.getPossibleBishopMoves(piece, boardState)
    } else if (piece.type === PieceType.KING) {
      return this.getPossibleKingMoves(piece, boardState)
    } else if (piece.type === PieceType.KNIGHT) {
      return this.getPossibleKnightMoves(piece, boardState)
    } else if (piece.type === PieceType.PAWN) {
      return this.getPossiblePawnMoves(piece, boardState)
    } else if (piece.type === PieceType.QUEEN) {
      return this.getPossibleQueenMoves(piece, boardState)
    } else if (piece.type === PieceType.ROOK) {
      return this.getPossibleRookMoves(piece, boardState)
    } else {
      return []
    }
  }

  getPossibleMovesWithoutKingDanger(chosenPiece: Piece, boardState: Piece[]): Position[] {
    const moves = this.getPossibleMoves(chosenPiece, boardState)

    // Nếu là vua thì trả về hàm getPossibleMoves vì đã xử lý king danger ở hàm getPossibleKingMoves
    if (chosenPiece.type === PieceType.KING) {
      return moves
    }

    const safeMoves: Position[] = []

    const kingPiece = boardState.find((piece) => piece.teamType === TeamType.USERTEAM && piece.type === PieceType.KING)
    console.log('kingPiece', kingPiece)
    for (const move of moves) {
      let safe: boolean = true
      const simulatedPiece: Piece = { ...chosenPiece, position: move.copy() }
      if (kingPiece === undefined) return []
      else {
        const cloneBoardState = [
          ...boardState.filter(
            (p) =>
              !p.position.samePosition(chosenPiece.position) &&
              !(p.teamType === TeamType.USERTEAM && p.type === PieceType.KING)
          ),
          simulatedPiece
        ]
        console.log(cloneBoardState)
        for (const piece of cloneBoardState) {
          if (piece.teamType === TeamType.USERTEAM || piece.position.samePosition(move)) continue
          // Còn lại là quân địch
          if (piece.type !== PieceType.PAWN && piece.type !== PieceType.KING) {
            const computerMoves = this.getPossibleMoves(piece, cloneBoardState)
            if (piece.type === PieceType.QUEEN) {
              console.log('computermoves', computerMoves)
            }
            if (computerMoves.find((m) => m.samePosition(kingPiece.position))) {
              safe = false
              break
            }
          } else if (piece.type === PieceType.PAWN) {
            if (
              kingPiece.position.y === piece.position.y - 1 &&
              Math.abs(kingPiece.position.x - piece.position.x) === 1
            ) {
              safe = false
              break
            }
          }
        }
        if (safe) {
          console.log(move)
          safeMoves.push(move)
        }
      }
    }
    return safeMoves
  }

  isCheckmate(king: Piece, boardState: Piece[]): boolean {
    const enemyPieces = boardState.filter((p) => p.teamType !== king.teamType)
    for (const enemy of enemyPieces) {
      if (enemy.type === PieceType.PAWN) {
        if (
          Math.abs(king.position.x - enemy.position.x) === 1 &&
          ((enemy.teamType === TeamType.COMPUTERTEAM && king.position.y === enemy.position.y - 1) ||
            (enemy.teamType === TeamType.USERTEAM && king.position.y === enemy.position.y + 1))
        ) {
          return true
        }
      } else {
        const moves = this.getPossibleMoves(enemy, boardState)
        if (moves.find((m) => m.samePosition(king.position))) {
          return true
        }
      }
    }
    return false
  }
}
