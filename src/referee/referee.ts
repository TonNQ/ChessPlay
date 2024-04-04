import { PieceType, TeamType, Piece } from 'src/components/ChessBoard/ChessBoard'
import { Position } from 'src/models/Position'

export default class Referee {
  // check if tile is occupied
  tileIsOccupied(p: Position, boardState: Piece[]): boolean {
    const piece = boardState.find((piece) => piece.position.x === p.x && piece.position.y === p.y)
    return piece !== undefined
  }

  tileIsOccupiedByOpponent(p: Position, team: TeamType, boardState: Piece[]): boolean {
    const piece = boardState.find((piece) => piece.position.x === p.x && piece.position.y === p.y)
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
        console.log('userteam')
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
    }
    return false
  }
}
