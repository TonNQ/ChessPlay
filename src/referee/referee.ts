import { PieceType, TeamType, Piece } from 'src/components/ChessBoard/ChessBoard'

export default class Referee {
  // check if tile is occupied
  tileIsOccupied(x: number, y: number, boardState: Piece[]): boolean {
    const piece = boardState.find((p) => p.x === x && p.y === y)
    return piece !== undefined
  }

  // check if the move is valid
  isValidMove(px: number, py: number, x: number, y: number, type: PieceType, team: TeamType, boardState: Piece[]) {
    // console.log('Previous x: ' + px + ' Previous y: ' + py + ' New x: ' + x + ' New y: ' + y + ' Type: ' + type);
    // console.log('Team: ' + team)
    if (type === PieceType.PAWN) {
      if (team === TeamType.USERTEAM) {
        if (px === x && y - py === 1) {
          if (!this.tileIsOccupied(x, y, boardState)) {
            return true
          }
        } else if (py == 1 && px === x && y - py === 2) {
          if (!this.tileIsOccupied(x, y, boardState) && !this.tileIsOccupied(x, y - 1, boardState)) {
            return true
          }
        }
      }
      // FOR COMPUTER TEAM
      //   else {
      //     if (py === 6) {
      //       if (px === x && (py - y === 1 || py - y === 2)) {
      //         return true
      //       }
      //     } else {
      //       if (px === x && py - y === 1) {
      //         return true
      //       }
      //     }
      //   }
    }
    return false
  }
}
